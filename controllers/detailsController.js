const { fetchFromTMDB } = require('../services/tmdb');
const { getImageUrl } = require('../utils/urlHelper');

const logRequest = (message, data) => {
    if (process.env.NODE_ENV === 'development') {
        console.log(`[${new Date().toISOString()}] ${message}`, data || '');
    }
};

const validateMediaParams = (type, id) => {
    if (!['movie', 'tv'].includes(type)) {
        return {
            valid: false,
            error: 'Invalid media type. Must be either "movie" or "tv"',
            statusCode: 400
        };
    }

    const numId = Number(id);
    if (!id || isNaN(numId) || numId <= 0) {
        return {
            valid: false,
            error: 'Invalid ID. Must be a positive number',
            statusCode: 400
        };
    }

    return { valid: true, type, id: numId };
};

const createMetadata = (type, details) => ({
    pagination: {
        page: 1,
        total_pages: 1,
        total_results: 1,
        has_next: false,
        has_prev: false
    },
    links: {
        self: `/api/details/${type}/${details.id}`,
        canonical: `/${type}/${details.id}`,
        player: `/api/player/${type}/${details.id}`
    },
    type,
    title: details.title || details.name,
    description: details.overview || 'No description available.',
    image: getImageUrl(details.backdrop_path || details.poster_path, 'original'),
    timestamp: new Date().toISOString()
});

const extractTrailerUrl = (videos) => {
    if (!videos?.results?.length) return null;

    const trailer = videos.results.find(v =>
        v.type === "Trailer" &&
        v.site === "YouTube" &&
        v.official === true
    ) || videos.results.find(v =>
        v.type === "Trailer" &&
        v.site === "YouTube"
    );

    return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
};

const processCast = (credits) => {
    if (!credits?.cast?.length) return [];

    return credits.cast
        .slice(0, 20)
        .map(person => ({
            id: person.id,
            name: person.name,
            character: person.character || 'Unknown',
            profile: getImageUrl(person.profile_path, 'w185'),
            view_cast_link: `/api/cast/${person.id}`,
            order: person.order || 999
        }))
        .sort((a, b) => a.order - b.order);
};

const processRecommendations = (recommendations, type) => {
    if (!recommendations?.results?.length) return [];

    return recommendations.results
        .filter(rec => rec.poster_path || rec.backdrop_path)
        .slice(0, 12)
        .map(rec => ({
            id: rec.id,
            type: rec.media_type || type,
            title: rec.title || rec.name || 'Untitled',
            overview: rec.overview || null,
            poster: getImageUrl(rec.poster_path, 'w342'),
            backdrop: getImageUrl(rec.backdrop_path, 'w780'),
            year: (rec.release_date || rec.first_air_date || '').split('-')[0] || null,
            rating: rec.vote_average ? Math.round(rec.vote_average * 10) / 10 : null,
            details_link: `/api/details/${rec.media_type || type}/${rec.id}`
        }));
};

const processSeasons = (details) => {
    if (!details.seasons?.length) return [];

    return details.seasons
        .filter(s => s && s.season_number > 0)
        .map(s => ({
            number: s.season_number,
            name: s.name || `Season ${s.season_number}`,
            episode_count: s.episode_count || 0,
            air_date: s.air_date || null,
            poster: getImageUrl(s.poster_path, 'w780') || getImageUrl(details.poster_path, 'w780'),
            overview: s.overview || 'No overview available.'
        }))
        .sort((a, b) => a.number - b.number);
};

const buildMediaInfo = (details, type, videos) => {
    const backdrop = details.backdrop_path || details.poster_path;

    const mediaInfo = {
        id: details.id,
        type,
        title: details.title || details.name,
        tagline: details.tagline || null,
        overview: details.overview || 'No overview available.',
        runtime: details.runtime || (details.episode_run_time?.[0] || null),
        release_date: details.release_date || details.first_air_date || null,
        rating: details.vote_average ? Math.round(details.vote_average * 10) / 10 : null,
        vote_count: details.vote_count || 0,
        popularity: details.popularity || 0,
        genres: details.genres || [],
        backdrop: getImageUrl(backdrop, 'original'),
        poster: getImageUrl(details.poster_path || details.backdrop_path, 'w780'),
        trailer_url: extractTrailerUrl(videos),
        homepage: details.homepage || null,
        status: details.status || null,
        original_language: details.original_language || 'en',
        original_title: details.original_title || details.original_name || null,
        production_companies: (details.production_companies || []).map(company => ({
            id: company.id,
            name: company.name,
            logo: getImageUrl(company.logo_path, 'w500'),
            origin_country: company.origin_country
        })),
        production_countries: details.production_countries || [],
        spoken_languages: details.spoken_languages || []
    };

    return mediaInfo;
};

const buildResponse = (type, details, credits, recommendations, videos) => {
    const response = {
        success: true,
        view_path: `/api/details/${type}/${details.id}`,
        meta: createMetadata(type, details),
        info: buildMediaInfo(details, type, videos),
        cast: processCast(credits),
        crew: {
            directors: (credits.crew || [])
                .filter(person => person.job === 'Director')
                .slice(0, 5)
                .map(person => ({
                    id: person.id,
                    name: person.name,
                    profile: getImageUrl(person.profile_path, 'w185'),
                    view_cast_link: `/api/cast/${person.id}`
                })),
            writers: (credits.crew || [])
                .filter(person => ['Screenplay', 'Writer', 'Story'].includes(person.job))
                .slice(0, 5)
                .map(person => ({
                    id: person.id,
                    name: person.name,
                    job: person.job,
                    profile: getImageUrl(person.profile_path, 'w185'),
                    view_cast_link: `/api/cast/${person.id}`
                }))
        },
        related: processRecommendations(recommendations, type),
        player_link: `/api/player/${type}/${details.id}`
    };

    if (type === 'tv') {
        response.seasons = processSeasons(details);
        response.info.number_of_seasons = details.number_of_seasons || 0;
        response.info.number_of_episodes = details.number_of_episodes || 0;
        response.info.in_production = details.in_production || false;
        response.info.type = details.type || null;
        response.info.created_by = (details.created_by || []).map(creator => ({
            id: creator.id,
            name: creator.name,
            profile: getImageUrl(creator.profile_path, 'w185'),
            view_cast_link: `/api/cast/${creator.id}`
        }));
    }

    return response;
};

exports.getDetails = async (req, res) => {
    const { type, id } = req.params;

    logRequest('Details request', { type, id, url: req.originalUrl });

    const validation = validateMediaParams(type, id);
    if (!validation.valid) {
        logRequest('Validation failed', validation);
        return res.status(validation.statusCode).json({
            success: false,
            error: validation.error,
            received: { type, id },
            timestamp: new Date().toISOString()
        });
    }

    try {
        logRequest('Fetching data from TMDB', { type, id: validation.id });

        const endpoints = [
            `/${type}/${validation.id}`,
            `/${type}/${validation.id}/credits`,
            `/${type}/${validation.id}/recommendations`,
            `/${type}/${validation.id}/videos`
        ];

        const [details, credits, recommendations, videos] = await Promise.all(
            endpoints.map(endpoint => fetchFromTMDB(endpoint))
        );

        if (!details || !details.id) {
            logRequest('Media not found', { type, id: validation.id });
            return res.status(404).json({
                success: false,
                error: 'Media not found',
                request: {
                    type,
                    id: validation.id,
                    timestamp: new Date().toISOString()
                }
            });
        }

        const responseData = buildResponse(type, details, credits, recommendations, videos);

        logRequest('Details retrieved', {
            id: details.id,
            title: details.title || details.name,
            cast_count: responseData.cast.length,
            related_count: responseData.related.length
        });

        res.json(responseData);

    } catch (error) {
        console.error('[ERROR] getDetails:', error);

        const statusCode = error.response?.status || 500;
        const errorMessage = error.response?.data?.status_message || 'Failed to fetch details';

        res.status(statusCode).json({
            success: false,
            error: errorMessage,
            request: {
                type,
                id,
                timestamp: new Date().toISOString()
            },
            ...(process.env.NODE_ENV === 'development' && {
                debug: {
                    message: error.message,
                    stack: error.stack
                }
            })
        });
    }
};
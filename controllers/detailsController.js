const { fetchFromTMDB } = require('../services/tmdb');
const { getImageUrl } = require('../utils/urlHelper');

const debug = (message, data = '') => {
    const timestamp = new Date().toISOString();
};

const createMeta = (req, type, details) => ({
    pagination: {
        page: 1,
        total_pages: 1,
        total_results: 1,
        has_next: false,
        has_prev: false
    },
    links: {
        self: `/api/details/${type}/${details.id}`,
        canonical: `/${type}/${details.id}`
    },
    type: type,
    title: details.title || details.name,
    description: details.overview,
    image: getImageUrl(details.backdrop_path || details.poster_path, 'original'),
    timestamp: new Date().toISOString()
});

exports.getDetails = async (req, res) => {
    const { type, id } = req.params;

    debug('Received request for details', { type, id, url: req.originalUrl });

    if (!['movie', 'tv'].includes(type)) {
        debug('Invalid media type requested', type);
        return res.status(400).json({
            error: 'Invalid media type. Must be either "movie" or "tv"',
            received: type
        });
    }

    if (!id || isNaN(Number(id))) {
        debug('Invalid ID provided', id);
        return res.status(400).json({
            error: 'Invalid ID. Must be a number',
            received: id
        });
    }

    try {
        debug('Fetching data from TMDB API');
        const endpoints = [
            `/${type}/${id}`,
            `/${type}/${id}/credits`,
            `/${type}/${id}/recommendations`,
            `/${type}/${id}/videos`
        ];

        debug('TMDB API endpoints', endpoints);

        const [details, credits, recommendations, videos] = await Promise.all(
            endpoints.map(endpoint => {
                debug(`Fetching from TMDB: ${endpoint}`);
                return fetchFromTMDB(endpoint).catch(error => {
                    debug(`Error fetching ${endpoint}`, error.message);
                    throw error;
                });
            })
        );

        debug('Successfully fetched data from TMDB', {
            hasDetails: !!details,
            hasCredits: !!credits,
            hasRecommendations: !!recommendations,
            hasVideos: !!videos
        });

        const trailer = videos.results.find(v => v.type === "Trailer" && v.site === "YouTube");
        const backdrop = details.backdrop_path || details.poster_path;

        if (!details) {
            debug('No details found for the requested media');
            return res.status(404).json({ error: 'No details found for the requested media' });
        }

        debug('Processing response data');
        const responseData = {
            view_path: `/api/details/${type}/${id}`,
            meta: createMeta(req, type, details),
            info: {
                id: details.id,
                type: type,
                title: details.title || details.name,
                tagline: details.tagline || null,
                overview: details.overview || 'No overview available.',
                runtime: details.runtime || (details.episode_run_time?.[0] || null),
                release_date: details.release_date || details.first_air_date || null,
                rating: details.vote_average ? Math.round(details.vote_average * 10) / 10 : null,
                vote_count: details.vote_count || 0,
                genres: details.genres || [],
                backdrop: getImageUrl(backdrop, 'original'),
                poster: getImageUrl(details.poster_path, 'w780'),
                trailer_url: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null,
                homepage: details.homepage || null,
                status: details.status || null,
                original_language: details.original_language || 'en',
                production_companies: (details.production_companies || []).map(company => ({
                    id: company.id,
                    name: company.name,
                    logo_path: company.logo_path
                        ? getImageUrl(company.logo_path, 'w500')
                        : null,
                    origin_country: company.origin_country
                }))
            },
            cast: (credits.cast || []).slice(0, 20).map(person => ({
                id: person.id,
                name: person.name,
                character: person.character || 'Unknown',
                profile: person.profile_path
                    ? getImageUrl(person.profile_path, 'w185')
                    : '/images/default-avatar.png',
                view_cast_link: `/api/cast/${person.id}`,
                order: person.order
            })).sort((a, b) => a.order - b.order),
            related: (recommendations.results || []).slice(0, 10).map(rec => ({
                id: rec.id,
                type: rec.media_type || type,
                title: rec.title || rec.name || 'Untitled',
                poster: rec.poster_path
                    ? getImageUrl(rec.poster_path, 'w342')
                    : null,
                backdrop: rec.backdrop_path
                    ? getImageUrl(rec.backdrop_path, 'w780')
                    : null,
                year: (rec.release_date || rec.first_air_date || '').split('-')[0] || null,
                rating: rec.vote_average ? Math.round(rec.vote_average * 10) / 10 : null,
                details_link: `/api/details/${rec.media_type || type}/${rec.id}`
            }))
        };

        if (type === 'tv') {
            responseData.seasons = (details.seasons || [])
                .filter(s => s && s.season_number > 0)
                .map(s => ({
                    number: s.season_number,
                    name: s.name || `Season ${s.season_number}`,
                    episode_count: s.episode_count || 0,
                    air_date: s.air_date || null,
                    poster: s.poster_path
                        ? getImageUrl(s.poster_path, 'w780')
                        : getImageUrl(details.poster_path, 'w780'),
                    overview: s.overview || 'No overview available.'
                }))
                .sort((a, b) => a.number - b.number);
        }

        responseData.player_link = `/api/player/${type}/${id}`;

        debug('Sending response data');
        res.json(responseData);
    } catch (error) {
        console.error('Error in getDetails:', error);
        debug('Error details', {
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });

        const statusCode = error.response?.status || 500;
        const errorMessage = error.response?.data?.status_message || 'Failed to fetch details';

        res.status(statusCode).json({
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
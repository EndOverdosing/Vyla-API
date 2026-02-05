const { fetchFromTMDB } = require('../services/tmdb');
const { getImageUrl } = require('../utils/urlHelper');

const logRequest = (message, data) => {
    if (process.env.NODE_ENV === 'development') {
        console.log(`[${new Date().toISOString()}] ${message}`, data || '');
    }
};

const validateCastId = (id) => {
    const numId = Number(id);
    if (!id || isNaN(numId) || numId <= 0) {
        return { valid: false, error: 'Invalid ID. Must be a positive number' };
    }
    return { valid: true, id: numId };
};

const processCastCredits = (credits, type) => {
    if (!credits?.cast || !Array.isArray(credits.cast)) {
        return [];
    }

    return credits.cast
        .filter(item => item.media_type === type && item.poster_path)
        .sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0))
        .slice(0, 20)
        .map(item => ({
            id: item.id,
            title: item.title || item.name,
            character: item.character || 'Unknown',
            poster: getImageUrl(item.poster_path, 'w342'),
            backdrop: getImageUrl(item.backdrop_path, 'w780'),
            rating: item.vote_average ? Math.round(item.vote_average * 10) / 10 : null,
            year: (item.release_date || item.first_air_date || '').split('-')[0] || null,
            details_link: `/api/details/${type}/${item.id}`
        }));
};

const buildCastResponse = (person, credits) => {
    return {
        id: person.id,
        name: person.name,
        biography: person.biography || 'No biography available.',
        birthday: person.birthday || null,
        deathday: person.deathday || null,
        place_of_birth: person.place_of_birth || null,
        profile: getImageUrl(person.profile_path, 'h632'),
        popularity: person.popularity || 0,
        known_for_department: person.known_for_department || null,
        also_known_as: person.also_known_as || [],
        homepage: person.homepage || null,
        known_for: {
            movies: processCastCredits(credits, 'movie'),
            shows: processCastCredits(credits, 'tv')
        },
        view_path: `/api/cast/${person.id}`,
        meta: {
            timestamp: new Date().toISOString(),
            total_movies: credits?.cast?.filter(i => i.media_type === 'movie').length || 0,
            total_shows: credits?.cast?.filter(i => i.media_type === 'tv').length || 0
        }
    };
};

exports.getCastDetails = async (req, res) => {
    const { id } = req.params;

    logRequest('Cast details request', { id, url: req.originalUrl });

    const validation = validateCastId(id);
    if (!validation.valid) {
        logRequest('Validation failed', { id, error: validation.error });
        return res.status(400).json({
            success: false,
            error: validation.error,
            request: {
                id,
                timestamp: new Date().toISOString()
            }
        });
    }

    try {
        logRequest('Fetching person details', { id: validation.id });

        const [person, credits] = await Promise.all([
            fetchFromTMDB(`/person/${validation.id}`),
            fetchFromTMDB(`/person/${validation.id}/combined_credits`)
        ]);

        if (!person || !person.id) {
            logRequest('Person not found', { id: validation.id });
            return res.status(404).json({
                success: false,
                error: 'Cast member not found',
                request: {
                    id: validation.id,
                    timestamp: new Date().toISOString()
                }
            });
        }

        const responseData = buildCastResponse(person, credits);

        logRequest('Cast details retrieved', {
            id: person.id,
            name: person.name,
            movies: responseData.known_for.movies.length,
            shows: responseData.known_for.shows.length
        });

        res.json({
            success: true,
            data: responseData
        });

    } catch (error) {
        console.error('[ERROR] getCastDetails:', error);

        const statusCode = error.response?.status || 500;
        const errorMessage = error.response?.data?.status_message || 'Failed to fetch cast details';

        res.status(statusCode).json({
            success: false,
            error: errorMessage,
            request: {
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
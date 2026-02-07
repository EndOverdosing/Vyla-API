const { fetchFromTMDB } = require('../services/tmdb');
const { getImageUrl } = require('../utils/urlHelper');

const logRequest = (message, data) => {
    if (process.env.NODE_ENV === 'development') {
        console.log(`[${new Date().toISOString()}] ${message}`, data || '');
    }
};

const validateGenreParams = (type, genreId, page) => {
    if (!['movie', 'tv'].includes(type)) {
        return {
            valid: false,
            error: 'Invalid media type. Must be either "movie" or "tv"',
            statusCode: 400
        };
    }

    const numGenreId = Number(genreId);
    if (!genreId || isNaN(numGenreId) || numGenreId <= 0) {
        return {
            valid: false,
            error: 'Invalid genre ID. Must be a positive number',
            statusCode: 400
        };
    }

    const numPage = Number(page);
    if (page && (isNaN(numPage) || numPage < 1)) {
        return {
            valid: false,
            error: 'Page must be a positive number',
            statusCode: 400
        };
    }

    return {
        valid: true,
        type,
        genreId: numGenreId,
        page: numPage || 1
    };
};

const processGenreResults = (results, type) => {
    if (!results || !Array.isArray(results)) {
        return [];
    }

    return results
        .filter(item => item && item.id && (item.poster_path || item.backdrop_path))
        .map(item => ({
            id: item.id,
            type,
            title: item.title || item.name || 'Untitled',
            title_image: getImageUrl(item.logo_path, 'w500'),
            overview: item.overview || null,
            poster: getImageUrl(item.poster_path, 'w342'),
            backdrop: getImageUrl(item.backdrop_path, 'w780'),
            rating: item.vote_average ? Math.round(item.vote_average * 10) / 10 : null,
            popularity: item.popularity || 0,
            release_date: item.release_date || item.first_air_date || null,
            year: (item.release_date || item.first_air_date || '').split('-')[0] || null,
            genre_ids: item.genre_ids || [],
            adult: item.adult || false,
            details_link: `/api/details/${type}/${item.id}`
        }));
};

exports.getGenreList = async (req, res) => {
    const { type } = req.params;

    if (!['movie', 'tv'].includes(type)) {
        return res.status(400).json({
            success: false,
            error: 'Invalid media type. Must be either "movie" or "tv"'
        });
    }

    try {
        logRequest('Genre list request', { type });

        const endpoint = type === 'movie' ? '/genre/movie/list' : '/genre/tv/list';
        const data = await fetchFromTMDB(endpoint);

        res.json({
            success: true,
            type,
            genres: data.genres || [],
            meta: {
                timestamp: new Date().toISOString(),
                total_genres: data.genres?.length || 0
            }
        });

    } catch (error) {
        console.error('[ERROR] getGenreList:', error);

        const statusCode = error.response?.status || 500;
        const errorMessage = error.response?.data?.status_message || 'Failed to fetch genres';

        res.status(statusCode).json({
            success: false,
            error: errorMessage,
            timestamp: new Date().toISOString()
        });
    }
};

exports.getByGenre = async (req, res) => {
    const { type, genreId } = req.params;
    const { page = 1, sort_by = 'popularity.desc' } = req.query;

    logRequest('Genre browse request', { type, genreId, page, sort_by });

    const validation = validateGenreParams(type, genreId, page);
    if (!validation.valid) {
        return res.status(validation.statusCode).json({
            success: false,
            error: validation.error,
            received: { type, genreId, page }
        });
    }

    try {
        const endpoint = type === 'movie' ? '/discover/movie' : '/discover/tv';

        const data = await fetchFromTMDB(endpoint, {
            with_genres: validation.genreId,
            sort_by,
            page: validation.page,
            include_adult: false
        });

        const results = processGenreResults(data.results || [], validation.type);

        const response = {
            success: true,
            meta: {
                type: validation.type,
                genre_id: validation.genreId,
                page: validation.page,
                total_pages: data.total_pages || 0,
                total_results: data.total_results || 0,
                has_next: validation.page < (data.total_pages || 0),
                has_prev: validation.page > 1,
                sort_by,
                timestamp: new Date().toISOString()
            },
            results
        };

        logRequest('Genre browse completed', {
            genreId: validation.genreId,
            results: results.length
        });

        res.json(response);

    } catch (error) {
        console.error('[ERROR] getByGenre:', error);

        const statusCode = error.response?.status || 500;
        const errorMessage = error.response?.data?.status_message || 'Failed to fetch genre content';

        res.status(statusCode).json({
            success: false,
            error: errorMessage,
            request: {
                type,
                genreId,
                page,
                timestamp: new Date().toISOString()
            }
        });
    }
};
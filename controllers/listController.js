const { fetchFromTMDB } = require('../services/tmdb');
const { getImageUrl } = require('../utils/urlHelper');

const logRequest = (message, data) => {
    if (process.env.NODE_ENV === 'development') {
        console.log(`[${new Date().toISOString()}] ${message}`, data || '');
    }
};

const validateListParams = (endpoint, page) => {
    if (!endpoint || typeof endpoint !== 'string') {
        return {
            valid: false,
            error: 'Endpoint parameter is required',
            statusCode: 400
        };
    }

    if (!endpoint.startsWith('/')) {
        return {
            valid: false,
            error: 'Endpoint must start with /',
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

    return { valid: true, endpoint, page: numPage || 1 };
};

const parseAdditionalParams = (params) => {
    if (!params) return {};

    try {
        return typeof params === 'string' ? JSON.parse(params) : params;
    } catch (error) {
        console.error('[ERROR] Failed to parse params:', error.message);
        return {};
    }
};

const determineMediaType = (item) => {
    if (item.media_type) return item.media_type;
    if (item.title) return 'movie';
    if (item.name && item.first_air_date) return 'tv';
    return 'movie';
};

const processListResults = (results) => {
    if (!results || !Array.isArray(results)) {
        return [];
    }

    return results
        .filter(item => item && item.id)
        .map(item => {
            const mediaType = determineMediaType(item);

            return {
                id: item.id,
                type: mediaType,
                title: item.title || item.name || 'Untitled',
                overview: item.overview || null,
                poster: getImageUrl(item.poster_path, 'w342'),
                backdrop: getImageUrl(item.backdrop_path, 'w780'),
                rating: item.vote_average ? Math.round(item.vote_average * 10) / 10 : null,
                popularity: item.popularity || 0,
                release_date: item.release_date || item.first_air_date || null,
                year: (item.release_date || item.first_air_date || '').split('-')[0] || null,
                genre_ids: item.genre_ids || [],
                adult: item.adult || false,
                original_language: item.original_language || null,
                details_link: `/api/details/${mediaType}/${item.id}`
            };
        });
};

const buildPaginationMeta = (data, endpoint, page) => ({
    page: data.page || page,
    total_pages: data.total_pages || 1,
    total_results: data.total_results || 0,
    has_next: data.page < data.total_pages,
    has_prev: data.page > 1,
    next_page: data.page < data.total_pages ? data.page + 1 : null,
    prev_page: data.page > 1 ? data.page - 1 : null
});

exports.getList = async (req, res) => {
    const { endpoint, params, page = 1 } = req.query;

    logRequest('List request', { endpoint, params, page });

    const validation = validateListParams(endpoint, page);
    if (!validation.valid) {
        logRequest('Validation failed', validation);
        return res.status(validation.statusCode).json({
            success: false,
            error: validation.error
        });
    }

    const additionalParams = parseAdditionalParams(params);

    try {
        logRequest('Fetching from TMDB', {
            endpoint: validation.endpoint,
            page: validation.page,
            additionalParams
        });

        const data = await fetchFromTMDB(validation.endpoint, {
            ...additionalParams,
            page: validation.page
        });

        if (!data) {
            return res.status(404).json({
                success: false,
                error: 'No data found for the requested endpoint'
            });
        }

        const results = processListResults(data.results || []);
        const paginationMeta = buildPaginationMeta(data, validation.endpoint, validation.page);

        const response = {
            success: true,
            meta: {
                endpoint: validation.endpoint,
                pagination: paginationMeta,
                timestamp: new Date().toISOString()
            },
            results
        };

        logRequest('List retrieved', {
            endpoint: validation.endpoint,
            page: validation.page,
            results: results.length,
            total_results: paginationMeta.total_results
        });

        res.json(response);

    } catch (error) {
        console.error('[ERROR] getList:', error);

        const statusCode = error.response?.status || 500;
        const errorMessage = error.response?.data?.status_message || 'Failed to fetch list';

        res.status(statusCode).json({
            success: false,
            error: errorMessage,
            request: {
                endpoint,
                page,
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
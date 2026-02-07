const { fetchFromTMDB } = require('../services/tmdb');
const { getImageUrl } = require('../utils/urlHelper');

const logRequest = (message, data) => {
    if (process.env.NODE_ENV === 'development') {
        console.log(`[${new Date().toISOString()}] ${message}`, data || '');
    }
};

const validateSearchParams = (query, page) => {
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
        return {
            valid: false,
            error: "Query parameter 'q' is required and cannot be empty",
            statusCode: 400
        };
    }

    const trimmedQuery = query.trim();
    if (trimmedQuery.length < 2) {
        return {
            valid: false,
            error: 'Query must be at least 2 characters long',
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
        query: trimmedQuery,
        page: numPage || 1
    };
};

const processSearchResults = (results) => {
    if (!results || !Array.isArray(results)) {
        return [];
    }

    return results
        .filter(item => {
            return item &&
                item.id &&
                item.media_type !== 'person' &&
                (item.poster_path || item.backdrop_path);
        })
        .map(item => ({
            id: item.id,
            type: item.media_type,
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
            original_language: item.original_language || null,
            details_path: `/api/details/${item.media_type}/${item.id}`,
            details_link: `/api/details/${item.media_type}/${item.id}`
        }))
        .sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
};

const buildSearchMetadata = (query, page, totalPages, totalResults) => ({
    query,
    page,
    total_pages: totalPages,
    total_results: totalResults,
    has_next: page < totalPages,
    has_prev: page > 1,
    next_page: page < totalPages ? page + 1 : null,
    prev_page: page > 1 ? page - 1 : null,
    back_path: '/api/home',
    timestamp: new Date().toISOString()
});

exports.searchContent = async (req, res) => {
    const { q, page = 1 } = req.query;

    logRequest('Search request', { query: q, page });

    const validation = validateSearchParams(q, page);
    if (!validation.valid) {
        logRequest('Validation failed', validation);
        return res.status(validation.statusCode).json({
            success: false,
            error: validation.error,
            received: { q, page }
        });
    }

    try {
        logRequest('Searching TMDB', {
            query: validation.query,
            page: validation.page
        });

        const data = await fetchFromTMDB('/search/multi', {
            query: validation.query,
            page: validation.page,
            include_adult: false
        });

        if (!data) {
            return res.status(404).json({
                success: false,
                error: 'Search failed - no data returned',
                meta: buildSearchMetadata(validation.query, validation.page, 0, 0)
            });
        }

        const results = processSearchResults(data.results || []);
        const meta = buildSearchMetadata(
            validation.query,
            validation.page,
            data.total_pages || 0,
            data.total_results || 0
        );

        const response = {
            success: true,
            meta,
            results,
            stats: {
                filtered_results: results.length,
                movies: results.filter(r => r.type === 'movie').length,
                tv_shows: results.filter(r => r.type === 'tv').length
            }
        };

        logRequest('Search completed', {
            query: validation.query,
            page: validation.page,
            results: results.length,
            total_results: meta.total_results
        });

        res.json(response);

    } catch (error) {
        console.error('[ERROR] searchContent:', error);

        const statusCode = error.response?.status || 500;
        const errorMessage = error.response?.data?.status_message || 'Search failed';

        res.status(statusCode).json({
            success: false,
            error: errorMessage,
            meta: buildSearchMetadata(validation.query, validation.page, 0, 0),
            ...(process.env.NODE_ENV === 'development' && {
                debug: {
                    message: error.message,
                    stack: error.stack
                }
            })
        });
    }
};
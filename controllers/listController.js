const { fetchFromTMDB } = require('../services/tmdb');
const { generateProxyUrl } = require('../utils/urlHelper');

exports.getList = async (req, res) => {
    const { endpoint, params, page = 1 } = req.query;

    if (!endpoint) return res.status(400).json({ error: "Endpoint required" });

    let parsedParams = {};
    if (params) {
        try {
            parsedParams = typeof params === 'string' ? JSON.parse(params) : params;
        } catch (e) { }
    }

    try {
        const data = await fetchFromTMDB(endpoint, { ...parsedParams, page });

        const results = data.results.map(item => ({
            id: item.id,
            type: item.media_type || (item.title ? 'movie' : 'tv'),
            title: item.title || item.name,
            overview: item.overview,
            poster: generateProxyUrl(req, item.poster_path, 'w500'),
            backdrop: generateProxyUrl(req, item.backdrop_path, 'w780'),
            rating: item.vote_average,
            release_date: item.release_date || item.first_air_date,
            details_link: `/api/details/${item.media_type || (item.title ? 'movie' : 'tv')}/${item.id}`
        }));

        res.json({
            page: data.page,
            total_pages: data.total_pages,
            results: results
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch list" });
    }
};
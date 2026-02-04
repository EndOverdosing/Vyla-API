const { fetchFromTMDB } = require('../services/tmdb');

exports.searchContent = async (req, res) => {
    const { q, page = 1 } = req.query;

    if (!q) {
        return res.status(400).json({ error: "Query parameter 'q' is required" });
    }

    try {
        const data = await fetchFromTMDB('/search/multi', {
            query: q,
            page,
            include_adult: false
        });

        const results = data.results
            .filter(item => item.media_type !== 'person' && item.poster_path)
            .map(item => ({
                id: item.id,
                type: item.media_type,
                title: item.title || item.name,
                poster: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
                rating: item.vote_average,
                year: (item.release_date || item.first_air_date || "").split('-')[0],
                details_path: `/api/details/${item.media_type}/${item.id}`
            }));

        res.json({
            meta: {
                query: q,
                page: parseInt(page),
                total_pages: data.total_pages,
                back_path: "/api/home"
            },
            results
        });
    } catch (error) {
        res.status(500).json({ error: "Search failed" });
    }
};
const tmdb = require('../services/tmdb');
const { getImageUrl } = require('../utils/urlHelper');

function processResults(results) {
    if (!results || !Array.isArray(results)) {
        console.error('[ERROR] Invalid results data:', results);
        return [];
    }

    return results
        .filter(item => item && (item.poster_path || item.backdrop_path))
        .map(item => {
            const mediaType = item.media_type || (item.first_air_date ? 'tv' : 'movie');
            return {
                id: item.id,
                title: item.title || item.name,
                overview: item.overview,
                poster_path: item.poster_path,
                backdrop_path: item.backdrop_path,
                media_type: mediaType,
                vote_average: item.vote_average,
                release_date: item.release_date || item.first_air_date,
                genre_ids: item.genre_ids || [],
                view_path: `/api/details/${mediaType}/${item.id}`,
                details_link: `/api/details/${mediaType}/${item.id}`
            };
        });
}

function createMeta() {
    return {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        api_version: 'v1'
    };
}

exports.getHomeData = async (req, res) => {
    try {
        const [
            trending,
            topRated,
            netflixOriginals,
            actionMovies,
            comedyMovies,
            horrorMovies,
            romanceMovies,
            documentaries
        ] = await Promise.all([
            tmdb.getTrending('all', 'day'),
            tmdb.getTopRated('movie'),
            tmdb.getNetflixOriginals(),
            tmdb.getMoviesByGenre(28),
            tmdb.getMoviesByGenre(35),
            tmdb.getMoviesByGenre(27),
            tmdb.getMoviesByGenre(10749),
            tmdb.getMoviesByGenre(99)
        ]);

        if (trending?.results?.[0]) {
            const sample = trending.results[0];
        }

        const data = [
            {
                title: 'Trending Now',
                layout_type: 'carousel',
                items: processResults(trending?.results || [])
            },
            {
                title: 'Top Rated',
                layout_type: 'row',
                items: processResults(topRated?.results || [])
            },
            {
                title: 'Netflix Originals',
                layout_type: 'row',
                items: processResults(netflixOriginals?.results || [])
            },
            {
                title: 'Action Movies',
                layout_type: 'row',
                items: processResults(actionMovies?.results || [])
            },
            {
                title: 'Comedy Movies',
                layout_type: 'row',
                items: processResults(comedyMovies?.results || [])
            },
            {
                title: 'Horror Movies',
                layout_type: 'row',
                items: processResults(horrorMovies?.results || [])
            },
            {
                title: 'Romance Movies',
                layout_type: 'row',
                items: processResults(romanceMovies?.results || [])
            },
            {
                title: 'Documentaries',
                layout_type: 'row',
                items: processResults(documentaries?.results || [])
            }
        ];

        const featuredBackdrop = trending.results?.[0]?.backdrop_path ||
            netflixOriginals.results?.[0]?.backdrop_path;

        res.json({
            data,
            meta: {
                ...createMeta(),
                title: 'Vyla - Home',
                description: 'Discover trending movies and TV shows',
                canonical: '/',
                type: 'website',
                image: featuredBackdrop ? getImageUrl(featuredBackdrop, 'original') : null
            }
        });

    } catch (error) {
        console.error('[ERROR] Failed to fetch home data:', {
            message: error.message,
            stack: error.stack,
            url: req.originalUrl
        });

        res.status(500).json({
            error: "Failed to load home data",
            message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
            request_id: req.id
        });
    }
};

exports.healthCheck = (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
};
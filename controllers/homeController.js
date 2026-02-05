const tmdb = require('../services/tmdb');
const { getImageUrl } = require('../utils/urlHelper');

const logRequest = (message, data) => {
    if (process.env.NODE_ENV === 'development') {
        console.log(`[${new Date().toISOString()}] ${message}`, data || '');
    }
};

const processMediaItems = (results, defaultType = null) => {
    if (!results || !Array.isArray(results)) {
        console.error('[ERROR] Invalid results data:', results);
        return [];
    }

    return results
        .filter(item => item && (item.poster_path || item.backdrop_path))
        .map(item => {
            const mediaType = item.media_type || defaultType || (item.first_air_date ? 'tv' : 'movie');
            return {
                id: item.id,
                title: item.title || item.name,
                overview: item.overview || null,
                poster_path: item.poster_path,
                backdrop_path: item.backdrop_path,
                poster: getImageUrl(item.poster_path, 'w342'),
                backdrop: getImageUrl(item.backdrop_path, 'w780'),
                media_type: mediaType,
                vote_average: item.vote_average ? Math.round(item.vote_average * 10) / 10 : null,
                release_date: item.release_date || item.first_air_date || null,
                year: (item.release_date || item.first_air_date || '').split('-')[0] || null,
                genre_ids: item.genre_ids || [],
                popularity: item.popularity || 0,
                view_path: `/api/details/${mediaType}/${item.id}`,
                details_link: `/api/details/${mediaType}/${item.id}`
            };
        })
        .sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
};

const createSection = (title, items, layoutType = 'row') => ({
    title,
    layout_type: layoutType,
    item_count: items.length,
    items
});

const createMetadata = (featuredImage) => ({
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    api_version: 'v1',
    title: 'Vyla - Home',
    description: 'Discover trending movies and TV shows',
    canonical: '/',
    type: 'website',
    image: featuredImage
});

const fetchAllSections = async () => {
    logRequest('Fetching all home sections');

    const results = await Promise.allSettled([
        tmdb.getTrending('all', 'day'),
        tmdb.getTrending('movie', 'week'),
        tmdb.getTopRated('movie'),
        tmdb.getTopRated('tv'),
        tmdb.getNetflixOriginals(),
        tmdb.getMoviesByGenre(28),
        tmdb.getMoviesByGenre(35),
        tmdb.getMoviesByGenre(27),
        tmdb.getMoviesByGenre(10749),
        tmdb.getMoviesByGenre(99),
        tmdb.getMoviesByGenre(16),
        tmdb.getMoviesByGenre(878)
    ]);

    return results.map((result, index) => {
        if (result.status === 'fulfilled') {
            return result.value;
        } else {
            console.error(`[ERROR] Failed to fetch section ${index}:`, result.reason.message);
            return { results: [] };
        }
    });
};

const buildHomeSections = (sections) => {
    const [
        trending,
        trendingMovies,
        topRatedMovies,
        topRatedTV,
        netflixOriginals,
        actionMovies,
        comedyMovies,
        horrorMovies,
        romanceMovies,
        documentaries,
        animationMovies,
        sciFiMovies
    ] = sections;

    return [
        createSection('Trending Now', processMediaItems(trending?.results, null), 'carousel'),
        createSection('Trending Movies', processMediaItems(trendingMovies?.results, 'movie'), 'row'),
        createSection('Top Rated Movies', processMediaItems(topRatedMovies?.results, 'movie'), 'row'),
        createSection('Top Rated TV Shows', processMediaItems(topRatedTV?.results, 'tv'), 'row'),
        createSection('Netflix Originals', processMediaItems(netflixOriginals?.results, 'tv'), 'row'),
        createSection('Action Movies', processMediaItems(actionMovies?.results, 'movie'), 'row'),
        createSection('Comedy Movies', processMediaItems(comedyMovies?.results, 'movie'), 'row'),
        createSection('Horror Movies', processMediaItems(horrorMovies?.results, 'movie'), 'row'),
        createSection('Romance Movies', processMediaItems(romanceMovies?.results, 'movie'), 'row'),
        createSection('Documentaries', processMediaItems(documentaries?.results, 'movie'), 'row'),
        createSection('Animation', processMediaItems(animationMovies?.results, 'movie'), 'row'),
        createSection('Science Fiction', processMediaItems(sciFiMovies?.results, 'movie'), 'row')
    ].filter(section => section.items.length > 0);
};

const getFeaturedImage = (sections) => {
    for (const section of sections) {
        if (section?.results?.[0]?.backdrop_path) {
            return getImageUrl(section.results[0].backdrop_path, 'original');
        }
    }
    return null;
};

exports.getHomeData = async (req, res) => {
    try {
        logRequest('Home data request', { url: req.originalUrl });

        const sections = await fetchAllSections();
        const data = buildHomeSections(sections);
        const featuredImage = getFeaturedImage(sections);

        const response = {
            success: true,
            data,
            meta: createMetadata(featuredImage),
            stats: {
                total_sections: data.length,
                total_items: data.reduce((acc, section) => acc + section.item_count, 0)
            }
        };

        logRequest('Home data retrieved', {
            sections: response.data.length,
            total_items: response.stats.total_items
        });

        res.json(response);

    } catch (error) {
        console.error('[ERROR] Failed to fetch home data:', {
            message: error.message,
            stack: error.stack,
            url: req.originalUrl
        });

        res.status(500).json({
            success: false,
            error: "Failed to load home data",
            message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
            timestamp: new Date().toISOString()
        });
    }
};

exports.healthCheck = (req, res) => {
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();

    res.json({
        success: true,
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: {
            seconds: Math.floor(uptime),
            formatted: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`
        },
        memory: {
            heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + ' MB',
            heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + ' MB',
            rss: Math.round(memoryUsage.rss / 1024 / 1024) + ' MB'
        },
        environment: process.env.NODE_ENV || 'development'
    });
};
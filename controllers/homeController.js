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
                title_image: null,
                overview: item.overview || null,
                poster: getImageUrl(item.poster_path, 'w342'),
                backdrop: getImageUrl(item.backdrop_path, 'w780'),
                media_type: mediaType,
                vote_average: item.vote_average ? Math.round(item.vote_average * 10) / 10 : null,
                release_date: item.release_date || item.first_air_date || null,
                year: (item.release_date || item.first_air_date || '').split('-')[0] || null,
                genre_ids: item.genre_ids || [],
                popularity: item.popularity || 0,
                adult: item.adult || false,
                original_language: item.original_language || null,
                view_path: `/api/details/${mediaType}/${item.id}`,
                details_link: `/api/details/${mediaType}/${item.id}`
            };
        })
        .sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
};

const fetchLogosForItems = async (items, sectionName = '') => {
    const itemsWithLogos = await Promise.all(
        items.map(async (item, index) => {
            try {
                const images = await tmdb.fetchFromTMDB(`/${item.media_type}/${item.id}/images`);
                const logo = images?.logos?.[0]?.file_path || null;
                const logoUrl = getImageUrl(logo, 'w500');

                return {
                    ...item,
                    title_image: logoUrl
                };
            } catch (error) {
                console.error(`[LOGO-ERROR] Failed for ${item.title}:`, error.message);
                return item;
            }
        })
    );

    const withLogos = itemsWithLogos.filter(item => item.title_image !== null).length;

    return itemsWithLogos;
};

const createSection = (title, items, layoutType = 'row') => ({
    title,
    layout_type: layoutType,
    item_count: items.length,
    items
});

const createMetadata = (featuredImage) => ({
    timestamp: new Date().toISOString(),
    version: '1.1.0',
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

const buildHomeSections = async (sections) => {
    console.log('[HOME-DEBUG] Building home sections with FULL logo fetching...');
    console.log('[HOME-DEBUG] WARNING: This will be slower as we fetch logos for ALL items');

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

    const trendingItems = processMediaItems(trending?.results, null);
    const trendingMoviesItems = processMediaItems(trendingMovies?.results, 'movie');
    const topRatedMoviesItems = processMediaItems(topRatedMovies?.results, 'movie');
    const topRatedTVItems = processMediaItems(topRatedTV?.results, 'tv');
    const netflixOriginalsItems = processMediaItems(netflixOriginals?.results, 'tv');
    const actionMoviesItems = processMediaItems(actionMovies?.results, 'movie');
    const comedyMoviesItems = processMediaItems(comedyMovies?.results, 'movie');
    const horrorMoviesItems = processMediaItems(horrorMovies?.results, 'movie');
    const romanceMoviesItems = processMediaItems(romanceMovies?.results, 'movie');
    const documentariesItems = processMediaItems(documentaries?.results, 'movie');
    const animationMoviesItems = processMediaItems(animationMovies?.results, 'movie');
    const sciFiMoviesItems = processMediaItems(sciFiMovies?.results, 'movie');

    const trendingWithLogos = await fetchLogosForItems(trendingItems.slice(0, 10), 'Trending Now');
    const trendingMoviesWithLogos = await fetchLogosForItems(trendingMoviesItems.slice(0, 20), 'Trending Movies');
    const topRatedMoviesWithLogos = await fetchLogosForItems(topRatedMoviesItems.slice(0, 20), 'Top Rated Movies');
    const topRatedTVWithLogos = await fetchLogosForItems(topRatedTVItems.slice(0, 20), 'Top Rated TV');
    const netflixOriginalsWithLogos = await fetchLogosForItems(netflixOriginalsItems.slice(0, 20), 'Netflix Originals');
    const actionMoviesWithLogos = await fetchLogosForItems(actionMoviesItems.slice(0, 20), 'Action Movies');
    const comedyMoviesWithLogos = await fetchLogosForItems(comedyMoviesItems.slice(0, 20), 'Comedy Movies');
    const horrorMoviesWithLogos = await fetchLogosForItems(horrorMoviesItems.slice(0, 20), 'Horror Movies');
    const romanceMoviesWithLogos = await fetchLogosForItems(romanceMoviesItems.slice(0, 20), 'Romance Movies');
    const documentariesWithLogos = await fetchLogosForItems(documentariesItems.slice(0, 18), 'Documentaries');
    const animationMoviesWithLogos = await fetchLogosForItems(animationMoviesItems.slice(0, 20), 'Animation');
    const sciFiMoviesWithLogos = await fetchLogosForItems(sciFiMoviesItems.slice(0, 20), 'Science Fiction');

    return [
        createSection('Trending Now', trendingWithLogos, 'carousel'),
        createSection('Trending Movies', trendingMoviesWithLogos, 'row'),
        createSection('Top Rated Movies', topRatedMoviesWithLogos, 'row'),
        createSection('Top Rated TV Shows', topRatedTVWithLogos, 'row'),
        createSection('Netflix Originals', netflixOriginalsWithLogos, 'row'),
        createSection('Action Movies', actionMoviesWithLogos, 'row'),
        createSection('Comedy Movies', comedyMoviesWithLogos, 'row'),
        createSection('Horror Movies', horrorMoviesWithLogos, 'row'),
        createSection('Romance Movies', romanceMoviesWithLogos, 'row'),
        createSection('Documentaries', documentariesWithLogos, 'row'),
        createSection('Animation', animationMoviesWithLogos, 'row'),
        createSection('Science Fiction', sciFiMoviesWithLogos, 'row')
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

        const startTime = Date.now();
        const sections = await fetchAllSections();
        const data = await buildHomeSections(sections);
        const featuredImage = getFeaturedImage(sections);
        const endTime = Date.now();

        const response = {
            success: true,
            data,
            meta: createMetadata(featuredImage),
            stats: {
                total_sections: data.length,
                total_items: data.reduce((acc, section) => acc + section.item_count, 0),
                load_time_ms: endTime - startTime
            }
        };

        console.log(`[HOME-DEBUG] Total load time: ${(endTime - startTime) / 1000}s`);

        logRequest('Home data retrieved', {
            sections: response.data.length,
            total_items: response.stats.total_items,
            load_time: `${(endTime - startTime) / 1000}s`
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
const { fetchFromTMDB } = require('../services/tmdb');
const { generateProxyUrl } = require('../utils/urlHelper');

const createMeta = (page = 1, totalPages = 1, totalResults = 0, path = '/') => ({
    pagination: {
        page,
        total_pages: totalPages,
        total_results: totalResults,
        has_next: page < totalPages,
        has_prev: page > 1
    },
    links: {
        self: path,
        next: page < totalPages ? `${path}?page=${page + 1}` : null,
        prev: page > 1 ? `${path}?page=${page - 1}` : null
    },
    timestamp: new Date().toISOString()
});

const processMediaItem = (req, item) => {
    const type = item.media_type || (item.title ? 'movie' : 'tv');
    const title = item.title || item.name || 'Untitled';
    const year = item.release_date ? new Date(item.release_date).getFullYear() :
        item.first_air_date ? new Date(item.first_air_date).getFullYear() : null;

    return {
        id: item.id,
        type,
        title,
        year,
        overview: item.overview || '',
        poster: generateProxyUrl(req, item.poster_path, 'w342'),
        backdrop: generateProxyUrl(req, item.backdrop_path, 'w780'),
        rating: item.vote_average ? Math.round(item.vote_average * 10) / 10 : null,
        genres: item.genre_ids || [],
        details_link: `/api/details/${type}/${item.id}`,
        media_type: type
    };
};

const createSection = (req, title, items, options = {}) => {
    const {
        layout_type = 'row',
        tile_size = 'normal',
        is_hero = false,
        view_all_path = null,
        items_per_page = 20
    } = options;

    return {
        title,
        layout_type,
        tile_size,
        is_hero,
        items: items.map(item => processMediaItem(req, item)).slice(0, items_per_page),
        view_all_path,
        total_items: items.length,
        meta: createMeta(1, Math.ceil(items.length / items_per_page), items.length)
    };
};

const getFallbackData = () => ({
    results: [
        {
            id: 0,
            title: 'No data available',
            overview: 'Could not load content at this time. Please try again later.',
            poster_path: null,
            backdrop_path: null,
            media_type: 'movie'
        }
    ]
});

exports.getHomeData = async (req, res) => {
    try {
        const responses = await Promise.all([
            fetchFromTMDB('/trending/all/day'),
            fetchFromTMDB('/discover/movie', {
                sort_by: 'primary_release_date.desc',
                'vote_count.gte': 50
            }),
            fetchFromTMDB('/discover/movie', {
                sort_by: 'popularity.desc',
                'vote_count.gte': 500,
                'vote_average.gte': 7
            }),
            fetchFromTMDB('/movie/top_rated', { region: 'US' }),
            fetchFromTMDB('/discover/movie', {
                with_watch_providers: '8',
                watch_region: 'US',
                sort_by: 'popularity.desc'
            }),
            fetchFromTMDB('/discover/movie', {
                with_genres: '28',
                sort_by: 'popularity.desc',
                'vote_count.gte': 100
            }),
            fetchFromTMDB('/tv/on_the_air'),
            fetchFromTMDB('/tv/top_rated'),
            fetchFromTMDB('/tv/popular'),
            fetchFromTMDB('/discover/tv', {
                with_watch_providers: '8',
                watch_region: 'US',
                sort_by: 'popularity.desc'
            }),
            fetchFromTMDB('/discover/tv', {
                with_genres: '10759',
                sort_by: 'popularity.desc'
            })
        ]);

        const [
            trending = getFallbackData(),
            latest = getFallbackData(),
            awards = getFallbackData(),
            topRated = getFallbackData(),
            netflixMovies = getFallbackData(),
            actionMovies = getFallbackData(),
            tvOnAir = getFallbackData(),
            tvTop = getFallbackData(),
            tvPopular = getFallbackData(),
            tvNetflix = getFallbackData(),
            tvAction = getFallbackData()
        ] = responses;

        const collections = [
            {
                title: "Trending Now",
                data: trending.results,
                options: {
                    layout_type: 'carousel',
                    is_hero: true
                }
            },
            {
                title: "Latest Releases",
                data: latest.results,
                options: {
                    layout_type: 'bento',
                    tile_size: 'wide'
                }
            },
            {
                title: "4K Ultra HD",
                data: awards.results,
                options: {
                    layout_type: 'row',
                    view_all_path: '/api/list?type=movie&sort=vote_average.desc&vote_count.gte=500&vote_average.gte=7'
                }
            },
            {
                title: "Top Rated Movies",
                data: topRated.results,
                options: {
                    layout_type: 'row',
                    view_all_path: '/api/list?type=movie&sort=vote_average.desc'
                }
            },
            {
                title: "TV Shows Airing Today",
                data: tvOnAir.results,
                options: {
                    layout_type: 'bento',
                    tile_size: 'large',
                    view_all_path: '/api/list?type=tv&status=airing_today'
                }
            },
            {
                title: "Top TV Shows",
                data: tvTop.results,
                options: {
                    layout_type: 'row',
                    view_all_path: '/api/list?type=tv&sort=vote_average.desc'
                }
            }
        ];

        const data = collections.map(collection =>
            createSection(
                req,
                collection.title,
                collection.data,
                collection.options
            )
        );

        res.json({
            data,
            meta: {
                ...createMeta(),
                title: 'Vyla - Home',
                description: 'Discover trending movies and TV shows',
                canonical: '/',
                type: 'website',
                image: trending.results[0]?.backdrop_path
                    ? generateProxyUrl(req, trending.results[0].backdrop_path, 'original')
                    : null
            }
        });
    } catch (error) {
        console.error('Home data error:', error);
        res.status(500).json({
            error: "Failed to load home data",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
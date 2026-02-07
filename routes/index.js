const express = require('express');
const router = express.Router();
const listController = require('../controllers/listController');
const castController = require('../controllers/castController');
const homeController = require('../controllers/homeController');
const searchController = require('../controllers/searchController');
const detailsController = require('../controllers/detailsController');
const playerController = require('../controllers/playerController');
const imageController = require('../controllers/imageController');
const genresController = require('../controllers/genresController');
const episodesController = require('../controllers/episodesController');

router.get('/list', listController.getList);

router.get('/cast/:id', castController.getCastDetails);

router.get('/home', homeController.getHomeData);

router.get('/health', homeController.healthCheck);

router.get('/search', searchController.searchContent);

router.get('/details/:type/:id', detailsController.getDetails);

router.get('/player/:type/:id', playerController.getPlayerSources);

router.get('/image/:size/:file', imageController.proxyImage);

router.get('/genres/:type', genresController.getGenreList);

router.get('/genres/:type/:genreId', genresController.getByGenre);

router.get('/tv/:tvId/season/:seasonNumber', episodesController.getSeasonDetails);

router.get('/episodes/:tvId/:seasonNumber/:episodeNumber', episodesController.getEpisodeDetails);

router.get('/', (req, res) => {
    res.json({
        success: true,
        name: 'Vyla Media API',
        version: '1.1.0',
        status: 'active',
        documentation: 'https://github.com/endoverdosing/Vyla-API',
        new_features: {
            title_images: 'All media items now include logo/title images',
            genre_browsing: 'Browse content by genre with filtering',
            episode_details: 'Get detailed TV episode and season information',
            enhanced_images: 'Multiple image collections for backdrops, posters, logos',
            enhanced_videos: 'Multiple trailers and clips'
        },
        endpoints: {
            home: {
                path: '/api/home',
                method: 'GET',
                description: 'Get curated home page content with title images'
            },
            search: {
                path: '/api/search',
                method: 'GET',
                description: 'Search movies and TV shows',
                parameters: {
                    q: 'Search query (required)',
                    page: 'Page number (optional, default: 1)'
                }
            },
            details: {
                path: '/api/details/:type/:id',
                method: 'GET',
                description: 'Get comprehensive media details with images and videos',
                parameters: {
                    type: 'Media type: movie or tv (required)',
                    id: 'TMDB media ID (required)'
                }
            },
            cast: {
                path: '/api/cast/:id',
                method: 'GET',
                description: 'Get cast/actor details',
                parameters: {
                    id: 'TMDB person ID (required)'
                }
            },
            player: {
                path: '/api/player/:type/:id',
                method: 'GET',
                description: 'Get streaming sources',
                parameters: {
                    type: 'Media type: movie or tv (required)',
                    id: 'TMDB media ID (required)',
                    s: 'Season number (required for TV)',
                    e: 'Episode number (required for TV)'
                }
            },
            genres_list: {
                path: '/api/genres/:type',
                method: 'GET',
                description: 'Get all available genres',
                parameters: {
                    type: 'Media type: movie or tv (required)'
                }
            },
            genres_browse: {
                path: '/api/genres/:type/:genreId',
                method: 'GET',
                description: 'Browse content by genre',
                parameters: {
                    type: 'Media type: movie or tv (required)',
                    genreId: 'Genre ID (required)',
                    page: 'Page number (optional, default: 1)',
                    sort_by: 'Sort order (optional, default: popularity.desc)'
                }
            },
            season_details: {
                path: '/api/tv/:tvId/season/:seasonNumber',
                method: 'GET',
                description: 'Get full season details with all episodes',
                parameters: {
                    tvId: 'TMDB TV show ID (required)',
                    seasonNumber: 'Season number (required)'
                }
            },
            episode_details: {
                path: '/api/episodes/:tvId/:seasonNumber/:episodeNumber',
                method: 'GET',
                description: 'Get detailed episode information',
                parameters: {
                    tvId: 'TMDB TV show ID (required)',
                    seasonNumber: 'Season number (required)',
                    episodeNumber: 'Episode number (required)'
                }
            },
            list: {
                path: '/api/list',
                method: 'GET',
                description: 'Fetch custom TMDB lists',
                parameters: {
                    endpoint: 'TMDB endpoint path (required)',
                    params: 'Additional parameters as JSON (optional)',
                    page: 'Page number (optional, default: 1)'
                }
            },
            image_proxy: {
                path: '/api/image/:size/:file',
                method: 'GET',
                description: 'Proxy TMDB images',
                parameters: {
                    size: 'Image size (w92, w154, w185, w342, w500, w780, h632, original)',
                    file: 'TMDB image filename'
                }
            },
            health: {
                path: '/api/health',
                method: 'GET',
                description: 'Health check endpoint'
            }
        },
        examples: {
            home: '/api/home',
            search: '/api/search?q=avengers',
            movie_details: '/api/details/movie/299534',
            tv_details: '/api/details/tv/1399',
            cast: '/api/cast/3223',
            movie_player: '/api/player/movie/299534',
            tv_player: '/api/player/tv/1399?s=1&e=1',
            movie_genres: '/api/genres/movie',
            tv_genres: '/api/genres/tv',
            action_movies: '/api/genres/movie/28',
            comedy_tv: '/api/genres/tv/35',
            season_details: '/api/tv/1399/season/1',
            episode_details: '/api/episodes/1399/1/1',
            custom_list: '/api/list?endpoint=/movie/top_rated',
            image_proxy: '/api/image/w500/example.jpg'
        },
        streaming_sources: {
            total: 34,
            featured: ['P-Stream', 'VidSrc', 'VidLink', 'MultiEmbed', 'VidEasy 4K', 'VidFast 4K'],
            languages: ['English', 'French', 'Russian'],
            note: 'Sources may vary by region and availability'
        },
        common_genres: {
            movies: {
                28: 'Action',
                12: 'Adventure',
                16: 'Animation',
                35: 'Comedy',
                80: 'Crime',
                99: 'Documentary',
                18: 'Drama',
                14: 'Fantasy',
                27: 'Horror',
                10749: 'Romance',
                878: 'Science Fiction',
                53: 'Thriller'
            },
            tv: {
                10759: 'Action & Adventure',
                16: 'Animation',
                35: 'Comedy',
                80: 'Crime',
                99: 'Documentary',
                18: 'Drama',
                10751: 'Family',
                9648: 'Mystery',
                10765: 'Sci-Fi & Fantasy'
            }
        }
    });
});

module.exports = router;
const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const listController = require('../controllers/listController');
const castController = require('../controllers/castController');
const homeController = require('../controllers/homeController');
const searchController = require('../controllers/searchController');
const detailsController = require('../controllers/detailsController');
const playerController = require('../controllers/playerController');

router.get('/image/:size/:file', imageController.proxyImage);

router.get('/list', listController.getList);

router.get('/cast/:id', castController.getCastDetails);

router.get('/home', homeController.getHomeData);

router.get('/health', homeController.healthCheck);

router.get('/search', searchController.searchContent);

router.get('/details/:type/:id', detailsController.getDetails);

router.get('/player/:type/:id', playerController.getPlayerSources);

router.get('/', (req, res) => {
    res.json({
        success: true,
        name: 'Vyla Media API',
        version: '1.0.0',
        status: 'active',
        documentation: 'https://github.com/endoverdosing/Vyla-API',
        endpoints: {
            home: {
                path: '/api/home',
                method: 'GET',
                description: 'Get curated home page content'
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
                description: 'Get media details',
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
            image: {
                path: '/api/image/:size/:file',
                method: 'GET',
                description: 'Proxy TMDB images',
                parameters: {
                    size: 'Image size: w92, w154, w185, w342, w500, w780, original',
                    file: 'Image filename from TMDB'
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
            tv_details: '/api/details/tv/1668',
            cast: '/api/cast/3223',
            movie_player: '/api/player/movie/299534',
            tv_player: '/api/player/tv/1668?s=1&e=1',
            custom_list: '/api/list?endpoint=/movie/top_rated',
            image: '/api/image/w500/poster.jpg'
        }
    });
});

module.exports = router;
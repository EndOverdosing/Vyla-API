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
router.get('/search', searchController.searchContent);
router.get('/details/:type/:id', detailsController.getDetails);
router.get('/player/:type/:id', playerController.getPlayerSources);

module.exports = router;
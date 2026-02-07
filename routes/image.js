const express = require('express');
const router = express.Router();
const episodesController = require('../controllers/episodesController');

router.get('/:tvId/season/:seasonNumber', episodesController.getSeasonDetails);

module.exports = router;
const express = require('express');
const router = express.Router();
const episodesController = require('../controllers/episodesController');

router.get('/:tvId/:seasonNumber/:episodeNumber', episodesController.getEpisodeDetails);

module.exports = router;
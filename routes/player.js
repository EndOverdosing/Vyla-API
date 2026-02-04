const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');

router.get('/:type/:id', playerController.getPlayerSources);

module.exports = router;
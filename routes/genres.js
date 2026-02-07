const express = require('express');
const router = express.Router();
const genresController = require('../controllers/genresController');

router.get('/:type', genresController.getGenreList);

router.get('/:type/:genreId', genresController.getByGenre);

module.exports = router;
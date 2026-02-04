require('dotenv').config();
const axios = require('axios');
const { getImageUrl } = require('../utils/urlHelper');

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const tmdb = axios.create({
    baseURL: TMDB_BASE_URL,
    params: {
        api_key: TMDB_API_KEY,
        language: 'en-US'
    }
});

async function fetchFromTMDB(endpoint, params = {}) {
    try {
        const response = await tmdb.get(endpoint, { params });
        return response.data;
    } catch (error) {
        console.error(`[TMDB API Error] ${endpoint}:`, error.message);
        throw error;
    }
}

async function getTrending(mediaType = 'all', timeWindow = 'day') {
    return fetchFromTMDB(`/trending/${mediaType}/${timeWindow}`);
}

async function getTopRated(mediaType = 'movie') {
    return fetchFromTMDB(`/${mediaType}/top_rated`);
}

async function getNetflixOriginals() {
    return fetchFromTMDB('/discover/tv', {
        with_networks: 213,
        language: 'en-US'
    });
}

async function getMoviesByGenre(genreId) {
    return fetchFromTMDB('/discover/movie', {
        with_genres: genreId,
        sort_by: 'popularity.desc'
    });
}

module.exports = {
    fetchFromTMDB,
    getTrending,
    getTopRated,
    getNetflixOriginals,
    getMoviesByGenre
};
const axios = require('axios');
require('dotenv').config();

const tmdbClient = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    params: {
        language: 'en-US',
        api_key: process.env.TMDB_ACCESS_TOKEN
    }
});

const fetchFromTMDB = async (endpoint, params = {}) => {
    try {
        const response = await tmdbClient.get(endpoint, {
            params: { ...tmdbClient.defaults.params, ...params }
        });
        return response.data;
    } catch (error) {
        return null;
    }
};

module.exports = { fetchFromTMDB };
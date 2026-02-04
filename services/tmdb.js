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
            params: {
                ...tmdbClient.defaults.params,
                ...params
            },
            validateStatus: false
        });

        if (response.status === 200) {
            return response.data;
        }

        console.error(`TMDB API Error (${endpoint}):`, {
            status: response.status,
            statusText: response.statusText,
            params,
            data: response.data
        });

        if (endpoint.includes('/trending') || endpoint.includes('/discover')) {
            return { results: [] };
        }
        if (endpoint.includes('/movie/') || endpoint.includes('/tv/')) {
            return {};
        }
        return null;
    } catch (error) {
        console.error('TMDB Request Failed:', {
            endpoint,
            params,
            error: error.message
        });

        if (endpoint.includes('/trending') || endpoint.includes('/discover')) {
            return { results: [] };
        }
        return null;
    }
};

module.exports = { fetchFromTMDB };
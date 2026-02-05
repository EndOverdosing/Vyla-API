require('dotenv').config();
const axios = require('axios');

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

if (!TMDB_API_KEY) {
    throw new Error('TMDB_API_KEY is required. Please set it in your .env file');
}

const tmdbClient = axios.create({
    baseURL: TMDB_BASE_URL,
    timeout: 15000,
    params: {
        api_key: TMDB_API_KEY,
        language: 'en-US'
    }
});

tmdbClient.interceptors.request.use(
    (config) => {
        if (process.env.NODE_ENV === 'development') {
            console.log(`[TMDB Request] ${config.method?.toUpperCase()} ${config.url}`);
        }
        return config;
    },
    (error) => {
        console.error('[TMDB Request Error]', error.message);
        return Promise.reject(error);
    }
);

tmdbClient.interceptors.response.use(
    (response) => {
        if (process.env.NODE_ENV === 'development') {
            console.log(`[TMDB Response] ${response.config.url} - Status: ${response.status}`);
        }
        return response;
    },
    (error) => {
        if (error.response) {
            console.error('[TMDB API Error]', {
                status: error.response.status,
                url: error.config?.url,
                message: error.response.data?.status_message || error.message
            });
        } else if (error.request) {
            console.error('[TMDB Network Error]', {
                url: error.config?.url,
                message: error.message
            });
        } else {
            console.error('[TMDB Error]', error.message);
        }
        return Promise.reject(error);
    }
);

async function fetchFromTMDB(endpoint, params = {}) {
    try {
        const response = await tmdbClient.get(endpoint, { params });
        return response.data;
    } catch (error) {
        throw error;
    }
}

async function getTrending(mediaType = 'all', timeWindow = 'day') {
    const validMediaTypes = ['all', 'movie', 'tv', 'person'];
    const validTimeWindows = ['day', 'week'];

    if (!validMediaTypes.includes(mediaType)) {
        throw new Error(`Invalid media type. Must be one of: ${validMediaTypes.join(', ')}`);
    }

    if (!validTimeWindows.includes(timeWindow)) {
        throw new Error(`Invalid time window. Must be one of: ${validTimeWindows.join(', ')}`);
    }

    return fetchFromTMDB(`/trending/${mediaType}/${timeWindow}`);
}

async function getTopRated(mediaType = 'movie', page = 1) {
    const validMediaTypes = ['movie', 'tv'];

    if (!validMediaTypes.includes(mediaType)) {
        throw new Error(`Invalid media type. Must be one of: ${validMediaTypes.join(', ')}`);
    }

    return fetchFromTMDB(`/${mediaType}/top_rated`, { page });
}

async function getNetflixOriginals(page = 1) {
    return fetchFromTMDB('/discover/tv', {
        with_networks: 213,
        sort_by: 'popularity.desc',
        page
    });
}

async function getMoviesByGenre(genreId, page = 1, sortBy = 'popularity.desc') {
    if (!genreId || isNaN(Number(genreId))) {
        throw new Error('Invalid genre ID. Must be a number');
    }

    return fetchFromTMDB('/discover/movie', {
        with_genres: genreId,
        sort_by: sortBy,
        page
    });
}

async function getTVShowsByGenre(genreId, page = 1, sortBy = 'popularity.desc') {
    if (!genreId || isNaN(Number(genreId))) {
        throw new Error('Invalid genre ID. Must be a number');
    }

    return fetchFromTMDB('/discover/tv', {
        with_genres: genreId,
        sort_by: sortBy,
        page
    });
}

async function getMovieGenres() {
    return fetchFromTMDB('/genre/movie/list');
}

async function getTVGenres() {
    return fetchFromTMDB('/genre/tv/list');
}

async function getPopular(mediaType = 'movie', page = 1) {
    const validMediaTypes = ['movie', 'tv'];

    if (!validMediaTypes.includes(mediaType)) {
        throw new Error(`Invalid media type. Must be one of: ${validMediaTypes.join(', ')}`);
    }

    return fetchFromTMDB(`/${mediaType}/popular`, { page });
}

async function getNowPlaying(page = 1) {
    return fetchFromTMDB('/movie/now_playing', { page });
}

async function getUpcoming(page = 1) {
    return fetchFromTMDB('/movie/upcoming', { page });
}

async function getAiringToday(page = 1) {
    return fetchFromTMDB('/tv/airing_today', { page });
}

async function getOnTheAir(page = 1) {
    return fetchFromTMDB('/tv/on_the_air', { page });
}

module.exports = {
    fetchFromTMDB,
    getTrending,
    getTopRated,
    getNetflixOriginals,
    getMoviesByGenre,
    getTVShowsByGenre,
    getMovieGenres,
    getTVGenres,
    getPopular,
    getNowPlaying,
    getUpcoming,
    getAiringToday,
    getOnTheAir
};
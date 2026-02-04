const { fetchFromTMDB } = require('../services/tmdb');
const { getImageUrl } = require('../utils/urlHelper');

const debug = (message, data = '') => {
    const timestamp = new Date().toISOString();
};

exports.getCastDetails = async (req, res) => {
    const { id } = req.params;

    debug('Received request for cast details', { id, url: req.originalUrl });

    if (!id || isNaN(Number(id))) {
        const error = 'Invalid ID. Must be a number';
        debug('Invalid ID provided', { id, error });
        return res.status(400).json({
            error,
            request: {
                id,
                timestamp: new Date().toISOString()
            }
        });
    }

    try {
        debug('Fetching person details from TMDB', { endpoint: `/person/${id}` });
        const person = await fetchFromTMDB(`/person/${id}`).catch(error => {
            debug('Error fetching person details', error.message);
            throw error;
        });

        debug('Fetching combined credits from TMDB', { endpoint: `/person/${id}/combined_credits` });
        const credits = await fetchFromTMDB(`/person/${id}/combined_credits`).catch(error => {
            debug('Error fetching combined credits', error.message);
            throw error;
        });

        debug('Processing movies and shows');
        const movies = (credits.cast || [])
            .filter(i => i.media_type === 'movie')
            .map(i => ({
                id: i.id,
                title: i.title,
                poster: getImageUrl(i.poster_path, 'w342'),
                details_link: `/api/details/movie/${i.id}`
            }));

        const shows = (credits.cast || [])
            .filter(i => i.media_type === 'tv')
            .map(i => ({
                id: i.id,
                title: i.name,
                poster: getImageUrl(i.poster_path, 'w342'),
                details_link: `/api/details/tv/${i.id}`
            }));

        const responseData = {
            id: person.id,
            name: person.name,
            biography: person.biography,
            birthday: person.birthday,
            place_of_birth: person.place_of_birth,
            profile: getImageUrl(person.profile_path, 'h632'),
            known_for: {
                movies: movies.slice(0, 20),
                shows: shows.slice(0, 20)
            },
            view_path: `/api/cast/${id}`
        };

        debug('Sending cast details response', {
            personId: person.id,
            name: person.name,
            movieCount: responseData.known_for.movies.length,
            showCount: responseData.known_for.shows.length
        });

        res.json(responseData);
    } catch (error) {
        console.error('Error in getCastDetails:', error);

        const statusCode = error.response?.status || 500;
        const errorMessage = error.response?.data?.status_message || 'Failed to fetch cast details';

        debug('Error details', {
            statusCode,
            errorMessage,
            request: { id },
            ...(process.env.NODE_ENV === 'development' && {
                stack: error.stack
            })
        });

        res.status(statusCode).json({
            error: errorMessage,
            request: {
                id,
                timestamp: new Date().toISOString()
            },
            ...(process.env.NODE_ENV === 'development' && {
                debug: {
                    message: error.message,
                    ...(error.stack && { stack: error.stack })
                }
            })
        });
    }
};

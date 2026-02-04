const { fetchFromTMDB } = require('../services/tmdb');
const { generateProxyUrl } = require('../utils/urlHelper');

exports.getCastDetails = async (req, res) => {
    const { id } = req.params;

    try {
        const person = await fetchFromTMDB(`/person/${id}`);
        const credits = await fetchFromTMDB(`/person/${id}/combined_credits`);

        const movies = credits.cast
            .filter(i => i.media_type === 'movie')
            .map(i => ({
                id: i.id,
                title: i.title,
                poster: generateProxyUrl(req, i.poster_path, 'w342'),
                details_link: `/api/details/movie/${i.id}`
            }));

        const shows = credits.cast
            .filter(i => i.media_type === 'tv')
            .map(i => ({
                id: i.id,
                title: i.name,
                poster: generateProxyUrl(req, i.poster_path, 'w342'),
                details_link: `/api/details/tv/${i.id}`
            }));

        res.json({
            id: person.id,
            name: person.name,
            biography: person.biography,
            birthday: person.birthday,
            place_of_birth: person.place_of_birth,
            profile: generateProxyUrl(req, person.profile_path, 'h632'),
            known_for: {
                movies: movies.slice(0, 20),
                shows: shows.slice(0, 20)
            }
        });
    } catch {
        res.status(500).json({ error: "Failed to load cast details" });
    }
};

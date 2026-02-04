const { fetchFromTMDB } = require('../services/tmdb');
const { generateProxyUrl } = require('../utils/urlHelper');

exports.getDetails = async (req, res) => {
    const { type, id } = req.params;

    try {
        const [details, credits, recommendations, videos] = await Promise.all([
            fetchFromTMDB(`/${type}/${id}`),
            fetchFromTMDB(`/${type}/${id}/credits`),
            fetchFromTMDB(`/${type}/${id}/recommendations`),
            fetchFromTMDB(`/${type}/${id}/videos`)
        ]);

        const trailer = videos.results.find(v => v.type === "Trailer" && v.site === "YouTube");

        const responseData = {
            meta: {
                back_path: "/api/home"
            },
            info: {
                id: details.id,
                type: type,
                title: details.title || details.name,
                overview: details.overview,
                runtime: details.runtime || (details.episode_run_time ? details.episode_run_time[0] : null),
                release_date: details.release_date || details.first_air_date,
                rating: details.vote_average,
                genres: details.genres,
                backdrop: generateProxyUrl(req, details.backdrop_path, 'original'),
                poster: generateProxyUrl(req, details.poster_path, 'w780'),
                trailer_url: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null
            },
            cast: credits.cast.slice(0, 12).map(person => ({
                id: person.id,
                name: person.name,
                character: person.character,
                profile: generateProxyUrl(req, person.profile_path, 'w185'),
                view_cast_link: `/api/cast/${person.id}`
            })),
            related: recommendations.results.slice(0, 10).map(rec => ({
                id: rec.id,
                type: rec.media_type || type,
                title: rec.title || rec.name,
                poster: generateProxyUrl(req, rec.poster_path, 'w342'),
                details_link: `/api/details/${rec.media_type || type}/${rec.id}`
            }))
        };

        if (type === 'tv') {
            responseData.seasons = details.seasons
                .filter(s => s.season_number > 0)
                .map(s => ({
                    number: s.season_number,
                    name: s.name,
                    episode_count: s.episode_count
                }));
        }

        responseData.player_link = `/api/player/${type}/${id}`;

        res.json(responseData);
    } catch (error) {
        res.status(500).json({ error: "Failed to load details" });
    }
};
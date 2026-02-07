const { fetchFromTMDB } = require('../services/tmdb');
const { getImageUrl } = require('../utils/urlHelper');

const logRequest = (message, data) => {
    if (process.env.NODE_ENV === 'development') {
        console.log(`[${new Date().toISOString()}] ${message}`, data || '');
    }
};

const validateEpisodeParams = (tvId, seasonNumber, episodeNumber) => {
    const numTvId = Number(tvId);
    const numSeason = Number(seasonNumber);
    const numEpisode = Number(episodeNumber);

    if (!tvId || isNaN(numTvId) || numTvId <= 0) {
        return {
            valid: false,
            error: 'Invalid TV show ID. Must be a positive number',
            statusCode: 400
        };
    }

    if (!seasonNumber || isNaN(numSeason) || numSeason < 0) {
        return {
            valid: false,
            error: 'Invalid season number. Must be a non-negative number',
            statusCode: 400
        };
    }

    if (!episodeNumber || isNaN(numEpisode) || numEpisode < 1) {
        return {
            valid: false,
            error: 'Invalid episode number. Must be a positive number',
            statusCode: 400
        };
    }

    return {
        valid: true,
        tvId: numTvId,
        seasonNumber: numSeason,
        episodeNumber: numEpisode
    };
};

const processCrew = (crew) => {
    if (!crew || !Array.isArray(crew)) return {};

    return {
        directors: crew
            .filter(person => person.job === 'Director')
            .map(person => ({
                id: person.id,
                name: person.name,
                profile: getImageUrl(person.profile_path, 'w185')
            })),
        writers: crew
            .filter(person => ['Writer', 'Screenplay', 'Story'].includes(person.job))
            .map(person => ({
                id: person.id,
                name: person.name,
                job: person.job,
                profile: getImageUrl(person.profile_path, 'w185')
            }))
    };
};

const processGuestStars = (guestStars) => {
    if (!guestStars || !Array.isArray(guestStars)) return [];

    return guestStars
        .slice(0, 10)
        .map(person => ({
            id: person.id,
            name: person.name,
            character: person.character,
            profile: getImageUrl(person.profile_path, 'w185'),
            view_cast_link: `/api/cast/${person.id}`
        }));
};

exports.getSeasonDetails = async (req, res) => {
    const { tvId, seasonNumber } = req.params;

    const numTvId = Number(tvId);
    const numSeason = Number(seasonNumber);

    if (isNaN(numTvId) || numTvId <= 0 || isNaN(numSeason) || numSeason < 0) {
        return res.status(400).json({
            success: false,
            error: 'Invalid TV ID or season number'
        });
    }

    try {
        logRequest('Season details request', { tvId: numTvId, seasonNumber: numSeason });

        const [seasonData, tvData] = await Promise.all([
            fetchFromTMDB(`/tv/${numTvId}/season/${numSeason}`),
            fetchFromTMDB(`/tv/${numTvId}`)
        ]);

        if (!seasonData) {
            return res.status(404).json({
                success: false,
                error: 'Season not found'
            });
        }

        const episodes = (seasonData.episodes || []).map(episode => ({
            id: episode.id,
            episode_number: episode.episode_number,
            name: episode.name,
            overview: episode.overview,
            air_date: episode.air_date,
            runtime: episode.runtime,
            still: getImageUrl(episode.still_path, 'w300'),
            rating: episode.vote_average ? Math.round(episode.vote_average * 10) / 10 : null,
            vote_count: episode.vote_count || 0,
            episode_link: `/api/episodes/${numTvId}/${numSeason}/${episode.episode_number}`,
            player_link: `/api/player/tv/${numTvId}?s=${numSeason}&e=${episode.episode_number}`
        }));

        res.json({
            success: true,
            data: {
                id: seasonData.id,
                season_number: seasonData.season_number,
                name: seasonData.name,
                overview: seasonData.overview,
                air_date: seasonData.air_date,
                poster: getImageUrl(seasonData.poster_path, 'w780'),
                episode_count: episodes.length,
                episodes,
                tv_show: {
                    id: tvData.id,
                    name: tvData.name,
                    poster: getImageUrl(tvData.poster_path, 'w780'),
                    details_link: `/api/details/tv/${numTvId}`
                }
            },
            meta: {
                tv_id: numTvId,
                season_number: numSeason,
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('[ERROR] getSeasonDetails:', error);

        const statusCode = error.response?.status || 500;
        const errorMessage = error.response?.data?.status_message || 'Failed to fetch season details';

        res.status(statusCode).json({
            success: false,
            error: errorMessage,
            timestamp: new Date().toISOString()
        });
    }
};

exports.getEpisodeDetails = async (req, res) => {
    const { tvId, seasonNumber, episodeNumber } = req.params;

    logRequest('Episode details request', { tvId, seasonNumber, episodeNumber });

    const validation = validateEpisodeParams(tvId, seasonNumber, episodeNumber);
    if (!validation.valid) {
        return res.status(validation.statusCode).json({
            success: false,
            error: validation.error,
            received: { tvId, seasonNumber, episodeNumber }
        });
    }

    try {
        const endpoint = `/tv/${validation.tvId}/season/${validation.seasonNumber}/episode/${validation.episodeNumber}`;
        const data = await fetchFromTMDB(endpoint);

        if (!data) {
            return res.status(404).json({
                success: false,
                error: 'Episode not found'
            });
        }

        const response = {
            success: true,
            data: {
                id: data.id,
                episode_number: data.episode_number,
                season_number: data.season_number,
                name: data.name,
                overview: data.overview || 'No overview available.',
                air_date: data.air_date,
                runtime: data.runtime,
                still: getImageUrl(data.still_path, 'original'),
                rating: data.vote_average ? Math.round(data.vote_average * 10) / 10 : null,
                vote_count: data.vote_count || 0,
                crew: processCrew(data.crew),
                guest_stars: processGuestStars(data.guest_stars),
                production_code: data.production_code
            },
            meta: {
                tv_id: validation.tvId,
                season_number: validation.seasonNumber,
                episode_number: validation.episodeNumber,
                episode_identifier: `S${String(validation.seasonNumber).padStart(2, '0')}E${String(validation.episodeNumber).padStart(2, '0')}`,
                player_link: `/api/player/tv/${validation.tvId}?s=${validation.seasonNumber}&e=${validation.episodeNumber}`,
                timestamp: new Date().toISOString()
            }
        };

        logRequest('Episode details retrieved', {
            tvId: validation.tvId,
            episode: response.meta.episode_identifier,
            name: data.name
        });

        res.json(response);

    } catch (error) {
        console.error('[ERROR] getEpisodeDetails:', error);

        const statusCode = error.response?.status || 500;
        const errorMessage = error.response?.data?.status_message || 'Failed to fetch episode details';

        res.status(statusCode).json({
            success: false,
            error: errorMessage,
            request: {
                tvId,
                seasonNumber,
                episodeNumber,
                timestamp: new Date().toISOString()
            }
        });
    }
};
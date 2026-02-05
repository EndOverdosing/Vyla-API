const sources = require('../config/sources');

const logRequest = (message, data) => {
    if (process.env.NODE_ENV === 'development') {
        console.log(`[${new Date().toISOString()}] ${message}`, data || '');
    }
};

const validatePlayerParams = (type, id, season, episode) => {
    if (!['movie', 'tv'].includes(type)) {
        return {
            valid: false,
            error: 'Invalid media type. Must be either "movie" or "tv"',
            statusCode: 400
        };
    }

    const numId = Number(id);
    if (!id || isNaN(numId) || numId <= 0) {
        return {
            valid: false,
            error: 'Invalid ID. Must be a positive number',
            statusCode: 400
        };
    }

    if (type === 'tv') {
        const numSeason = Number(season);
        const numEpisode = Number(episode);

        if (!season || isNaN(numSeason) || numSeason < 1) {
            return {
                valid: false,
                error: 'Season must be a positive number for TV shows',
                statusCode: 400
            };
        }

        if (!episode || isNaN(numEpisode) || numEpisode < 1) {
            return {
                valid: false,
                error: 'Episode must be a positive number for TV shows',
                statusCode: 400
            };
        }

        return {
            valid: true,
            type,
            id: numId,
            season: numSeason,
            episode: numEpisode
        };
    }

    return {
        valid: true,
        type,
        id: numId,
        season: null,
        episode: null
    };
};

const buildStreamUrl = (source, type, id, season, episode) => {
    const template = type === 'movie'
        ? source.urls.movie
        : source.urls.tv;

    return template
        .replace('{id}', id)
        .replace('{season}', season || 1)
        .replace('{episode}', episode || 1);
};

const generatePlayerSources = (type, id, season, episode) => {
    return sources.map(source => ({
        id: source.id,
        name: source.name,
        stream_url: buildStreamUrl(source, type, id, season, episode),
        isFrench: source.isFrench || false,
        needsSandbox: source.needsSandbox || false,
        startTimeParam: source.startTimeParam || null,
        timeFormat: source.timeFormat || null,
        supportsEvents: source.supportsEvents || false,
        eventOrigin: source.eventOrigin || null
    }));
};

const buildMetadata = (type, id, season, episode) => {
    const meta = {
        content_id: id,
        type,
        back_path: `/api/details/${type}/${id}`,
        timestamp: new Date().toISOString()
    };

    if (type === 'tv') {
        meta.season = season;
        meta.episode = episode;
        meta.episode_identifier = `S${String(season).padStart(2, '0')}E${String(episode).padStart(2, '0')}`;
    }

    return meta;
};

exports.getPlayerSources = (req, res) => {
    const { type, id } = req.params;
    const { s, e } = req.query;

    logRequest('Player sources request', { type, id, season: s, episode: e });

    const validation = validatePlayerParams(type, id, s, e);
    if (!validation.valid) {
        logRequest('Validation failed', validation);
        return res.status(validation.statusCode).json({
            success: false,
            error: validation.error,
            received: { type, id, season: s, episode: e }
        });
    }

    try {
        const playerSources = generatePlayerSources(
            validation.type,
            validation.id,
            validation.season,
            validation.episode
        );

        const response = {
            success: true,
            meta: buildMetadata(
                validation.type,
                validation.id,
                validation.season,
                validation.episode
            ),
            sources: playerSources,
            instructions: {
                usage: 'Embed stream_url in an iframe for playback',
                note: 'Some sources may require additional configuration or may be region-restricted'
            }
        };

        logRequest('Player sources generated', {
            type: validation.type,
            id: validation.id,
            sources: playerSources.length
        });

        res.json(response);

    } catch (error) {
        console.error('[ERROR] getPlayerSources:', error);

        res.status(500).json({
            success: false,
            error: 'Failed to generate player sources',
            request: {
                type,
                id,
                season: s,
                episode: e,
                timestamp: new Date().toISOString()
            },
            ...(process.env.NODE_ENV === 'development' && {
                debug: {
                    message: error.message,
                    stack: error.stack
                }
            })
        });
    }
};
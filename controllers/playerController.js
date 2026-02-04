const sources = require('../config/sources');

exports.getPlayerSources = (req, res) => {
    const { type, id } = req.params;
    const { s, e } = req.query;

    const season = s || 1;
    const episode = e || 1;

    const availableSources = sources.map(source => {
        let url = type === 'movie'
            ? source.urlTemplates.movie
            : source.urlTemplates.tv;

        url = url.replace('{id}', id)
            .replace('{season}', season)
            .replace('{episode}', episode);

        return {
            id: source.id,
            name: source.name,
            stream_url: url
        };
    });

    res.json({
        meta: {
            content_id: id,
            type: type,
            season: type === 'tv' ? parseInt(season) : null,
            episode: type === 'tv' ? parseInt(episode) : null,
            back_path: `/api/details/${type}/${id}`
        },
        sources: availableSources
    });
};
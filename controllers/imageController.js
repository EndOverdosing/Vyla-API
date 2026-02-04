const axios = require('axios');

exports.proxyImage = async (req, res) => {
    const { size, file } = req.params;
    const tmdbUrl = `https://image.tmdb.org/t/p/${size}/${file}`;

    try {
        const response = await axios({
            url: tmdbUrl,
            method: 'GET',
            responseType: 'stream'
        });

        res.set('Content-Type', response.headers['content-type']);
        res.set('Cache-Control', 'public, max-age=31536000');
        response.data.pipe(res);
    } catch (error) {
        res.status(404).send('Image not found');
    }
};
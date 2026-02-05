const axios = require('axios');

const VALID_SIZES = ['w92', 'w154', 'w185', 'w342', 'w500', 'w780', 'h632', 'original'];
const CACHE_DURATION = 31536000;

const logRequest = (message, data) => {
    if (process.env.NODE_ENV === 'development') {
        console.log(`[${new Date().toISOString()}] ${message}`, data || '');
    }
};

const validateImageParams = (size, file) => {
    if (!VALID_SIZES.includes(size)) {
        return {
            valid: false,
            error: `Invalid size. Must be one of: ${VALID_SIZES.join(', ')}`,
            statusCode: 400
        };
    }

    if (!file || file.length < 1) {
        return {
            valid: false,
            error: 'Invalid file parameter',
            statusCode: 400
        };
    }

    const cleanFile = file.startsWith('/') ? file.substring(1) : file;
    if (!cleanFile.match(/^[a-zA-Z0-9_\-\.]+$/)) {
        return {
            valid: false,
            error: 'Invalid file format',
            statusCode: 400
        };
    }

    return { valid: true, size, file: cleanFile };
};

const createFallbackImage = () => {
    const buffer = Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
        'base64'
    );
    return buffer;
};

exports.proxyImage = async (req, res) => {
    const { size, file } = req.params;

    logRequest('Image proxy request', { size, file });

    const validation = validateImageParams(size, file);
    if (!validation.valid) {
        logRequest('Validation failed', validation);
        return res.status(validation.statusCode).json({
            success: false,
            error: validation.error
        });
    }

    const tmdbUrl = `https://image.tmdb.org/t/p/${validation.size}/${validation.file}`;

    try {
        const response = await axios({
            url: tmdbUrl,
            method: 'GET',
            responseType: 'stream',
            timeout: 10000,
            headers: {
                'Accept': 'image/*'
            }
        });

        res.set({
            'Content-Type': response.headers['content-type'] || 'image/jpeg',
            'Cache-Control': `public, max-age=${CACHE_DURATION}, immutable`,
            'X-Image-Source': 'TMDB',
            'X-Image-Size': validation.size
        });

        logRequest('Image served', { size: validation.size, file: validation.file });

        response.data.pipe(res);

    } catch (error) {
        console.error('[ERROR] Image proxy failed:', {
            url: tmdbUrl,
            error: error.message
        });

        const fallbackImage = createFallbackImage();

        res.set({
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=3600',
            'X-Image-Source': 'Fallback',
            'X-Image-Error': error.message
        });

        res.status(404).send(fallbackImage);
    }
};
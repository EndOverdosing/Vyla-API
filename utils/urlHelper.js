const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/';

function getImageUrl(path, size = 'w500') {
    if (!path) {
        console.warn('[WARN] No image path provided');
        return null;
    }

    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    const url = `${TMDB_IMAGE_BASE}${size}/${cleanPath}`;
    return url;
}

module.exports = { getImageUrl };
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/';

const VALID_SIZES = {
    poster: ['w92', 'w154', 'w185', 'w342', 'w500', 'w780', 'original'],
    backdrop: ['w300', 'w780', 'w1280', 'original'],
    profile: ['w45', 'w185', 'h632', 'original'],
    logo: ['w45', 'w92', 'w154', 'w185', 'w300', 'w500', 'original'],
    still: ['w92', 'w185', 'w300', 'original']
};

const DEFAULT_SIZES = {
    poster: 'w500',
    backdrop: 'w780',
    profile: 'w185',
    logo: 'w185',
    still: 'w300'
};

function getImageUrl(path, size = 'w500') {
    if (!path) {
        return null;
    }

    if (typeof path !== 'string') {
        console.warn('[WARN] Invalid image path type:', typeof path);
        return null;
    }

    const cleanPath = path.startsWith('/') ? path.substring(1) : path;

    if (cleanPath.length === 0) {
        return null;
    }

    const validSize = Object.values(VALID_SIZES)
        .flat()
        .includes(size) ? size : 'w500';

    return `${TMDB_IMAGE_BASE}${validSize}/${cleanPath}`;
}

function getProxyImageUrl(baseUrl, path, size = 'w500') {
    if (!path) {
        return null;
    }

    const cleanPath = path.startsWith('/') ? path.substring(1) : path;

    if (cleanPath.length === 0) {
        return null;
    }

    return `${baseUrl}/api/image/${size}/${cleanPath}`;
}

function buildImageUrls(paths, type = 'poster') {
    if (!paths) return null;

    const defaultSize = DEFAULT_SIZES[type] || 'w500';
    const sizes = VALID_SIZES[type] || VALID_SIZES.poster;

    const urls = {};
    sizes.forEach(size => {
        urls[size] = getImageUrl(paths, size);
    });

    return {
        default: getImageUrl(paths, defaultSize),
        sizes: urls
    };
}

function validateImagePath(path) {
    if (!path || typeof path !== 'string') {
        return { valid: false, error: 'Invalid path' };
    }

    const cleanPath = path.startsWith('/') ? path.substring(1) : path;

    if (cleanPath.length === 0) {
        return { valid: false, error: 'Empty path' };
    }

    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    const hasValidExtension = validExtensions.some(ext => cleanPath.toLowerCase().endsWith(ext));

    if (!hasValidExtension) {
        return { valid: false, error: 'Invalid file extension' };
    }

    return { valid: true, path: cleanPath };
}

function generateResponsiveImageSet(path, type = 'poster') {
    if (!path) return null;

    const sizes = VALID_SIZES[type] || VALID_SIZES.poster;

    return sizes.map(size => ({
        size,
        url: getImageUrl(path, size),
        width: parseInt(size.replace(/\D/g, '')) || null
    })).filter(item => item.width);
}

module.exports = {
    getImageUrl,
    getProxyImageUrl,
    buildImageUrls,
    validateImagePath,
    generateResponsiveImageSet,
    VALID_SIZES,
    DEFAULT_SIZES,
    TMDB_IMAGE_BASE
};
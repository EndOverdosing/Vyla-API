const generateProxyUrl = (req, tmdbPath, size = 'original') => {
    if (!tmdbPath) return null;
    const cleanPath = tmdbPath.startsWith('/') ? tmdbPath.substring(1) : tmdbPath;
    return `/api/image/${size}/${cleanPath}`;
};

module.exports = { generateProxyUrl };
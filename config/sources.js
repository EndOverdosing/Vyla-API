module.exports = [
    {
        id: "pstream",
        name: "P-Stream",
        urlTemplates: {
            movie: "https://iframe.pstream.mov/media/tmdb-movie-{id}",
            tv: "https://iframe.pstream.mov/media/tmdb-tv-{id}/{season}/{episode}"
        }
    },
    {
        id: "vidlink",
        name: "VidLink",
        urlTemplates: {
            movie: "https://vidlink.pro/movie/{id}",
            tv: "https://vidlink.pro/tv/{id}/{season}/{episode}"
        }
    },
    {
        id: "vidsrc",
        name: "VidSrc",
        urlTemplates: {
            movie: "https://vidsrc.xyz/embed/movie/{id}",
            tv: "https://vidsrc.xyz/embed/tv/{id}/{season}/{episode}"
        }
    },
    {
        id: "superembed",
        name: "SuperEmbed",
        urlTemplates: {
            movie: "https://multiembed.mov/?video_id={id}&tmdb=1",
            tv: "https://multiembed.mov/?video_id={id}&tmdb=1&s={season}&e={episode}"
        }
    }
];
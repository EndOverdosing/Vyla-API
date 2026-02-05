const PLAYER_SOURCES_CONFIG = [
    {
        id: "pstream",
        name: "P-Stream",
        isFrench: false,
        needsSandbox: true,
        urls: {
            movie: "https://iframe.pstream.mov/media/tmdb-movie-{id}",
            tv: "https://iframe.pstream.mov/media/tmdb-tv-{id}/{season}/{episode}",
        },
        startTimeParam: 't',
        timeFormat: 'hms',
        supportsEvents: true,
        eventOrigin: 'https://iframe.pstream.mov'
    },
    {
        id: "multiembed",
        name: "MultiEmbed",
        isFrench: false,
        urls: {
            movie: "https://multiembed.mov/?video_id={id}&tmdb=1",
            tv: "https://multiembed.mov/?video_id={id}&tmdb=1&s={season}&e={episode}",
        },
    },
    {
        id: "moviesapi",
        name: "MoviesAPI",
        isFrench: false,
        urls: {
            movie: "https://moviesapi.club/movie/{id}",
            tv: "https://moviesapi.club/tv/{id}-{season}-{episode}",
        },
    },
    {
        id: "hexa",
        name: "Hexa",
        isFrench: false,
        needsSandbox: true,
        urls: {
            movie: "https://hexa.watch/watch/movie/{id}",
            tv: "https://hexa.watch/watch/tv/{id}/{season}/{episode}",
        },
    },
    {
        id: "vidlink",
        name: "VidLink",
        isFrench: false,
        urls: {
            movie: "https://vidlink.pro/movie/{id}",
            tv: "https://vidlink.pro/tv/{id}/{season}/{episode}",
        },
        startTimeParam: 'startAt',
        timeFormat: 'seconds',
        supportsEvents: true,
        eventOrigin: 'https://vidlink.pro'
    },
    {
        id: "vidsrcXyz",
        name: "VidSrcXyz",
        isFrench: false,
        urls: {
            movie: "https://vidsrc.xyz/embed/movie/{id}",
            tv: "https://vidsrc.xyz/embed/tv/{id}/{season}/{episode}",
        },
    },
    {
        id: "vidsrcvip",
        name: "VidSrcVIP",
        isFrench: false,
        urls: {
            movie: "https://vidsrc.vip/embed/movie/{id}",
            tv: "https://vidsrc.vip/embed/tv/{id}/{season}/{episode}",
        },
    },
    {
        id: "2embed",
        name: "2Embed",
        isFrench: false,
        urls: {
            movie: "https://www.2embed.cc/embed/{id}",
            tv: "https://www.2embed.cc/embedtv/{id}&s={season}&e={episode}",
        },
    },
    {
        id: "123embed",
        name: "123Embed",
        isFrench: false,
        needsSandbox: true,
        urls: {
            movie: "https://play2.123embed.net/movie/{id}",
            tv: "https://play2.123embed.net/tv/{id}/{season}/{episode}",
        },
    },
    {
        id: "111movies",
        name: "111Movies",
        isFrench: false,
        urls: {
            movie: "https://111movies.com/movie/{id}",
            tv: "https://111movies.com/tv/{id}/{season}/{episode}",
        },
    },
    {
        id: "smashystream",
        name: "SmashyStream",
        isFrench: false,
        urls: {
            movie: "https://player.smashy.stream/movie/{id}",
            tv: "https://player.smashy.stream/tv/{id}?s={season}&e={episode}",
        },
        startTimeParam: 'startTime',
        timeFormat: 'seconds'
    },
    {
        id: "autoembed",
        name: "AutoEmbed",
        isFrench: false,
        needsSandbox: true,
        urls: {
            movie: "https://player.autoembed.cc/embed/movie/{id}",
            tv: "https://player.autoembed.cc/embed/tv/{id}/{season}/{episode}",
        },
    },
    {
        id: "videasy",
        name: "VidEasy (4K)",
        isFrench: false,
        urls: {
            movie: "https://player.videasy.net/movie/{id}?color=8834ec",
            tv: "https://player.videasy.net/tv/{id}/{season}/{episode}?color=8834ec",
        },
        supportsEvents: true,
        eventOrigin: 'https://player.videasy.net'
    },
    {
        id: "vidfast",
        name: "VidFast (4K)",
        isFrench: false,
        urls: {
            movie: "https://vidfast.pro/movie/{id}",
            tv: "https://vidfast.pro/tv/{id}/{season}/{episode}",
        },
        startTimeParam: 'startAt',
        timeFormat: 'seconds'
    },
    {
        id: "vidify",
        name: "Vidify",
        isFrench: false,
        needsSandbox: true,
        urls: {
            movie: "https://vidify.top/embed/movie/{id}",
            tv: "https://vidify.top/embed/tv/{id}/{season}/{episode}",
        },
    },
    {
        id: "rive",
        name: "RiveStream",
        isFrench: false,
        needsSandbox: true,
        urls: {
            movie: "https://rivestream.org/embed?type=movie&id={id}",
            tv: "https://rivestream.org/embed?type=tv&id={id}&season={season}&episode={episode}",
        },
    },
    {
        id: "vidora",
        name: "Vidora",
        isFrench: false,
        urls: {
            movie: "https://vidora.su/movie/{id}",
            tv: "https://vidora.su/tv/{id}/{season}/{episode}",
        },
    },
    {
        id: "vidsrccc",
        name: "VidSrcCC",
        isFrench: false,
        needsSandbox: true,
        urls: {
            movie: "https://vidsrc.cc/v2/embed/movie/{id}?autoPlay=false",
            tv: "https://vidsrc.cc/v2/embed/tv/{id}/{season}/{episode}?autoPlay=false",
        },
        supportsEvents: true,
        eventOrigin: 'https://vidsrc.cc'
    },
    {
        id: 'vidsrcto',
        name: 'VidSrcTO',
        isFrench: false,
        urls: {
            movie: 'https://vidsrc.to/embed/movie/{id}',
            tv: 'https://vidsrc.to/embed/tv/{id}/{season}/{episode}'
        }
    },
    {
        id: "streamflix",
        name: "StreamFlix",
        isFrench: false,
        urls: {
            movie: "https://watch.streamflix.one/movie/{id}/watch?server=1",
            tv: "https://watch.streamflix.one/tv/{id}/watch?server=1&season={season}&episode={episode}",
        },
    },
    {
        id: "vidzee",
        name: "VidZee",
        isFrench: false,
        urls: {
            movie: "https://player.vidzee.wtf/embed/movie/{id}",
            tv: "https://player.vidzee.wtf/embed/tv/{id}/{season}/{episode}",
        },
    },
    {
        id: "spenflix",
        name: "Spenflix",
        isFrench: false,
        needsSandbox: true,
        urls: {
            movie: "https://spencerdevs.xyz/movie/{id}",
            tv: "https://spencerdevs.xyz/tv/{id}/{season}/{episode}",
        },
    },
    {
        id: "primewire",
        name: "PrimeWire",
        isFrench: false,
        urls: {
            movie: "https://www.primewire.tf/embed/movie?tmdb={id}",
            tv: "https://www.primewire.tf/embed/tv?tmdb={id}&season={season}&episode={episode}",
        },
    },
    {
        id: "player4u",
        name: "Player 4U",
        isFrench: false,
        urls: {
            movie: "https://vidapi.xyz/embed/movie/{id}",
            tv: "https://vidapi.xyz/embed/tv/{id}&s={season}&e={episode}",
        },
    },
    {
        id: "bludflix",
        name: "BludFlix",
        isFrench: false,
        needsSandbox: true,
        urls: {
            movie: "https://watch.bludclart.com/movie/{id}/watch",
            tv: "https://watch.bludclart.com/tv/{id}/watch?season={season}&episode={episode}",
        },
    },
    {
        id: "flixersu",
        name: "Flixer SU",
        isFrench: false,
        needsSandbox: true,
        urls: {
            movie: "https://flixer.su/watch/movie/{id}",
            tv: "https://flixer.su/watch/tv/{id}/{season}/{episode}",
        },
    },
    {
        id: "mocine",
        name: "Mocine",
        isFrench: false,
        needsSandbox: true,
        urls: {
            movie: "https://mocine.cam/watching-movie?movieId={id}",
            tv: "https://mocine.cam/watching-series?id={id}&season={season}&episode={episode}",
        },
    },
    {
        id: "asguard",
        name: "Asguard",
        isFrench: false,
        needsSandbox: true,
        urls: {
            movie: "https://asgardstream-api.pages.dev/movie/{id}",
            tv: "https://asgardstream-api.pages.dev/tv/{id}/{season}/{episode}",
        },
    },
    {
        id: "turbovid",
        name: "TurboVid",
        isFrench: false,
        needsSandbox: true,
        urls: {
            movie: "https://turbovid.eu/api/req/movie/{id}",
            tv: "https://turbovid.eu/api/req/tv/{id}/{season}/{episode}",
        },
    },
    {
        id: "nontongo",
        name: "NonTongo",
        isFrench: false,
        urls: {
            movie: "https://www.nontongo.win/embed/movie/{id}",
            tv: "https://www.nontongo.win/embed/tv/{id}/{season}/{episode}",
        },
    },
    {
        id: "russian",
        name: "Russian",
        isFrench: false,
        needsSandbox: true,
        urls: {
            movie: "https://api.insertunit.ws/embed/imdb/{id}",
            tv: "https://api.insertunit.ws/embed/imdb/{id}?season={season}&episode={episode}",
        },
    },
    {
        id: "french",
        name: "French",
        isFrench: true,
        urls: {
            movie: "https://frembed.lol/api/film.php?id={id}",
            tv: "https://frembed.lol/api/serie.php?id={id}&sa={season}&epi={episode}",
        },
    },
];

module.exports = PLAYER_SOURCES_CONFIG;
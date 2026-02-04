const { fetchFromTMDB } = require('../services/tmdb');
const { generateProxyUrl } = require('../utils/urlHelper');

exports.getHomeData = async (req, res) => {
    try {
        const [
            trending,
            latest,
            awards,
            topRated,
            netflixMovies,
            actionMovies,
            tvOnAir,
            tvTop,
            tvPopular,
            tvNetflix,
            tvAction
        ] = await Promise.all([
            fetchFromTMDB('/trending/all/day'),
            fetchFromTMDB('/discover/movie', { sort_by: 'primary_release_date.desc', 'vote_count.gte': 50 }),
            fetchFromTMDB('/discover/movie', { sort_by: 'popularity.desc', 'vote_count.gte': 500, 'vote_average.gte': 7 }),
            fetchFromTMDB('/movie/top_rated', { region: 'US' }),
            fetchFromTMDB('/discover/movie', { with_watch_providers: '8', watch_region: 'US', sort_by: 'popularity.desc' }),
            fetchFromTMDB('/discover/movie', { with_genres: '28', sort_by: 'popularity.desc', 'vote_count.gte': 100 }),
            fetchFromTMDB('/tv/on_the_air'),
            fetchFromTMDB('/tv/top_rated'),
            fetchFromTMDB('/tv/popular'),
            fetchFromTMDB('/discover/tv', { with_watch_providers: '8', watch_region: 'US', sort_by: 'popularity.desc' }),
            fetchFromTMDB('/discover/tv', { with_genres: '10759', sort_by: 'popularity.desc' })
        ]);

        const processResults = (data) => {
            if (!data?.results) return [];
            return data.results.slice(0, 15).map(item => ({
                id: item.id,
                type: item.media_type || (item.title ? 'movie' : 'tv'),
                title: item.title || item.name,
                poster: generateProxyUrl(req, item.poster_path, 'w342'),
                backdrop: generateProxyUrl(req, item.backdrop_path, 'w780'),
                details_link: `/api/details/${item.media_type || (item.title ? 'movie' : 'tv')}/${item.id}`
            }));
        };

        const collections = [
            { title: "Adrenaline Action", genre: 28, type: "movie", size: "large" },
            { title: "Sci-Fi", genre: 878, type: "movie", size: "normal" },
            { title: "Animation", genre: 16, type: "movie", size: "normal" },
            { title: "Binge-Worthy Comedy", genre: 35, type: "tv", size: "wide" },
            { title: "Horror", genre: 27, type: "movie", size: "normal" },
            { title: "Adventure Picks", genre: 12, type: "movie", size: "normal" },
            { title: "Thrillers", genre: 53, type: "movie", size: "normal" },
            { title: "Romance Favorites", genre: 10749, type: "movie", size: "normal" },
            { title: "Documentaries", genre: 99, type: "movie", size: "normal" },
            { title: "Crime Stories", genre: 80, type: "tv", size: "wide" },
            { title: "Fantasy Worlds", genre: 14, type: "movie", size: "normal" },
            { title: "Historical Drama", genre: 36, type: "movie", size: "normal" },
            { title: "Character-Driven Drama", genre: 18, type: "tv", size: "large" },
            { title: "Music & Performances", genre: 10402, type: "movie", size: "normal" }
        ].map(c => ({
            ...c,
            list_link: `/api/list?endpoint=/discover/${c.type}&params=${encodeURIComponent(JSON.stringify({ with_genres: c.genre }))}`
        }));

        res.json({
            spotlight: processResults(trending).slice(0, 5),
            tabs: {
                discover: {
                    collections: collections,
                    rows: [
                        { title: "Latest Releases", items: processResults(latest), view_all_path: `/api/list?endpoint=/discover/movie&params=${encodeURIComponent('{"sort_by": "primary_release_date.desc", "vote_count.gte": 50}')}` },
                        { title: "4K Releases", items: processResults(awards), view_all_path: `/api/list?endpoint=/discover/movie&params=${encodeURIComponent('{"sort_by": "popularity.desc", "vote_count.gte": 500, "vote_average.gte": 7}')}` },
                        { title: "Top Rated", items: processResults(topRated), view_all_path: `/api/list?endpoint=/movie/top_rated&params=${encodeURIComponent('{"region": "US"}')}` },
                        { title: "Movies on Netflix", items: processResults(netflixMovies), view_all_path: `/api/list?endpoint=/discover/movie&params=${encodeURIComponent('{"with_watch_providers": "8", "watch_region": "US", "sort_by": "popularity.desc"}')}` },
                        { title: "Action Movies", items: processResults(actionMovies), view_all_path: `/api/list?endpoint=/discover/movie&params=${encodeURIComponent('{"with_genres": "28", "sort_by": "popularity.desc", "vote_count.gte": 100}')}` }
                    ]
                },
                movies: {
                    rows: [
                        { title: "In Cinemas", items: processResults(latest), view_all_path: `/api/list?endpoint=/movie/now_playing&params=${encodeURIComponent('{"region": "US"}')}` },
                        { title: "4K Releases", items: processResults(awards), view_all_path: `/api/list?endpoint=/discover/movie&params=${encodeURIComponent('{"sort_by": "popularity.desc", "vote_count.gte": 500, "vote_average.gte": 7}')}` },
                        { title: "Top Rated", items: processResults(topRated), view_all_path: `/api/list?endpoint=/movie/top_rated&params=${encodeURIComponent('{"region": "US"}')}` },
                        { title: "Movies on Netflix", items: processResults(netflixMovies), view_all_path: `/api/list?endpoint=/discover/movie&params=${encodeURIComponent('{"with_watch_providers": "8", "watch_region": "US", "sort_by": "popularity.desc"}')}` },
                        { title: "Action Movies", items: processResults(actionMovies), view_all_path: `/api/list?endpoint=/discover/movie&params=${encodeURIComponent('{"with_genres": "28", "sort_by": "popularity.desc"}')}` }
                    ]
                },
                tv: {
                    rows: [
                        { title: "On The Air", items: processResults(tvOnAir), view_all_path: `/api/list?endpoint=/tv/on_the_air` },
                        { title: "Top Rated", items: processResults(tvTop), view_all_path: `/api/list?endpoint=/tv/top_rated` },
                        { title: "Most Popular", items: processResults(tvPopular), view_all_path: `/api/list?endpoint=/tv/popular` },
                        { title: "Shows on Netflix", items: processResults(tvNetflix), view_all_path: `/api/list?endpoint=/discover/tv&params=${encodeURIComponent('{"with_watch_providers": "8", "watch_region": "US", "sort_by": "popularity.desc"}')}` },
                        { title: "Action & Adventure", items: processResults(tvAction), view_all_path: `/api/list?endpoint=/discover/tv&params=${encodeURIComponent('{"with_genres": "10759", "sort_by": "popularity.desc"}')}` }
                    ]
                }
            }
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to load home data" });
    }
};
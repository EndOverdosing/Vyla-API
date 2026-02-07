# Vyla Media API

A **headless, backend-first** RESTful API providing access to TMDB's comprehensive movie and TV show database. Vyla is designed to be used as a standalone backend service that powers your custom frontend applications.

## Two Ways to Use Vyla

### 1. **Use Our Hosted API** (Recommended for Quick Start)
Don't want to host your own backend? Use our production-ready API:

**Base URL:** `https://vyla-api.vercel.app/api`

Just point your frontend to our hosted API and start building! No backend setup required.

### 2. **Self-Host Your Own Instance**
Fork this repo and deploy your own instance with custom configurations.

---

## Features

### Core Features
- **Backend-First Architecture**: Pure API service, bring your own frontend
- **Production-Ready Hosted API**: Use `https://vyla-api.vercel.app/api` immediately
- **34 Streaming Sources**: Multiple player options including 4K sources
- **RESTful Design**: Clean API paths with consistent response formats
- **CORS Enabled**: Works with any frontend framework (React, Vue, Angular, etc.)

### Content Features
- **Title/Logo Images**: Professional logo overlays for all media
- **Enhanced Images**: Multiple backdrops, posters, logos per item
- **Video Collections**: All trailers, teasers, clips available
- **Curated Collections**: Trending, top-rated, Netflix Originals, genre-specific
- **Comprehensive Details**: Full metadata with cast, crew, seasons
- **Smart Search**: Multi-query search across movies and TV shows
- **Genre Browsing**: Filter and sort by genre
- **Episode Details**: Season and episode information
- **Actor Profiles**: Detailed cast information with filmography

### Technical Features
- **Direct TMDB Images**: Direct image URLs with automatic resizing
- **Health Monitoring**: Built-in health check and status endpoints
- **Error Handling**: Consistent error responses
- **Pagination**: Built-in pagination for all list endpoints

---

## Quick Start for Frontend Developers

### Using the Hosted API

Simply use this base URL in your frontend:

```javascript
const API_BASE_URL = 'https://vyla-api.vercel.app/api';

const getHomeData = async () => {
  const response = await fetch(`${API_BASE_URL}/home`);
  return response.json();
};

const searchMovies = async (query) => {
  const response = await fetch(`${API_BASE_URL}/search?q=${query}`);
  return response.json();
};

const getMovieDetails = async (id) => {
  const response = await fetch(`${API_BASE_URL}/details/movie/${id}`);
  return response.json();
};

const getMovieGenres = async () => {
  const response = await fetch(`${API_BASE_URL}/genres/movie`);
  return response.json();
};

const getActionMovies = async (page = 1) => {
  const response = await fetch(`${API_BASE_URL}/genres/movie/28?page=${page}`);
  return response.json();
};

const getSeasonDetails = async (tvId, seasonNumber) => {
  const response = await fetch(`${API_BASE_URL}/tv/${tvId}/season/${seasonNumber}`);
  return response.json();
};

const getEpisodeDetails = async (tvId, season, episode) => {
  const response = await fetch(`${API_BASE_URL}/episodes/${tvId}/${season}/${episode}`);
  return response.json();
};
```

### React Example with Title Images

```jsx
import { useState, useEffect } from 'react';

const API_BASE_URL = 'https://vyla-api.vercel.app/api';

function Movies() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/home`)
      .then(res => res.json())
      .then(data => setMovies(data.data[0].items));
  }, []);

  return (
    <div>
      {movies.map(movie => (
        <div key={movie.id} className="movie-card">
          {/* Background Image */}
          <div style={{ backgroundImage: `url(${movie.backdrop})` }} className="backdrop" />
          
          {/* Title Logo Overlay*/}
          {movie.title_image && (
            <img src={movie.title_image} alt={movie.title} className="title-logo" />
          )}
          
          {/* Poster */}
          <img src={movie.poster} alt={movie.title} className="poster" />
          
          <h3>{movie.title}</h3>
          <p>⭐ {movie.vote_average}</p>
        </div>
      ))}
    </div>
  );
}
```

### Vue Example with Genre Browsing

```vue
<template>
  <div>
    <!-- Genre Filter -->
    <div class="genres">
      <button 
        v-for="genre in genres" 
        :key="genre.id"
        @click="loadGenre(genre.id)"
        :class="{ active: selectedGenre === genre.id }"
      >
        {{ genre.name }}
      </button>
    </div>

    <!-- Movies Grid -->
    <div class="grid">
      <div v-for="movie in movies" :key="movie.id" class="card">
        <img v-if="movie.title_image" :src="movie.title_image" class="title-logo" />
        <img :src="movie.poster" :alt="movie.title" />
        <h3>{{ movie.title }}</h3>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      movies: [],
      genres: [],
      selectedGenre: null,
      API_BASE_URL: 'https://vyla-api.vercel.app/api'
    }
  },
  mounted() {
    fetch(`${this.API_BASE_URL}/genres/movie`)
      .then(res => res.json())
      .then(data => this.genres = data.genres);
  },
  methods: {
    loadGenre(genreId) {
      this.selectedGenre = genreId;
      fetch(`${this.API_BASE_URL}/genres/movie/${genreId}`)
        .then(res => res.json())
        .then(data => this.movies = data.results);
    }
  }
}
</script>
```

### Next.js Example with TV Episodes

```jsx
const API_BASE_URL = 'https://vyla-api.vercel.app/api';

export async function getServerSideProps({ params }) {
  const [showRes, seasonRes] = await Promise.all([
    fetch(`${API_BASE_URL}/details/tv/${params.id}`),
    fetch(`${API_BASE_URL}/tv/${params.id}/season/${params.season}`)
  ]);

  const [show, season] = await Promise.all([
    showRes.json(),
    seasonRes.json()
  ]);

  return { props: { show, season } };
}

export default function SeasonPage({ show, season }) {
  return (
    <div>
      {/* Show Header with Logo */}
      {show.info.title_image && (
        <img src={show.info.title_image} alt={show.info.title} />
      )}
      <h1>{show.info.title}</h1>

      {/* Episodes Grid */}
      <div className="episodes">
        {season.data.episodes.map(episode => (
          <div key={episode.id} className="episode-card">
            <img src={episode.still} alt={episode.name} />
            <h3>E{episode.episode_number}: {episode.name}</h3>
            <p>{episode.overview}</p>
            <p>⭐ {episode.rating}</p>
            <a href={episode.player_link}>Watch</a>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## API Endpoints

All endpoints are available at: `https://vyla-api.vercel.app/api`

### Core Endpoints

| Endpoint | Description | Example |
|----------|-------------|---------|
| `/home` | Get curated home sections | `GET /api/home` |
| `/search?q={query}` | Search movies/TV shows | `GET /api/search?q=avengers` |
| `/details/{type}/{id}` | Get media details | `GET /api/details/movie/299534` |
| `/cast/{id}` | Get actor details | `GET /api/cast/3223` |
| `/player/{type}/{id}` | Get streaming sources | `GET /api/player/movie/299534` |
| `/list?endpoint={path}` | Custom TMDB lists | `GET /api/list?endpoint=/movie/top_rated` |
| `/image/{size}/{file}` | Image proxy | `GET /api/image/w500/poster.jpg` |
| `/health` | Health check | `GET /api/health` |
| `/genres/{type}` | Get genre list | `GET /api/genres/movie` |
| `/genres/{type}/{genreId}` | Browse by genre | `GET /api/genres/movie/28?page=1` |
| `/tv/{tvId}/season/{seasonNumber}` | Get season details | `GET /api/tv/1399/season/1` |
| `/episodes/{tvId}/{season}/{episode}` | Get episode details | `GET /api/episodes/1399/1/1` |

### Quick Examples

**Get Trending Movies:**
```bash
curl https://vyla-api.vercel.app/api/home
```

**Search for Content:**
```bash
curl "https://vyla-api.vercel.app/api/search?q=avengers"
```

**Get Movie Details:**
```bash
curl https://vyla-api.vercel.app/api/details/movie/299534
```

**Browse Action Movies:**
```bash
curl "https://vyla-api.vercel.app/api/genres/movie/28?page=1&sort_by=popularity.desc"
```

**Get TV Season:**
```bash
curl https://vyla-api.vercel.app/api/tv/1399/season/1
```

**Get Streaming Sources:**
```bash
curl https://vyla-api.vercel.app/api/player/movie/299534
```

---

## Enhanced Response Features

### Title/Logo Images

All media items now include `title_image` field with transparent logo overlays:

```json
{
  "id": 299534,
  "title": "Avengers: Endgame",
  "title_image": "https://image.tmdb.org/t/p/w500/logo.png",
  "poster": "https://image.tmdb.org/t/p/w342/poster.jpg",
  "backdrop": "https://image.tmdb.org/t/p/w780/backdrop.jpg"
}
```

**Use Case**: Perfect for Netflix-style hero sections with logo overlays on backdrop images.

### Enhanced Image Collections

Access multiple images for each media item:

```json
{
  "images": {
    "backdrops": [
      {
        "file_path": "/backdrop.jpg",
        "url": "https://image.tmdb.org/t/p/original/backdrop.jpg",
        "width": 3840,
        "height": 2160,
        "vote_average": 5.384
      }
    ],
    "posters": [...],
    "logos": [...]
  }
}
```

### Video Collections

Get all available videos (trailers, teasers, clips):

```json
{
  "videos": [
    {
      "id": "5d1f9f9b9251413e8b00001f",
      "key": "TcMBFSGVi1c",
      "name": "Official Trailer",
      "type": "Trailer",
      "url": "https://www.youtube.com/watch?v=TcMBFSGVi1c",
      "embed_url": "https://www.youtube.com/embed/TcMBFSGVi1c"
    }
  ]
}
```

### Genre Browsing

Browse content by genre with sorting and pagination:

```json
{
  "meta": {
    "type": "movie",
    "genre_id": 28,
    "page": 1,
    "sort_by": "popularity.desc"
  },
  "results": [...]
}
```

**Available Sort Options**:
- `popularity.desc` / `popularity.asc`
- `vote_average.desc` / `vote_average.asc`
- `release_date.desc` / `release_date.asc`
- `title.asc` / `title.desc`

### Episode Details

Complete TV show navigation:

```json
{
  "data": {
    "episode_number": 1,
    "name": "Winter Is Coming",
    "crew": {
      "directors": [...],
      "writers": [...]
    },
    "guest_stars": [
      {
        "name": "Jason Momoa",
        "character": "Khal Drogo"
      }
    ]
  }
}
```

---

## Streaming Sources

Vyla provides **34 streaming sources** out of the box:

- **Premium 4K**: VidEasy, VidFast
- **Popular**: VidSrc, VidLink, P-Stream, MultiEmbed
- **Specialized**: French sources, Russian sources
- **Alternatives**: 2Embed, SmashyStream, AutoEmbed, and 25+ more

Each source includes:
- `stream_url`: Direct embed URL
- `isFrench`: Language indicator
- `needsSandbox`: Security requirements
- `supportsEvents`: Event communication support
- `startTimeParam`: Custom time parameter support

---

## Self-Hosting (Optional)

Want to run your own instance? Here's how:

### Prerequisites

- Node.js 14+
- TMDB API Key ([Get it here](https://www.themoviedb.org/settings/api))

### Installation

```bash
git clone https://github.com/endoverdosing/Vyla-API.git
cd Vyla-API
npm install
```

### Configuration

Create `.env` file:

```env
TMDB_API_KEY=your_tmdb_api_key_here
PORT=3000
NODE_ENV=development
```

### Run Locally

```bash
npm run dev
```

Your API will be available at `http://localhost:3000/api`

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/endoverdosing/Vyla-API)

1. Click the deploy button
2. Add `TMDB_API_KEY` environment variable
3. Deploy!

Your API will be live at `https://your-project.vercel.app/api`

---

## Complete API Documentation

For detailed API documentation, see [API_DOCS.md](./API_DOCS.md)

### Response Format

All endpoints return consistent JSON responses:

**Success:**
```json
{
  "success": true,
  "data": {},
  "meta": {}
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message",
  "request": {
    "timestamp": "2025-02-07T12:00:00.000Z"
  }
}
```

---

## Frontend Framework Examples

### Axios Setup (Universal)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://vyla-api.vercel.app/api',
  timeout: 10000
});

export const vylaApi = {
  getHome: () => api.get('/home'),
  search: (query, page = 1) => api.get('/search', { params: { q: query, page } }),
  getDetails: (type, id) => api.get(`/details/${type}/${id}`),
  getCast: (id) => api.get(`/cast/${id}`),
  getPlayer: (type, id, season, episode) => {
    const params = type === 'tv' ? { s: season, e: episode } : {};
    return api.get(`/player/${type}/${id}`, { params });
  },
  getGenres: (type) => api.get(`/genres/${type}`),
  browseGenre: (type, genreId, page = 1, sortBy = 'popularity.desc') => 
    api.get(`/genres/${type}/${genreId}`, { params: { page, sort_by: sortBy } }),
  getSeason: (tvId, seasonNumber) => api.get(`/tv/${tvId}/season/${seasonNumber}`),
  getEpisode: (tvId, season, episode) => api.get(`/episodes/${tvId}/${season}/${episode}`)
};
```

### Fetch Wrapper (Universal)

```javascript
class VylaAPI {
  constructor(baseURL = 'https://vyla-api.vercel.app/api') {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, options);
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.json();
  }

  getHome() {
    return this.request('/home');
  }

  search(query, page = 1) {
    return this.request(`/search?q=${query}&page=${page}`);
  }

  getDetails(type, id) {
    return this.request(`/details/${type}/${id}`);
  }

  getGenres(type) {
    return this.request(`/genres/${type}`);
  }

  browseGenre(type, genreId, page = 1, sortBy = 'popularity.desc') {
    return this.request(`/genres/${type}/${genreId}?page=${page}&sort_by=${sortBy}`);
  }

  getSeason(tvId, seasonNumber) {
    return this.request(`/tv/${tvId}/season/${seasonNumber}`);
  }

  getEpisode(tvId, season, episode) {
    return this.request(`/episodes/${tvId}/${season}/${episode}`);
  }
}

export const vylaApi = new VylaAPI();
```

### React Query (React)

```jsx
import { useQuery } from '@tanstack/react-query';

const API_BASE = 'https://vyla-api.vercel.app/api';

export const useHome = () => {
  return useQuery({
    queryKey: ['home'],
    queryFn: () => fetch(`${API_BASE}/home`).then(res => res.json())
  });
};

export const useSearch = (query) => {
  return useQuery({
    queryKey: ['search', query],
    queryFn: () => fetch(`${API_BASE}/search?q=${query}`).then(res => res.json()),
    enabled: !!query
  });
};

export const useMovieDetails = (id) => {
  return useQuery({
    queryKey: ['movie', id],
    queryFn: () => fetch(`${API_BASE}/details/movie/${id}`).then(res => res.json())
  });
};

export const useGenres = (type) => {
  return useQuery({
    queryKey: ['genres', type],
    queryFn: () => fetch(`${API_BASE}/genres/${type}`).then(res => res.json())
  });
};

export const useGenreContent = (type, genreId, page = 1) => {
  return useQuery({
    queryKey: ['genre', type, genreId, page],
    queryFn: () => fetch(`${API_BASE}/genres/${type}/${genreId}?page=${page}`).then(res => res.json())
  });
};

export const useSeason = (tvId, seasonNumber) => {
  return useQuery({
    queryKey: ['season', tvId, seasonNumber],
    queryFn: () => fetch(`${API_BASE}/tv/${tvId}/season/${seasonNumber}`).then(res => res.json())
  });
};

export const useEpisode = (tvId, season, episode) => {
  return useQuery({
    queryKey: ['episode', tvId, season, episode],
    queryFn: () => fetch(`${API_BASE}/episodes/${tvId}/${season}/${episode}`).then(res => res.json())
  });
};
```

---

## CORS & Security

- **CORS Enabled**: Works from any domain
- **Rate Limiting**: Fair usage policies apply
- **HTTPS Only**: Secure connections required in production

---

## Use Cases

Perfect for building:
- **Movie/TV Streaming Platforms** - Complete with player integration
- **Content Discovery Apps** - Browse by genre, trending, top-rated
- **Media Recommendation Systems** - Related content suggestions
- **Entertainment Dashboards** - Track shows, episodes, actors
- **Mobile Apps** (React Native, Flutter) - Full API access
- **Desktop Apps** (Electron) - Cross-platform support
- **Browser Extensions** - Enhance streaming sites
- **Discord Bots** - Movie/TV information commands
- **Telegram Bots** - Media search and recommendations

---

## Performance

- **Response Time**: < 500ms average
- **Uptime**: 99.9%
- **Rate Limits**: Fair usage
- **Caching**: Automatic image caching (1 year)
- **CDN**: Global edge network via Vercel

---

## Contributing

We welcome contributions from frontend and backend developers!

### For Frontend Developers
- Build awesome UIs using our API
- Share your implementations
- Report API issues or request features

### For Backend Developers
- Improve API performance
- Add new endpoints
- Enhance documentation

### How to Contribute
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## Environment Variables

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `TMDB_API_KEY` | Yes | Your TMDB API key | - |
| `PORT` | No | Server port | 3000 |
| `NODE_ENV` | No | Environment | development |
| `ALLOWED_ORIGINS` | No | CORS origins | * |

---

## Common Genre IDs

### Movies
- **28**: Action
- **12**: Adventure
- **16**: Animation
- **35**: Comedy
- **80**: Crime
- **99**: Documentary
- **18**: Drama
- **14**: Fantasy
- **27**: Horror
- **10749**: Romance
- **878**: Science Fiction
- **53**: Thriller

### TV Shows
- **10759**: Action & Adventure
- **16**: Animation
- **35**: Comedy
- **80**: Crime
- **99**: Documentary
- **18**: Drama
- **10751**: Family
- **9648**: Mystery
- **10765**: Sci-Fi & Fantasy

---

## Support & Community

- **Issues**: [GitHub Issues](https://github.com/endoverdosing/vyla-api/issues)
- **Discussions**: [GitHub Discussions](https://github.com/endoverdosing/vyla-api/discussions)
- **API Status**: `https://vyla-api.vercel.app/api/health`
- **Documentation**: [API_DOCS.md](./API_DOCS.md)

---

## License

MIT License - feel free to use in personal and commercial projects!

---

## Acknowledgments

- **TMDB**: For providing comprehensive media data
- **Streaming Providers**: For embed sources
- **Community**: For contributions and feedback

---

## Links

- **Live API**: https://vyla-api.vercel.app/api
- **GitHub**: https://github.com/endoverdosing/vyla-api
- **TMDB**: https://www.themoviedb.org
- **Documentation**: [API_DOCS.md](./API_DOCS.md)

---

**Built with ❤️ for developers who want a hassle-free media API**
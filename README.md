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

- **Backend-First Architecture**: Pure API service, bring your own frontend
- **Production-Ready Hosted API**: Use `https://vyla-api.vercel.app/api` immediately
- **34 Streaming Sources**: Multiple player options including 4K sources
- **Curated Content**: Trending, top-rated, Netflix Originals, and genre-specific collections
- **Comprehensive Details**: Full movie/TV metadata with cast, crew, seasons, and recommendations
- **Smart Search**: Multi-query search across movies and TV shows
- **Actor Profiles**: Detailed cast information with filmography
- **Image Optimization**: Direct TMDB image URLs with automatic resizing and caching
- **RESTful Design**: Clean API paths with consistent response formats
- **CORS Enabled**: Works with any frontend framework (React, Vue, Angular, etc.)
- **Health Monitoring**: Built-in health check and status endpoints

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
```

### React Example

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
        <div key={movie.id}>
          <h3>{movie.title}</h3>
          <img src={movie.poster} alt={movie.title} />
        </div>
      ))}
    </div>
  );
}
```

### Vue Example

```vue
<template>
  <div>
    <div v-for="movie in movies" :key="movie.id">
      <h3>{{ movie.title }}</h3>
      <img :src="movie.poster" :alt="movie.title" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      movies: [],
      API_BASE_URL: 'https://vyla-api.vercel.app/api'
    }
  },
  mounted() {
    fetch(`${this.API_BASE_URL}/home`)
      .then(res => res.json())
      .then(data => this.movies = data.data[0].items);
  }
}
</script>
```

### Next.js Example

```jsx
const API_BASE_URL = 'https://vyla-api.vercel.app/api';

export async function getServerSideProps() {
  const res = await fetch(`${API_BASE_URL}/home`);
  const data = await res.json();

  return {
    props: { homeData: data }
  };
}

export default function Home({ homeData }) {
  return (
    <div>
      {homeData.data.map(section => (
        <section key={section.title}>
          <h2>{section.title}</h2>
          <div>
            {section.items.map(item => (
              <div key={item.id}>
                <img src={item.poster} alt={item.title} />
                <h3>{item.title}</h3>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
```

---

## API Endpoints

All endpoints are available at: `https://vyla-api.vercel.app/api`

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
| `/status` | Server status | `GET /api/status` |

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

**Get Streaming Sources:**
```bash
curl https://vyla-api.vercel.app/api/player/movie/299534
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
    "timestamp": "2025-02-04T12:00:00.000Z"
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
  }
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

  getCast(id) {
    return this.request(`/cast/${id}`);
  }

  getPlayer(type, id, season, episode) {
    const params = type === 'tv' ? `?s=${season}&e=${episode}` : '';
    return this.request(`/player/${type}/${id}${params}`);
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
```

### SWR (React/Next.js)

```jsx
import useSWR from 'swr';

const API_BASE = 'https://vyla-api.vercel.app/api';
const fetcher = (url) => fetch(url).then(res => res.json());

export const useHome = () => {
  return useSWR(`${API_BASE}/home`, fetcher);
};

export const useSearch = (query) => {
  return useSWR(query ? `${API_BASE}/search?q=${query}` : null, fetcher);
};

export const useMovieDetails = (id) => {
  return useSWR(`${API_BASE}/details/movie/${id}`, fetcher);
};
```

---

## CORS & Security

- **CORS Enabled**: Works from any domain
- **Rate Limiting**: Fair usage policies apply
- **Image Proxy**: Built-in TMDB image caching
- **HTTPS Only**: Secure connections required in production

---

## Example Response Objects

### Home Data
```json
{
  "success": true,
  "data": [
    {
      "title": "Trending Now",
      "layout_type": "carousel",
      "items": [
        {
          "id": 299534,
          "title": "Avengers: Endgame",
          "poster": "https://image.tmdb.org/t/p/w342/poster.jpg",
          "backdrop": "https://image.tmdb.org/t/p/w780/backdrop.jpg",
          "media_type": "movie",
          "vote_average": 8.3,
          "release_date": "2019-04-24",
          "details_link": "/api/details/movie/299534"
        }
      ]
    }
  ]
}
```

### Movie Details
```json
{
  "success": true,
  "info": {
    "id": 299534,
    "title": "Avengers: Endgame",
    "overview": "After the devastating events...",
    "runtime": 181,
    "rating": 8.3,
    "genres": [{"id": 28, "name": "Action"}],
    "backdrop": "https://image.tmdb.org/t/p/original/backdrop.jpg",
    "poster": "https://image.tmdb.org/t/p/w780/poster.jpg",
    "trailer_url": "https://www.youtube.com/watch?v=..."
  },
  "cast": [],
  "related": [],
  "player_link": "/api/player/movie/299534"
}
```

### Streaming Sources
```json
{
  "success": true,
  "meta": {
    "content_id": 299534,
    "type": "movie"
  },
  "sources": [
    {
      "id": "pstream",
      "name": "P-Stream",
      "stream_url": "https://iframe.pstream.mov/media/tmdb-movie-299534",
      "isFrench": false,
      "needsSandbox": true,
      "supportsEvents": true
    }
  ]
}
```

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

## Deployment Options

### Vercel (Recommended)
```bash
vercel --prod
```

### Railway
```bash
railway up
```

### Heroku
```bash
git push heroku main
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

---

## Support & Community

- **Issues**: [GitHub Issues](https://github.com/endoverdosing/vyla-api/issues)
- **Discussions**: [GitHub Discussions](https://github.com/endoverdosing/vyla-api/discussions)
- **API Status**: `https://vyla-api.vercel.app/api/status`
- **Documentation**: [API_DOCS.md](./API_DOCS.md)

---

## Use Cases

Perfect for building:
- **Movie/TV Streaming Platforms**
- **Content Discovery Apps**
- **Media Recommendation Systems**
- **Entertainment Dashboards**
- **Mobile Apps** (React Native, Flutter)
- **Desktop Apps** (Electron)
- **Browser Extensions**
- **Discord Bots**
- **Telegram Bots**

---

## Performance

- **Response Time**: < 500ms average
- **Uptime**: 99.9%
- **Rate Limits**: Fair usage
- **Caching**: Automatic image caching (1 year)
- **CDN**: Global edge network via Vercel

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
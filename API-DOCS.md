# Vyla API - Complete Developer Documentation

## Base URL

**Production:** `https://vyla-api.vercel.app/api`

**Local Development:** `http://localhost:3000/api`

---

## Quick Integration

### JavaScript/TypeScript

```typescript
const VYLA_API = 'https://vyla-api.vercel.app/api';

interface VylaResponse<T> {
  success: boolean;
  data?: T;
  meta?: any;
  error?: string;
}

class VylaClient {
  private baseURL: string;

  constructor(baseURL: string = VYLA_API) {
    this.baseURL = baseURL;
  }

  private async fetch<T>(endpoint: string): Promise<VylaResponse<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`);
    return response.json();
  }

  async getHome() {
    return this.fetch('/home');
  }

  async search(query: string, page: number = 1) {
    return this.fetch(`/search?q=${encodeURIComponent(query)}&page=${page}`);
  }

  async getMovieDetails(id: number) {
    return this.fetch(`/details/movie/${id}`);
  }

  async getTVDetails(id: number) {
    return this.fetch(`/details/tv/${id}`);
  }

  async getCast(id: number) {
    return this.fetch(`/cast/${id}`);
  }

  async getMoviePlayer(id: number) {
    return this.fetch(`/player/movie/${id}`);
  }

  async getTVPlayer(id: number, season: number, episode: number) {
    return this.fetch(`/player/tv/${id}?s=${season}&e=${episode}`);
  }

  async getList(endpoint: string, params?: object, page: number = 1) {
    const queryParams = new URLSearchParams({
      endpoint,
      ...(params && { params: JSON.stringify(params) }),
      page: page.toString()
    });
    return this.fetch(`/list?${queryParams}`);
  }

  getImageURL(path: string, size: string = 'w500') {
    return `${this.baseURL}/image/${size}/${path}`;
  }
}

export const vyla = new VylaClient();
```

---

## API Endpoints Reference

### 1. Home Content

Get curated home page sections with trending, top-rated, and genre-based content.

**Endpoint:** `GET /api/home`

**No Parameters Required**

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "title": "Trending Now",
      "layout_type": "carousel",
      "item_count": 20,
      "items": [
        {
          "id": 299534,
          "title": "Avengers: Endgame",
          "overview": "After the devastating events of Avengers: Infinity War...",
          "poster_path": "/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
          "poster": "https://image.tmdb.org/t/p/w342/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
          "backdrop_path": "/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
          "backdrop": "https://image.tmdb.org/t/p/w780/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
          "media_type": "movie",
          "vote_average": 8.3,
          "release_date": "2019-04-24",
          "year": "2019",
          "genre_ids": [12, 28, 878],
          "popularity": 120.5,
          "details_link": "/api/details/movie/299534"
        }
      ]
    },
    {
      "title": "Top Rated Movies",
      "layout_type": "row",
      "items": []
    }
  ],
  "meta": {
    "timestamp": "2025-02-04T12:00:00.000Z",
    "version": "1.0.0",
    "title": "Vyla - Home",
    "image": "https://image.tmdb.org/t/p/original/backdrop.jpg"
  },
  "stats": {
    "total_sections": 12,
    "total_items": 240
  }
}
```

**Sections Included:**
- Trending Now (carousel)
- Trending Movies (row)
- Top Rated Movies (row)
- Top Rated TV Shows (row)
- Netflix Originals (row)
- Action Movies (row)
- Comedy Movies (row)
- Horror Movies (row)
- Romance Movies (row)
- Documentaries (row)
- Animation (row)
- Science Fiction (row)

**Example Usage:**
```javascript
const response = await fetch('https://vyla-api.vercel.app/api/home');
const data = await response.json();

const trendingSection = data.data.find(section => section.title === 'Trending Now');
const trendingMovies = trendingSection.items;
```

---

### 2. Search

Search for movies and TV shows by query.

**Endpoint:** `GET /api/search`

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| q | string | Yes | Search query (min 2 characters) |
| page | number | No | Page number (default: 1) |

**Example Request:**
```bash
GET https://vyla-api.vercel.app/api/search?q=avengers&page=1
```

**Response:**
```json
{
  "success": true,
  "meta": {
    "query": "avengers",
    "page": 1,
    "total_pages": 5,
    "total_results": 94,
    "has_next": true,
    "has_prev": false,
    "next_page": 2,
    "prev_page": null,
    "back_path": "/api/home",
    "timestamp": "2025-02-04T12:00:00.000Z"
  },
  "results": [
    {
      "id": 299534,
      "type": "movie",
      "title": "Avengers: Endgame",
      "overview": "After the devastating events...",
      "poster_path": "/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
      "poster": "https://image.tmdb.org/t/p/w342/poster.jpg",
      "backdrop": "https://image.tmdb.org/t/p/w780/backdrop.jpg",
      "rating": 8.3,
      "popularity": 120.5,
      "release_date": "2019-04-24",
      "year": "2019",
      "genre_ids": [12, 28, 878],
      "details_path": "/api/details/movie/299534",
      "details_link": "/api/details/movie/299534"
    }
  ],
  "stats": {
    "filtered_results": 20,
    "movies": 15,
    "tv_shows": 5
  }
}
```

**Example Usage:**
```javascript
async function searchContent(query, page = 1) {
  const response = await fetch(
    `https://vyla-api.vercel.app/api/search?q=${encodeURIComponent(query)}&page=${page}`
  );
  return response.json();
}
```

---

### 3. Media Details

Get comprehensive details for a movie or TV show.

**Endpoint:** `GET /api/details/:type/:id`

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| type | string | Yes | Media type: 'movie' or 'tv' |
| id | number | Yes | TMDB media ID |

**Movie Example:**
```bash
GET https://vyla-api.vercel.app/api/details/movie/299534
```

**TV Example:**
```bash
GET https://vyla-api.vercel.app/api/details/tv/1668
```

**Response (Movie):**
```json
{
  "success": true,
  "view_path": "/api/details/movie/299534",
  "meta": {
    "pagination": {
      "page": 1,
      "total_pages": 1,
      "has_next": false,
      "has_prev": false
    },
    "links": {
      "self": "/api/details/movie/299534",
      "canonical": "/movie/299534",
      "player": "/api/player/movie/299534"
    },
    "type": "movie",
    "title": "Avengers: Endgame",
    "description": "After the devastating events...",
    "image": "https://image.tmdb.org/t/p/original/backdrop.jpg"
  },
  "info": {
    "id": 299534,
    "type": "movie",
    "title": "Avengers: Endgame",
    "tagline": "Part of the journey is the end.",
    "overview": "After the devastating events...",
    "runtime": 181,
    "release_date": "2019-04-24",
    "rating": 8.3,
    "vote_count": 28453,
    "popularity": 120.5,
    "genres": [
      { "id": 12, "name": "Adventure" },
      { "id": 28, "name": "Action" },
      { "id": 878, "name": "Science Fiction" }
    ],
    "backdrop": "https://image.tmdb.org/t/p/original/backdrop.jpg",
    "poster": "https://image.tmdb.org/t/p/w780/poster.jpg",
    "trailer_url": "https://www.youtube.com/watch?v=TcMBFSGVi1c",
    "homepage": "https://www.marvel.com/movies/avengers-endgame",
    "status": "Released",
    "original_language": "en",
    "original_title": "Avengers: Endgame",
    "production_companies": [
      {
        "id": 420,
        "name": "Marvel Studios",
        "logo_path": "https://image.tmdb.org/t/p/w500/logo.png",
        "origin_country": "US"
      }
    ],
    "production_countries": [],
    "spoken_languages": []
  },
  "cast": [
    {
      "id": 3223,
      "name": "Robert Downey Jr.",
      "character": "Tony Stark / Iron Man",
      "profile": "https://image.tmdb.org/t/p/w185/profile.jpg",
      "view_cast_link": "/api/cast/3223",
      "order": 0
    }
  ],
  "crew": {
    "directors": [
      {
        "id": 1234,
        "name": "Anthony Russo",
        "profile": "https://image.tmdb.org/t/p/w185/profile.jpg",
        "view_cast_link": "/api/cast/1234"
      }
    ],
    "writers": []
  },
  "related": [
    {
      "id": 299536,
      "type": "movie",
      "title": "Avengers: Infinity War",
      "overview": "As the Avengers and their allies...",
      "poster": "https://image.tmdb.org/t/p/w342/poster.jpg",
      "backdrop": "https://image.tmdb.org/t/p/w780/backdrop.jpg",
      "year": "2018",
      "rating": 8.2,
      "details_link": "/api/details/movie/299536"
    }
  ],
  "player_link": "/api/player/movie/299534"
}
```

**TV Show Additional Fields:**
```json
{
  "info": {
    "last_air_date": "2004-05-06",
    "number_of_seasons": 10,
    "number_of_episodes": 236,
    "in_production": false,
    "type": "Scripted",
    "created_by": [
      {
        "id": 1234,
        "name": "David Crane",
        "profile": "https://image.tmdb.org/t/p/w185/profile.jpg",
        "view_cast_link": "/api/cast/1234"
      }
    ]
  },
  "seasons": [
    {
      "number": 1,
      "name": "Season 1",
      "episode_count": 24,
      "air_date": "1994-09-22",
      "poster": "https://image.tmdb.org/t/p/w780/season.jpg",
      "overview": "Rachel leaves her fiancé at the altar..."
    }
  ]
}
```

---

### 4. Cast Details

Get detailed information about actors and cast members.

**Endpoint:** `GET /api/cast/:id`

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | number | Yes | TMDB person ID |

**Example:**
```bash
GET https://vyla-api.vercel.app/api/cast/3223
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 3223,
    "name": "Robert Downey Jr.",
    "biography": "Robert John Downey Jr. is an American actor...",
    "birthday": "1965-04-04",
    "deathday": null,
    "place_of_birth": "Manhattan, New York City, New York, USA",
    "profile": "https://image.tmdb.org/t/p/h632/profile.jpg",
    "popularity": 120.5,
    "known_for_department": "Acting",
    "also_known_as": ["RDJ"],
    "homepage": null,
    "known_for": {
      "movies": [
        {
          "id": 299534,
          "title": "Avengers: Endgame",
          "character": "Tony Stark / Iron Man",
          "poster": "https://image.tmdb.org/t/p/w342/poster.jpg",
          "backdrop": "https://image.tmdb.org/t/p/w780/backdrop.jpg",
          "rating": 8.3,
          "year": "2019",
          "details_link": "/api/details/movie/299534"
        }
      ],
      "shows": [
        {
          "id": 1668,
          "title": "Ally McBeal",
          "character": "Larry Paul",
          "poster": "https://image.tmdb.org/t/p/w342/poster.jpg",
          "backdrop": "https://image.tmdb.org/t/p/w780/backdrop.jpg",
          "rating": 6.5,
          "year": "2000",
          "details_link": "/api/details/tv/1668"
        }
      ]
    },
    "view_path": "/api/cast/3223",
    "meta": {
      "timestamp": "2025-02-04T12:00:00.000Z",
      "total_movies": 75,
      "total_shows": 15
    }
  }
}
```

---

### 5. Streaming Sources

Get available streaming sources for movies or TV episodes.

**Movie Endpoint:** `GET /api/player/movie/:id`

**TV Endpoint:** `GET /api/player/tv/:id?s={season}&e={episode}`

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | number | Yes | TMDB media ID |
| s | number | TV only | Season number |
| e | number | TV only | Episode number |

**Movie Example:**
```bash
GET https://vyla-api.vercel.app/api/player/movie/299534
```

**TV Example:**
```bash
GET https://vyla-api.vercel.app/api/player/tv/1668?s=1&e=1
```

**Response:**
```json
{
  "success": true,
  "meta": {
    "content_id": 299534,
    "type": "movie",
    "season": null,
    "episode": null,
    "back_path": "/api/details/movie/299534",
    "timestamp": "2025-02-04T12:00:00.000Z"
  },
  "sources": [
    {
      "id": "pstream",
      "name": "P-Stream",
      "stream_url": "https://iframe.pstream.mov/media/tmdb-movie-299534",
      "isFrench": false,
      "needsSandbox": true,
      "startTimeParam": "t",
      "timeFormat": "hms",
      "supportsEvents": true,
      "eventOrigin": "https://iframe.pstream.mov"
    },
    {
      "id": "vidlink",
      "name": "VidLink",
      "stream_url": "https://vidlink.pro/movie/299534",
      "isFrench": false,
      "needsSandbox": false,
      "startTimeParam": "startAt",
      "timeFormat": "seconds",
      "supportsEvents": true,
      "eventOrigin": "https://vidlink.pro"
    }
  ],
  "instructions": {
    "usage": "Embed stream_url in an iframe for playback",
    "note": "Some sources may require additional configuration or may be region-restricted"
  }
}
```

**TV Response (Season/Episode):**
```json
{
  "meta": {
    "content_id": 1668,
    "type": "tv",
    "season": 1,
    "episode": 1,
    "episode_identifier": "S01E01",
    "back_path": "/api/details/tv/1668"
  },
  "sources": [
    {
      "id": "pstream",
      "stream_url": "https://iframe.pstream.mov/media/tmdb-tv-1668/1/1"
    }
  ]
}
```

**Source Properties:**
- `isFrench`: Language indicator
- `needsSandbox`: If true, use `sandbox` attribute on iframe
- `startTimeParam`: Parameter name for resume time
- `timeFormat`: 'seconds' or 'hms' (hours:minutes:seconds)
- `supportsEvents`: Can send/receive postMessage events
- `eventOrigin`: Origin for postMessage communication

**Iframe Example:**
```html
<iframe 
  src="https://iframe.pstream.mov/media/tmdb-movie-299534"
  sandbox="allow-scripts allow-same-origin"
  allowfullscreen
></iframe>
```

---

### 6. Custom Lists

Fetch custom lists from any TMDB endpoint.

**Endpoint:** `GET /api/list`

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| endpoint | string | Yes | TMDB API endpoint path |
| params | JSON | No | Additional parameters (URL-encoded) |
| page | number | No | Page number (default: 1) |

**Examples:**

**Top Rated Movies:**
```bash
GET https://vyla-api.vercel.app/api/list?endpoint=/movie/top_rated
```

**Popular TV Shows:**
```bash
GET https://vyla-api.vercel.app/api/list?endpoint=/tv/popular&page=2
```

**Movies by Genre:**
```bash
GET https://vyla-api.vercel.app/api/list?endpoint=/discover/movie&params={"with_genres":28}
```

**Response:**
```json
{
  "success": true,
  "meta": {
    "endpoint": "/movie/top_rated",
    "pagination": {
      "page": 1,
      "total_pages": 100,
      "total_results": 2000,
      "has_next": true,
      "has_prev": false,
      "next_page": 2,
      "prev_page": null
    },
    "timestamp": "2025-02-04T12:00:00.000Z"
  },
  "results": [
    {
      "id": 278,
      "type": "movie",
      "title": "The Shawshank Redemption",
      "overview": "Imprisoned in the 1940s...",
      "poster_path": "/poster.jpg",
      "poster": "https://image.tmdb.org/t/p/w342/poster.jpg",
      "backdrop": "https://image.tmdb.org/t/p/w780/backdrop.jpg",
      "rating": 8.7,
      "popularity": 95.2,
      "release_date": "1994-09-23",
      "year": "1994",
      "genre_ids": [18, 80],
      "details_link": "/api/details/movie/278"
    }
  ]
}
```

---

### 7. Image Proxy

Proxy TMDB images with caching.

**Endpoint:** `GET /api/image/:size/:file`

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| size | string | Yes | Image size |
| file | string | Yes | Image filename from TMDB |

**Available Sizes:**

**Posters:** `w92`, `w154`, `w185`, `w342`, `w500`, `w780`, `original`

**Backdrops:** `w300`, `w780`, `w1280`, `original`

**Profiles:** `w45`, `w185`, `h632`, `original`

**Example:**
```bash
GET https://vyla-api.vercel.app/api/image/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg
```

**Features:**
- Automatic caching (1 year)
- Fallback to transparent pixel on error
- Streaming response

**Usage in HTML:**
```html
<img src="https://vyla-api.vercel.app/api/image/w500/poster.jpg" alt="Movie Poster">
```

---

### 8. Health & Status

Monitor API health and metrics.

**Health Check:** `GET /api/health`

**Response:**
```json
{
  "success": true,
  "status": "ok",
  "timestamp": "2025-02-04T12:00:00.000Z",
  "uptime": {
    "seconds": 86400,
    "formatted": "1d 0h 0m 0s"
  },
  "memory": {
    "heapUsed": "52 MB",
    "heapTotal": "100 MB",
    "rss": "120 MB"
  },
  "environment": "production"
}
```

**Status Endpoint:** `GET /api/status`

**Response:**
```json
{
  "success": true,
  "status": "operational",
  "environment": "production",
  "uptime": {
    "seconds": 86400,
    "formatted": "1d 0h 0m 0s"
  },
  "memory": {
    "heapUsed": "52 MB",
    "heapTotal": "100 MB",
    "rss": "120 MB",
    "external": "5 MB"
  },
  "requests": {
    "total": 15234,
    "errors": 45,
    "successRate": "99%",
    "lastRequest": "2025-02-04T12:00:00.000Z"
  },
  "timestamp": "2025-02-04T12:00:00.000Z"
}
```

---

## Error Handling

All errors follow a consistent format:

```json
{
  "success": false,
  "error": "Error message description",
  "request": {
    "type": "movie",
    "id": 12345,
    "timestamp": "2025-02-04T12:00:00.000Z"
  }
}
```

**Common Error Codes:**

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid parameters |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error |

**Error Handling Example:**
```javascript
async function fetchMovie(id) {
  try {
    const response = await fetch(`https://vyla-api.vercel.app/api/details/movie/${id}`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error);
    }
    
    return data;
  } catch (error) {
    console.error('Failed to fetch movie:', error);
    throw error;
  }
}
```

---

## Complete Integration Examples

### React Application

```jsx
import { useState, useEffect } from 'react';

const API_BASE = 'https://vyla-api.vercel.app/api';

function App() {
  const [sections, setSections] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/home`)
      .then(res => res.json())
      .then(data => setSections(data.data));
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    const response = await fetch(`${API_BASE}/search?q=${searchQuery}`);
    const data = await response.json();
    setSearchResults(data.results);
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
        />
        <button type="submit">Search</button>
      </form>

      {searchResults.length > 0 ? (
        <div>
          {searchResults.map(item => (
            <div key={item.id}>
              <img src={item.poster} alt={item.title} />
              <h3>{item.title}</h3>
            </div>
          ))}
        </div>
      ) : (
        sections.map(section => (
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
        ))
      )}
    </div>
  );
}
```

### Vue 3 Application

```vue
<template>
  <div>
    <form @submit.prevent="handleSearch">
      <input v-model="searchQuery" placeholder="Search..." />
      <button type="submit">Search</button>
    </form>

    <div v-if="searchResults.length">
      <div v-for="item in searchResults" :key="item.id">
        <img :src="item.poster" :alt="item.title" />
        <h3>{{ item.title }}</h3>
      </div>
    </div>

    <section v-for="section in sections" :key="section.title">
      <h2>{{ section.title }}</h2>
      <div>
        <div v-for="item in section.items" :key="item.id">
          <img :src="item.poster" :alt="item.title" />
          <h3>{{ item.title }}</h3>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const API_BASE = 'https://vyla-api.vercel.app/api';
const sections = ref([]);
const searchQuery = ref('');
const searchResults = ref([]);

onMounted(async () => {
  const response = await fetch(`${API_BASE}/home`);
  const data = await response.json();
  sections.value = data.data;
});

const handleSearch = async () => {
  const response = await fetch(`${API_BASE}/search?q=${searchQuery.value}`);
  const data = await response.json();
  searchResults.value = data.results;
};
</script>
```

---

## Mobile Integration

### React Native

```jsx
import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList } from 'react-native';

const API_BASE = 'https://vyla-api.vercel.app/api';

export default function HomeScreen() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/home`)
      .then(res => res.json())
      .then(data => setMovies(data.data[0].items));
  }, []);

  return (
    <FlatList
      data={movies}
      renderItem={({ item }) => (
        <View>
          <Image source={{ uri: item.poster }} />
          <Text>{item.title}</Text>
        </View>
      )}
      keyExtractor={item => item.id.toString()}
    />
  );
}
```

---

## Security & Best Practices

1. **Always use HTTPS in production**
2. **Implement client-side caching**
3. **Handle errors gracefully**
4. **Respect rate limits**
5. **Use environment variables for API URLs**
6. **Implement loading states**
7. **Add retry logic for failed requests**

---

## Rate Limits

- **Fair usage policy**: No hard limits for public API
- **Recommended**: Cache responses when possible
- **Image proxy**: Cached for 1 year automatically

---

## CORS

CORS is enabled for all origins. Your frontend can make requests from any domain.

---

## Tips for Frontend Developers

1. **Cache API responses** to reduce server load
2. **Use image proxy** for TMDB images to avoid CORS issues
3. **Implement pagination** for large lists
4. **Show loading states** during API calls
5. **Handle errors** gracefully with fallback UI
6. **Use TypeScript** for better type safety
7. **Implement offline support** with service workers

---

## Common Use Cases

### Build a Movie Player

```javascript
async function playMovie(movieId) {
  const response = await fetch(`${API_BASE}/player/movie/${movieId}`);
  const data = await response.json();
  
  const iframe = document.createElement('iframe');
  iframe.src = data.sources[0].stream_url;
  iframe.allowFullscreen = true;
  
  if (data.sources[0].needsSandbox) {
    iframe.sandbox = 'allow-scripts allow-same-origin';
  }
  
  document.body.appendChild(iframe);
}
```

### Build a Search Feature

```javascript
const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

const searchMovies = debounce(async (query) => {
  if (query.length < 2) return;
  
  const response = await fetch(`${API_BASE}/search?q=${query}`);
  const data = await response.json();
  
  displayResults(data.results);
}, 300);
```

### Build an Actor Profile Page

```javascript
async function loadActorProfile(actorId) {
  const response = await fetch(`${API_BASE}/cast/${actorId}`);
  const data = await response.json();
  const actor = data.data;
  
  return {
    name: actor.name,
    bio: actor.biography,
    photo: actor.profile,
    movies: actor.known_for.movies,
    shows: actor.known_for.shows
  };
}
```

---

## Support

- **API Status**: https://vyla-api.vercel.app/api/status
- **GitHub Issues**: Report bugs and request features
- **Documentation**: This file and README.md

---

**Happy Building!**
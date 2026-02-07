# Vyla API - Complete Developer Documentation

## Base URL

**Production:** `https://vyla-api.vercel.app/api`

**Local Development:** `http://localhost:3000/api`


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

  async getMovieGenres() {
    return this.fetch('/genres/movie');
  }

  async getTVGenres() {
    return this.fetch('/genres/tv');
  }

  async getByGenre(type: 'movie' | 'tv', genreId: number, page: number = 1) {
    return this.fetch(`/genres/${type}/${genreId}?page=${page}`);
  }

  async getSeasonDetails(tvId: number, seasonNumber: number) {
    return this.fetch(`/tv/${tvId}/season/${seasonNumber}`);
  }

  async getEpisodeDetails(tvId: number, seasonNumber: number, episodeNumber: number) {
    return this.fetch(`/episodes/${tvId}/${seasonNumber}/${episodeNumber}`);
  }

  async getList(endpoint: string, params?: object, page: number = 1) {
    const queryParams = new URLSearchParams({
      endpoint,
      ...(params && { params: JSON.stringify(params) }),
      page: page.toString()
    });
    return this.fetch(`/list?${queryParams}`);
  }
}

export const vyla = new VylaClient();
```

---

## API Endpoints Reference

### 1. Home Content

Get curated home page sections with trending, top-rated, and genre-based content. All items now include title/logo images.

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
      "item_count": 10,
      "items": [
        {
          "id": 299534,
          "title": "Avengers: Endgame",
          "title_image": "https://image.tmdb.org/t/p/w500/logo.png",
          "overview": "After the devastating events of Avengers: Infinity War...",
          "poster": "https://image.tmdb.org/t/p/w342/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
          "backdrop": "https://image.tmdb.org/t/p/w780/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
          "media_type": "movie",
          "vote_average": 8.3,
          "release_date": "2019-04-24",
          "year": "2019",
          "genre_ids": [12, 28, 878],
          "popularity": 120.5,
          "adult": false,
          "original_language": "en",
          "view_path": "/api/details/movie/299534",
          "details_link": "/api/details/movie/299534"
        }
      ]
    }
  ],
  "meta": {
    "timestamp": "2025-02-07T12:00:00.000Z",
    "version": "1.1.0",
    "api_version": "v1",
    "title": "Vyla - Home",
    "description": "Discover trending movies and TV shows",
    "canonical": "/",
    "type": "website",
    "image": "https://image.tmdb.org/t/p/original/backdrop.jpg"
  },
  "stats": {
    "total_sections": 12,
    "total_items": 240,
    "load_time_ms": 2500
  }
}
```

**Sections Included:**
- Trending Now (carousel) - 10 items
- Trending Movies (row) - 20 items
- Top Rated Movies (row) - 20 items
- Top Rated TV Shows (row) - 20 items
- Netflix Originals (row) - 20 items
- Action Movies (row) - 20 items
- Comedy Movies (row) - 20 items
- Horror Movies (row) - 20 items
- Romance Movies (row) - 20 items
- Documentaries (row) - 18 items
- Animation (row) - 20 items
- Science Fiction (row) - 20 items

**Example Usage:**
```javascript
const response = await fetch('https://vyla-api.vercel.app/api/home');
const data = await response.json();

const trendingSection = data.data.find(section => section.title === 'Trending Now');
trendingSection.items.forEach(item => {
  console.log(item.title_image);
  console.log(item.poster);
  console.log(item.backdrop);
});
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
    "timestamp": "2025-02-07T12:00:00.000Z"
  },
  "results": [
    {
      "id": 299534,
      "type": "movie",
      "title": "Avengers: Endgame",
      "title_image": "https://image.tmdb.org/t/p/w500/logo.png",
      "overview": "After the devastating events...",
      "poster": "https://image.tmdb.org/t/p/w342/poster.jpg",
      "backdrop": "https://image.tmdb.org/t/p/w780/backdrop.jpg",
      "rating": 8.3,
      "popularity": 120.5,
      "release_date": "2019-04-24",
      "year": "2019",
      "genre_ids": [12, 28, 878],
      "adult": false,
      "original_language": "en",
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
  const data = await response.json();
  
  data.results.forEach(item => {
    if (item.title_image) {
      console.log(`${item.title} has logo:`, item.title_image);
    }
  });
  
  return data;
}
```

---

### 3. Media Details

Get comprehensive details for a movie or TV show including enhanced image and video collections.

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
      "total_results": 1,
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
    "description": "After the devastating events of Avengers: Infinity War...",
    "image": "https://image.tmdb.org/t/p/original/backdrop.jpg",
    "timestamp": "2025-02-07T12:00:00.000Z",
    "images": {
      "backdrops_count": 10,
      "posters_count": 10,
      "logos_count": 5
    }
  },
  "info": {
    "id": 299534,
    "type": "movie",
    "title": "Avengers: Endgame",
    "title_image": "https://image.tmdb.org/t/p/w500/logo.png",
    "tagline": "Part of the journey is the end.",
    "overview": "After the devastating events of Avengers: Infinity War...",
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
    "videos": [
      {
        "id": "5d1f9f9b9251413e8b00001f",
        "key": "TcMBFSGVi1c",
        "name": "Official Trailer",
        "site": "YouTube",
        "type": "Trailer",
        "official": true,
        "published_at": "2019-03-14T13:00:00.000Z",
        "url": "https://www.youtube.com/watch?v=TcMBFSGVi1c",
        "embed_url": "https://www.youtube.com/embed/TcMBFSGVi1c"
      }
    ],
    "homepage": "https://www.marvel.com/movies/avengers-endgame",
    "status": "Released",
    "original_language": "en",
    "original_title": "Avengers: Endgame",
    "adult": false,
    "budget": 356000000,
    "revenue": 2797800564,
    "production_companies": [
      {
        "id": 420,
        "name": "Marvel Studios",
        "logo": "https://image.tmdb.org/t/p/w500/logo.png",
        "origin_country": "US"
      }
    ],
    "production_countries": [
      { "iso_3166_1": "US", "name": "United States of America" }
    ],
    "spoken_languages": [
      { "iso_639_1": "en", "name": "English" }
    ]
  },
  "cast": [
    {
      "id": 3223,
      "name": "Robert Downey Jr.",
      "character": "Tony Stark / Iron Man",
      "profile": "https://image.tmdb.org/t/p/w185/profile.jpg",
      "view_cast_link": "/api/cast/3223",
      "order": 0,
      "known_for_department": "Acting"
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
    "writers": [
      {
        "id": 5678,
        "name": "Christopher Markus",
        "job": "Screenplay",
        "profile": "https://image.tmdb.org/t/p/w185/profile.jpg",
        "view_cast_link": "/api/cast/5678"
      }
    ]
  },
  "related": [
    {
      "id": 299536,
      "type": "movie",
      "title": "Avengers: Infinity War",
      "title_image": "https://image.tmdb.org/t/p/w500/logo.png",
      "overview": "As the Avengers and their allies...",
      "poster": "https://image.tmdb.org/t/p/w342/poster.jpg",
      "backdrop": "https://image.tmdb.org/t/p/w780/backdrop.jpg",
      "year": "2018",
      "rating": 8.3,
      "details_link": "/api/details/movie/299536"
    }
  ],
  "images": {
    "backdrops": [
      {
        "file_path": "/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
        "url": "https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
        "width": 3840,
        "height": 2160,
        "vote_average": 5.384
      }
    ],
    "posters": [
      {
        "file_path": "/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
        "url": "https://image.tmdb.org/t/p/w780/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
        "width": 2000,
        "height": 3000,
        "vote_average": 5.318
      }
    ],
    "logos": [
      {
        "file_path": "/tKHg8K3HMJiEHyDd3L8BDp7VPUY.png",
        "url": "https://image.tmdb.org/t/p/w500/tKHg8K3HMJiEHyDd3L8BDp7VPUY.png",
        "width": 2000,
        "height": 878
      }
    ]
  },
  "player_link": "/api/player/movie/299534"
}
```

**Response (TV Show - Additional Fields):**
```json
{
  "success": true,
  "view_path": "/api/details/tv/1668",
  "info": {
    "id": 1668,
    "type": "tv",
    "title": "Friends",
    "title_image": "https://image.tmdb.org/t/p/w500/logo.png",
    "number_of_seasons": 10,
    "number_of_episodes": 236,
    "in_production": false,
    "type": "Scripted",
    "last_air_date": "2004-05-06",
    "next_episode_to_air": null,
    "networks": [
      {
        "id": 6,
        "name": "NBC",
        "logo": "https://image.tmdb.org/t/p/w500/network_logo.png",
        "origin_country": "US"
      }
    ],
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
      "poster": "https://image.tmdb.org/t/p/w780/season_poster.jpg",
      "overview": "Rachel Green, Ross Geller, Monica Geller...",
      "vote_average": 8.2,
      "season_link": "/api/tv/1668/season/1"
    }
  ],
  "player_link": null
}
```

---

### 4. Genre Browsing

#### 4.1 Get Genre List

Get all available genres for movies or TV shows.

**Endpoint:** `GET /api/genres/:type`

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| type | string | Yes | Media type: 'movie' or 'tv' |

**Example Request:**
```bash
GET https://vyla-api.vercel.app/api/genres/movie
```

**Response:**
```json
{
  "success": true,
  "type": "movie",
  "genres": [
    { "id": 28, "name": "Action" },
    { "id": 12, "name": "Adventure" },
    { "id": 16, "name": "Animation" },
    { "id": 35, "name": "Comedy" },
    { "id": 80, "name": "Crime" },
    { "id": 99, "name": "Documentary" },
    { "id": 18, "name": "Drama" },
    { "id": 10751, "name": "Family" },
    { "id": 14, "name": "Fantasy" },
    { "id": 36, "name": "History" },
    { "id": 27, "name": "Horror" },
    { "id": 10402, "name": "Music" },
    { "id": 9648, "name": "Mystery" },
    { "id": 10749, "name": "Romance" },
    { "id": 878, "name": "Science Fiction" },
    { "id": 10770, "name": "TV Movie" },
    { "id": 53, "name": "Thriller" },
    { "id": 10752, "name": "War" },
    { "id": 37, "name": "Western" }
  ],
  "meta": {
    "timestamp": "2025-02-07T12:00:00.000Z",
    "total_genres": 19
  }
}
```

**TV Genres:**
```json
{
  "success": true,
  "type": "tv",
  "genres": [
    { "id": 10759, "name": "Action & Adventure" },
    { "id": 16, "name": "Animation" },
    { "id": 35, "name": "Comedy" },
    { "id": 80, "name": "Crime" },
    { "id": 99, "name": "Documentary" },
    { "id": 18, "name": "Drama" },
    { "id": 10751, "name": "Family" },
    { "id": 10762, "name": "Kids" },
    { "id": 9648, "name": "Mystery" },
    { "id": 10763, "name": "News" },
    { "id": 10764, "name": "Reality" },
    { "id": 10765, "name": "Sci-Fi & Fantasy" },
    { "id": 10766, "name": "Soap" },
    { "id": 10767, "name": "Talk" },
    { "id": 10768, "name": "War & Politics" },
    { "id": 37, "name": "Western" }
  ],
  "meta": {
    "timestamp": "2025-02-07T12:00:00.000Z",
    "total_genres": 16
  }
}
```

#### 4.2 Browse by Genre

Get content filtered by genre with pagination and sorting.

**Endpoint:** `GET /api/genres/:type/:genreId`

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| type | string | Yes | Media type: 'movie' or 'tv' |
| genreId | number | Yes | Genre ID from genre list |
| page | number | No | Page number (default: 1) |
| sort_by | string | No | Sort order (default: 'popularity.desc') |

**Sort Options:**
- `popularity.desc` / `popularity.asc`
- `vote_average.desc` / `vote_average.asc`
- `release_date.desc` / `release_date.asc`
- `title.asc` / `title.desc`

**Example Request:**
```bash
GET https://vyla-api.vercel.app/api/genres/movie/28?page=1&sort_by=popularity.desc
```

**Response:**
```json
{
  "success": true,
  "meta": {
    "type": "movie",
    "genre_id": 28,
    "page": 1,
    "total_pages": 500,
    "total_results": 10000,
    "has_next": true,
    "has_prev": false,
    "sort_by": "popularity.desc",
    "timestamp": "2025-02-07T12:00:00.000Z"
  },
  "results": [
    {
      "id": 299534,
      "type": "movie",
      "title": "Avengers: Endgame",
      "title_image": "https://image.tmdb.org/t/p/w500/logo.png",
      "overview": "After the devastating events...",
      "poster": "https://image.tmdb.org/t/p/w342/poster.jpg",
      "backdrop": "https://image.tmdb.org/t/p/w780/backdrop.jpg",
      "rating": 8.3,
      "popularity": 120.5,
      "release_date": "2019-04-24",
      "year": "2019",
      "genre_ids": [12, 28, 878],
      "adult": false,
      "details_link": "/api/details/movie/299534"
    }
  ]
}
```

**Example Usage:**
```javascript
async function getTopActionMovies() {
  const response = await fetch(
    'https://vyla-api.vercel.app/api/genres/movie/28?sort_by=vote_average.desc&page=1'
  );
  return response.json();
}

async function getComedyShows() {
  const response = await fetch(
    'https://vyla-api.vercel.app/api/genres/tv/35?page=1'
  );
  return response.json();
}
```

---

### 5. Season Details

Get comprehensive details for a TV show season including all episodes.

**Endpoint:** `GET /api/tv/:tvId/season/:seasonNumber`

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| tvId | number | Yes | TMDB TV show ID |
| seasonNumber | number | Yes | Season number (0 for specials) |

**Example Request:**
```bash
GET https://vyla-api.vercel.app/api/tv/1399/season/1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 3624,
    "season_number": 1,
    "name": "Season 1",
    "overview": "Trouble is brewing in the Seven Kingdoms of Westeros...",
    "air_date": "2011-04-17",
    "poster": "https://image.tmdb.org/t/p/w780/season_poster.jpg",
    "episode_count": 10,
    "episodes": [
      {
        "id": 63056,
        "episode_number": 1,
        "name": "Winter Is Coming",
        "overview": "Jon Arryn, the Hand of the King, is dead...",
        "air_date": "2011-04-17",
        "runtime": 62,
        "still": "https://image.tmdb.org/t/p/w300/episode_still.jpg",
        "rating": 8.1,
        "vote_count": 756,
        "episode_link": "/api/episodes/1399/1/1",
        "player_link": "/api/player/tv/1399?s=1&e=1"
      }
    ],
    "tv_show": {
      "id": 1399,
      "name": "Game of Thrones",
      "poster": "https://image.tmdb.org/t/p/w780/show_poster.jpg",
      "details_link": "/api/details/tv/1399"
    }
  },
  "meta": {
    "tv_id": 1399,
    "season_number": 1,
    "timestamp": "2025-02-07T12:00:00.000Z"
  }
}
```

**Example Usage:**
```javascript
async function loadSeason(tvId, seasonNumber) {
  const response = await fetch(
    `https://vyla-api.vercel.app/api/tv/${tvId}/season/${seasonNumber}`
  );
  const data = await response.json();
  
  data.data.episodes.forEach(episode => {
    console.log(`S${seasonNumber}E${episode.episode_number}: ${episode.name}`);
    console.log(`Watch: ${episode.player_link}`);
  });
  
  return data;
}
```

---

### 6. Episode Details

Get detailed information about a specific TV episode including crew and guest stars.

**Endpoint:** `GET /api/episodes/:tvId/:seasonNumber/:episodeNumber`

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| tvId | number | Yes | TMDB TV show ID |
| seasonNumber | number | Yes | Season number |
| episodeNumber | number | Yes | Episode number |

**Example Request:**
```bash
GET https://vyla-api.vercel.app/api/episodes/1399/1/1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 63056,
    "episode_number": 1,
    "season_number": 1,
    "name": "Winter Is Coming",
    "overview": "Jon Arryn, the Hand of the King, is dead. King Robert Baratheon plans to ask his oldest friend, Eddard Stark, to take Jon's place. Across the sea, Viserys Targaryen plans to wed his sister to a nomadic warlord in exchange for an army.",
    "air_date": "2011-04-17",
    "runtime": 62,
    "still": "https://image.tmdb.org/t/p/original/episode_still.jpg",
    "rating": 8.1,
    "vote_count": 756,
    "crew": {
      "directors": [
        {
          "id": 44797,
          "name": "Timothy Van Patten",
          "profile": "https://image.tmdb.org/t/p/w185/profile.jpg"
        }
      ],
      "writers": [
        {
          "id": 9813,
          "name": "David Benioff",
          "job": "Writer",
          "profile": "https://image.tmdb.org/t/p/w185/profile.jpg"
        },
        {
          "id": 228068,
          "name": "D. B. Weiss",
          "job": "Writer",
          "profile": "https://image.tmdb.org/t/p/w185/profile.jpg"
        }
      ]
    },
    "guest_stars": [
      {
        "id": 117642,
        "name": "Jason Momoa",
        "character": "Khal Drogo",
        "profile": "https://image.tmdb.org/t/p/w185/profile.jpg",
        "view_cast_link": "/api/cast/117642"
      }
    ],
    "production_code": "101"
  },
  "meta": {
    "tv_id": 1399,
    "season_number": 1,
    "episode_number": 1,
    "episode_identifier": "S01E01",
    "player_link": "/api/player/tv/1399?s=1&e=1",
    "timestamp": "2025-02-07T12:00:00.000Z"
  }
}
```

**Example Usage:**
```javascript
async function loadEpisode(tvId, season, episode) {
  const response = await fetch(
    `https://vyla-api.vercel.app/api/episodes/${tvId}/${season}/${episode}`
  );
  const data = await response.json();
  
  console.log(`${data.meta.episode_identifier}: ${data.data.name}`);
  console.log(`Directed by: ${data.data.crew.directors[0]?.name}`);
  console.log(`Guest Stars:`, data.data.guest_stars.map(s => s.name).join(', '));
  console.log(`Watch at: ${data.meta.player_link}`);
  
  return data;
}
```

---

### 7. Cast/Actor Details

Get detailed information about an actor/actress.

**Endpoint:** `GET /api/cast/:id`

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | number | Yes | TMDB person ID |

**Example Request:**
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
    "popularity": 65.432,
    "known_for_department": "Acting",
    "also_known_as": [
      "Robert Downey",
      "RDJ"
    ],
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
      "shows": []
    },
    "view_path": "/api/cast/3223",
    "meta": {
      "timestamp": "2025-02-07T12:00:00.000Z",
      "total_movies": 89,
      "total_shows": 12
    }
  }
}
```

---

### 8. Player Sources

Get streaming embed sources for movies or TV episodes.

**Endpoint:** `GET /api/player/:type/:id`

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| type | string | Yes | Media type: 'movie' or 'tv' |
| id | number | Yes | TMDB media ID |
| s | number | Conditional | Season number (required for TV) |
| e | number | Conditional | Episode number (required for TV) |

**Movie Example:**
```bash
GET https://vyla-api.vercel.app/api/player/movie/299534
```

**TV Example:**
```bash
GET https://vyla-api.vercel.app/api/player/tv/1399?s=1&e=1
```

**Response:**
```json
{
  "success": true,
  "meta": {
    "content_id": 299534,
    "type": "movie",
    "back_path": "/api/details/movie/299534",
    "timestamp": "2025-02-07T12:00:00.000Z"
  },
  "sources": [
    {
      "id": "pstream",
      "name": "P-Stream",
      "stream_url": "https://iframe.pstream.mov/media/tmdb-movie-299534",
      "isFrench": false,
      "needsSandbox": true,
      "startTimeParam": null,
      "timeFormat": null,
      "supportsEvents": true,
      "eventOrigin": null
    },
    {
      "id": "vidsrc",
      "name": "VidSrc",
      "stream_url": "https://vidsrc.xyz/embed/movie/299534",
      "isFrench": false,
      "needsSandbox": false,
      "startTimeParam": null,
      "timeFormat": null,
      "supportsEvents": false,
      "eventOrigin": null
    }
  ],
  "instructions": {
    "usage": "Embed stream_url in an iframe for playback",
    "note": "Some sources may require additional configuration or may be region-restricted"
  }
}
```

**TV Response (with season/episode):**
```json
{
  "success": true,
  "meta": {
    "content_id": 1399,
    "type": "tv",
    "season": 1,
    "episode": 1,
    "episode_identifier": "S01E01",
    "back_path": "/api/details/tv/1399",
    "timestamp": "2025-02-07T12:00:00.000Z"
  },
  "sources": [
    {
      "id": "pstream",
      "name": "P-Stream",
      "stream_url": "https://iframe.pstream.mov/media/tmdb-tv-1399-1-1",
      "isFrench": false,
      "needsSandbox": true,
      "supportsEvents": true
    }
  ]
}
```

**Available Sources (34 total):**
- P-Stream
- VidSrc
- VidLink
- MultiEmbed
- VidEasy (4K)
- VidFast (4K)
- 2Embed
- SmashyStream
- AutoEmbed
- And 25+ more sources

**Example Usage:**
```javascript
async function playMovie(movieId) {
  const response = await fetch(`https://vyla-api.vercel.app/api/player/movie/${movieId}`);
  const data = await response.json();
  
  const iframe = document.createElement('iframe');
  iframe.src = data.sources[0].stream_url;
  iframe.allowFullscreen = true;
  iframe.width = '100%';
  iframe.height = '100%';
  
  if (data.sources[0].needsSandbox) {
    iframe.sandbox = 'allow-scripts allow-same-origin';
  }
  
  document.getElementById('player').appendChild(iframe);
}

async function playTVEpisode(tvId, season, episode) {
  const response = await fetch(
    `https://vyla-api.vercel.app/api/player/tv/${tvId}?s=${season}&e=${episode}`
  );
  const data = await response.json();
}
```

---

### 9. Custom Lists

Fetch custom TMDB endpoint data with pagination.

**Endpoint:** `GET /api/list`

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| endpoint | string | Yes | TMDB API endpoint path (must start with /) |
| params | JSON | No | Additional query parameters |
| page | number | No | Page number (default: 1) |

**Example Requests:**
```bash
# Top rated movies
GET https://vyla-api.vercel.app/api/list?endpoint=/movie/top_rated&page=1

# Popular TV shows
GET https://vyla-api.vercel.app/api/list?endpoint=/tv/popular&page=1

# Upcoming movies
GET https://vyla-api.vercel.app/api/list?endpoint=/movie/upcoming
```

**Response:**
```json
{
  "success": true,
  "meta": {
    "endpoint": "/movie/top_rated",
    "pagination": {
      "page": 1,
      "total_pages": 500,
      "total_results": 10000,
      "has_next": true,
      "has_prev": false,
      "next_page": 2,
      "prev_page": null
    },
    "timestamp": "2025-02-07T12:00:00.000Z"
  },
  "results": [
    {
      "id": 278,
      "type": "movie",
      "title": "The Shawshank Redemption",
      "overview": "Framed in the 1940s for the double murder...",
      "poster": "https://image.tmdb.org/t/p/w342/poster.jpg",
      "backdrop": "https://image.tmdb.org/t/p/w780/backdrop.jpg",
      "rating": 8.7,
      "popularity": 98.5,
      "release_date": "1994-09-23",
      "year": "1994",
      "genre_ids": [18, 80],
      "adult": false,
      "original_language": "en",
      "details_link": "/api/details/movie/278"
    }
  ]
}
```

---

### 10. Image Proxy

Proxy TMDB images with automatic caching and fallback.

**Endpoint:** `GET /api/image/:size/:file`

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| size | string | Yes | Image size (see sizes below) |
| file | string | Yes | TMDB image filename |

**Available Sizes:**
- `w92` - Thumbnail (92px width)
- `w154` - Small (154px width)
- `w185` - Small-Medium (185px width)
- `w342` - Medium (342px width)
- `w500` - Medium-Large (500px width)
- `w780` - Large (780px width)
- `h632` - Profile height (632px height)
- `original` - Original size

**Example Request:**
```bash
GET https://vyla-api.vercel.app/api/image/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg
```

**Response:**
- Returns the actual image file
- Cached for 1 year (`Cache-Control: public, max-age=31536000, immutable`)
- Returns 1x1 transparent PNG fallback on error

**Example Usage:**
```html
<!-- Direct use in HTML -->
<img src="https://vyla-api.vercel.app/api/image/w342/poster.jpg" alt="Movie Poster" />

<!-- Responsive images -->
<img 
  srcset="
    https://vyla-api.vercel.app/api/image/w342/poster.jpg 342w,
    https://vyla-api.vercel.app/api/image/w500/poster.jpg 500w,
    https://vyla-api.vercel.app/api/image/w780/poster.jpg 780w
  "
  sizes="(max-width: 600px) 342px, (max-width: 900px) 500px, 780px"
  src="https://vyla-api.vercel.app/api/image/w500/poster.jpg"
  alt="Movie Poster"
/>
```

---

### 11. Health Check

Check API health and status.

**Endpoint:** `GET /api/health`

**No Parameters Required**

**Response:**
```json
{
  "success": true,
  "status": "ok",
  "timestamp": "2025-02-07T12:00:00.000Z",
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
    "timestamp": "2025-02-07T12:00:00.000Z"
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

### React Application with Title Images

```jsx
import { useState, useEffect } from 'react';

const API_BASE = 'https://vyla-api.vercel.app/api';

function MovieCard({ item }) {
  return (
    <div className="movie-card" style={{ backgroundImage: `url(${item.backdrop})` }}>
      {item.title_image && (
        <img src={item.title_image} alt={item.title} className="title-logo" />
      )}
      <img src={item.poster} alt={item.title} className="poster" />
      <div className="info">
        <h3>{item.title}</h3>
        <p>⭐ {item.vote_average}</p>
      </div>
    </div>
  );
}

function App() {
  const [sections, setSections] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [genreContent, setGenreContent] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/home`)
      .then(res => res.json())
      .then(data => setSections(data.data));
    
    fetch(`${API_BASE}/genres/movie`)
      .then(res => res.json())
      .then(data => setGenres(data.genres));
  }, []);

  const handleGenreClick = async (genreId) => {
    setSelectedGenre(genreId);
    const response = await fetch(`${API_BASE}/genres/movie/${genreId}`);
    const data = await response.json();
    setGenreContent(data.results);
  };

  return (
    <div>
      {/* Genre Filter */}
      <div className="genres">
        {genres.map(genre => (
          <button 
            key={genre.id}
            onClick={() => handleGenreClick(genre.id)}
            className={selectedGenre === genre.id ? 'active' : ''}
          >
            {genre.name}
          </button>
        ))}
      </div>

      {/* Genre Content */}
      {selectedGenre && (
        <section>
          <h2>Genre Results</h2>
          <div className="grid">
            {genreContent.map(item => (
              <MovieCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Home Sections */}
      {!selectedGenre && sections.map(section => (
        <section key={section.title}>
          <h2>{section.title}</h2>
          <div className={section.layout_type === 'carousel' ? 'carousel' : 'grid'}>
            {section.items.map(item => (
              <MovieCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
```

### Vue 3 Application with Episodes

```vue
<template>
  <div>
    <!-- TV Show Details -->
    <div v-if="show" class="show-details">
      <img v-if="show.info.title_image" :src="show.info.title_image" class="title-logo" />
      <h1>{{ show.info.title }}</h1>
      
      <!-- Seasons -->
      <div class="seasons">
        <button 
          v-for="season in show.seasons" 
          :key="season.number"
          @click="loadSeason(season.number)"
        >
          {{ season.name }}
        </button>
      </div>
    </div>

    <!-- Episodes Grid -->
    <div v-if="currentSeason" class="episodes">
      <h2>{{ currentSeason.name }}</h2>
      <div class="grid">
        <div v-for="episode in currentSeason.episodes" :key="episode.id" class="episode-card">
          <img :src="episode.still" :alt="episode.name" />
          <h3>{{ episode.episode_number }}. {{ episode.name }}</h3>
          <p>{{ episode.overview }}</p>
          <p>⭐ {{ episode.rating }}</p>
          <button @click="playEpisode(episode)">Watch</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const API_BASE = 'https://vyla-api.vercel.app/api';
const show = ref(null);
const currentSeason = ref(null);

const tvId = 1399;

onMounted(async () => {
  const response = await fetch(`${API_BASE}/details/tv/${tvId}`);
  const data = await response.json();
  show.value = data;
});

const loadSeason = async (seasonNumber) => {
  const response = await fetch(`${API_BASE}/tv/${tvId}/season/${seasonNumber}`);
  const data = await response.json();
  currentSeason.value = data.data;
};

const playEpisode = (episode) => {
  window.location.href = episode.player_link;
};
</script>
```

### Next.js 14 with Server Components

```jsx
const API_BASE = 'https://vyla-api.vercel.app/api';

async function getHomeData() {
  const res = await fetch(`${API_BASE}/home`, { 
    next: { revalidate: 3600 }
  });
  return res.json();
}

async function getGenres() {
  const res = await fetch(`${API_BASE}/genres/movie`, {
    next: { revalidate: 86400 }
  });
  return res.json();
}

export default async function Home() {
  const [homeData, genresData] = await Promise.all([
    getHomeData(),
    getGenres()
  ]);

  return (
    <main>
      {/* Trending Carousel with Title Images */}
      <section className="hero">
        {homeData.data[0].items.map(item => (
          <div key={item.id} className="hero-slide">
            <div 
              className="backdrop" 
              style={{ backgroundImage: `url(${item.backdrop})` }}
            />
            {item.title_image && (
              <img src={item.title_image} alt={item.title} className="title-logo" />
            )}
          </div>
        ))}
      </section>

      {/* All Sections */}
      {homeData.data.slice(1).map(section => (
        <section key={section.title}>
          <h2>{section.title}</h2>
          <div className="row">
            {section.items.map(item => (
              <MovieCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}

async function getGenreContent(genreId, page = 1) {
  const res = await fetch(
    `${API_BASE}/genres/movie/${genreId}?page=${page}&sort_by=vote_average.desc`,
    { next: { revalidate: 3600 } }
  );
  return res.json();
}

export default async function GenrePage({ params, searchParams }) {
  const page = searchParams.page || 1;
  const data = await getGenreContent(params.id, page);

  return (
    <div>
      <h1>Genre: {params.id}</h1>
      <div className="grid">
        {data.results.map(item => (
          <MovieCard key={item.id} item={item} />
        ))}
      </div>
      
      {/* Pagination */}
      {data.meta.has_prev && (
        <a href={`?page=${data.meta.page - 1}`}>Previous</a>
      )}
      {data.meta.has_next && (
        <a href={`?page=${data.meta.page + 1}`}>Next</a>
      )}
    </div>
  );
}
```

---

## Mobile Integration

### React Native

```jsx
import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';

const API_BASE = 'https://vyla-api.vercel.app/api';

export default function HomeScreen() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/home`)
      .then(res => res.json())
      .then(data => setMovies(data.data[0].items));
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity>
      <View style={{ position: 'relative' }}>
        <Image 
          source={{ uri: item.poster }} 
          style={{ width: 150, height: 225 }}
        />
        {item.title_image && (
          <Image 
            source={{ uri: item.title_image }}
            style={{ 
              position: 'absolute', 
              top: 10, 
              left: 10, 
              width: 130, 
              height: 60 
            }}
            resizeMode="contain"
          />
        )}
      </View>
      <Text>{item.title}</Text>
      <Text>⭐ {item.vote_average}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={movies}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
      horizontal
    />
  );
}
```

---

## Security & Best Practices

1. **Always use HTTPS in production**
2. **Implement client-side caching** - Reduce server load and improve UX
3. **Handle errors gracefully** - Provide fallback UI
4. **Respect rate limits** - Implement request throttling
5. **Use environment variables** - Keep API URLs configurable
6. **Implement loading states** - Better user experience
7. **Add retry logic** - Handle temporary failures
8. **Lazy load images** - Improve initial load times
9. **Prefetch related data** - Reduce perceived latency
10. **Use title images wisely** - Not all content has logos

---

## Performance Tips

### Image Optimization

```javascript
function ProgressiveImage({ poster, titleImage, alt }) {
  const [loaded, setLoaded] = useState(false);
  
  return (
    <div className="image-container">
      {/* Low-quality placeholder */}
      <img 
        src={poster.replace('w342', 'w92')} 
        className={`placeholder ${loaded ? 'hidden' : ''}`}
        alt={alt}
      />
      
      {/* Full quality image */}
      <img 
        src={poster}
        className={loaded ? 'visible' : 'hidden'}
        onLoad={() => setLoaded(true)}
        alt={alt}
      />
      
      {/* Title logo overlay */}
      {titleImage && loaded && (
        <img src={titleImage} className="title-overlay" alt="" />
      )}
    </div>
  );
}
```

### Data Caching

```javascript
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000;

async function fetchWithCache(url) {
  const cached = cache.get(url);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  
  const response = await fetch(url);
  const data = await response.json();
  
  cache.set(url, {
    data,
    timestamp: Date.now()
  });
  
  return data;
}
```

### Pagination Helper

```javascript
function usePagination(fetchFunction) {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    const result = await fetchFunction(page);
    
    setData(prev => [...prev, ...result.results]);
    setHasMore(result.meta.has_next);
    setPage(prev => prev + 1);
    setLoading(false);
  };

  return { data, loadMore, loading, hasMore };
}

const { data, loadMore, loading } = usePagination(
  (page) => fetch(`${API_BASE}/genres/movie/28?page=${page}`).then(r => r.json())
);
```

---

## Common Use Cases

### Build a Video Player

```javascript
function VideoPlayer({ type, id, season, episode }) {
  const [sources, setSources] = useState([]);
  const [selectedSource, setSelectedSource] = useState(0);

  useEffect(() => {
    const url = type === 'movie' 
      ? `${API_BASE}/player/movie/${id}`
      : `${API_BASE}/player/tv/${id}?s=${season}&e=${episode}`;
    
    fetch(url)
      .then(res => res.json())
      .then(data => setSources(data.sources));
  }, [type, id, season, episode]);

  if (!sources.length) return <div>Loading...</div>;

  return (
    <div>
      {/* Source Selector */}
      <select onChange={(e) => setSelectedSource(e.target.value)}>
        {sources.map((source, index) => (
          <option key={source.id} value={index}>
            {source.name} {source.isFrench && '(FR)'}
          </option>
        ))}
      </select>

      {/* Player */}
      <iframe
        src={sources[selectedSource].stream_url}
        allowFullScreen
        sandbox={sources[selectedSource].needsSandbox ? 'allow-scripts allow-same-origin' : undefined}
        style={{ width: '100%', height: '600px', border: 'none' }}
      />
    </div>
  );
}
```

### Build a TV Show Navigator

```javascript
function TVShowNavigator({ tvId }) {
  const [show, setShow] = useState(null);
  const [currentSeason, setCurrentSeason] = useState(null);
  const [currentEpisode, setCurrentEpisode] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/details/tv/${tvId}`)
      .then(res => res.json())
      .then(data => {
        setShow(data);
        loadSeason(1);
      });
  }, [tvId]);

  const loadSeason = async (seasonNumber) => {
    const response = await fetch(`${API_BASE}/tv/${tvId}/season/${seasonNumber}`);
    const data = await response.json();
    setCurrentSeason(data.data);
  };

  const loadEpisode = async (seasonNumber, episodeNumber) => {
    const response = await fetch(
      `${API_BASE}/episodes/${tvId}/${seasonNumber}/${episodeNumber}`
    );
    const data = await response.json();
    setCurrentEpisode(data.data);
  };

  return (
    <div>
      {/* Season Selector */}
      <div className="seasons">
        {show?.seasons.map(season => (
          <button 
            key={season.number}
            onClick={() => loadSeason(season.number)}
            className={currentSeason?.season_number === season.number ? 'active' : ''}
          >
            {season.name}
          </button>
        ))}
      </div>

      {/* Episodes */}
      {currentSeason && (
        <div className="episodes">
          {currentSeason.episodes.map(episode => (
            <div 
              key={episode.id}
              onClick={() => loadEpisode(currentSeason.season_number, episode.episode_number)}
            >
              <img src={episode.still} alt={episode.name} />
              <h3>E{episode.episode_number}: {episode.name}</h3>
              <p>{episode.overview}</p>
            </div>
          ))}
        </div>
      )}

      {/* Episode Details */}
      {currentEpisode && (
        <div className="episode-details">
          <h2>{currentEpisode.name}</h2>
          <p>Directed by: {currentEpisode.crew.directors[0]?.name}</p>
          <p>Guest Stars: {currentEpisode.guest_stars.map(s => s.name).join(', ')}</p>
          <a href={`/player/tv/${tvId}?s=${currentEpisode.season_number}&e=${currentEpisode.episode_number}`}>
            Watch Episode
          </a>
        </div>
      )}
    </div>
  );
}
```

### Build a Genre Browser

```javascript
function GenreBrowser({ type = 'movie' }) {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [content, setContent] = useState([]);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('popularity.desc');

  useEffect(() => {
    fetch(`${API_BASE}/genres/${type}`)
      .then(res => res.json())
      .then(data => setGenres(data.genres));
  }, [type]);

  useEffect(() => {
    if (!selectedGenre) return;
    
    fetch(`${API_BASE}/genres/${type}/${selectedGenre}?page=${page}&sort_by=${sortBy}`)
      .then(res => res.json())
      .then(data => setContent(data.results));
  }, [type, selectedGenre, page, sortBy]);

  return (
    <div>
      {/* Genre Pills */}
      <div className="genre-pills">
        {genres.map(genre => (
          <button
            key={genre.id}
            onClick={() => {
              setSelectedGenre(genre.id);
              setPage(1);
            }}
            className={selectedGenre === genre.id ? 'active' : ''}
          >
            {genre.name}
          </button>
        ))}
      </div>

      {/* Sort Options */}
      {selectedGenre && (
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="popularity.desc">Most Popular</option>
          <option value="vote_average.desc">Highest Rated</option>
          <option value="release_date.desc">Newest</option>
          <option value="title.asc">A-Z</option>
        </select>
      )}

      {/* Content Grid */}
      <div className="grid">
        {content.map(item => (
          <div key={item.id} className="card">
            {item.title_image && (
              <img src={item.title_image} className="title-logo" alt="" />
            )}
            <img src={item.poster} alt={item.title} />
            <h3>{item.title}</h3>
            <p>⭐ {item.rating}</p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {selectedGenre && (
        <div className="pagination">
          <button onClick={() => setPage(p => Math.max(1, p - 1))}>Previous</button>
          <span>Page {page}</span>
          <button onClick={() => setPage(p => p + 1)}>Next</button>
        </div>
      )}
    </div>
  );
}
```

---

## Rate Limits

- **Fair usage policy**: No hard limits for public API
- **Recommended**: Cache responses when possible
- **Best practice**: Implement request throttling on your end

---

## CORS

CORS is enabled for all origins. Your frontend can make requests from any domain.

---

## Support

- **API Status**: https://vyla-api.vercel.app/api/health
- **GitHub Issues**: Report bugs and request features
- **Documentation**: This file and README.md


**Happy Building! 🎬**
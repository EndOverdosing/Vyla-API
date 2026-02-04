# Vyla Media API

Vyla is a headless media API providing access to TMDB’s movie and TV show data. It offers a clean, consistent interface for building media apps with curated content, search, cast info, streaming sources, and image handling.

---

## Features

* Trending, top-rated, Netflix Originals, and genre-specific content
* Movie/TV details with cast, crew, seasons, and related recommendations
* Search movies and TV shows (`/api/search`)
* Cast and actor details (`/api/cast/{id}`)
* Unified media details endpoint (`/api/details/{type}/{id}`)
* Direct TMDB image URLs with automatic resizing
* View paths for easy navigation (`view_path` and `details_link` in responses)
* Rate-limited and CORS-enabled
* Node.js + Express backend, Tailwind CSS frontend

---

## Quick Start

### Prerequisites

* Node.js 14+ and npm
* TMDB API Key ([get it here](https://www.themoviedb.org/settings/api))

### Installation

```bash
git clone https://github.com/yourusername/vyla-api.git
cd vyla-api
npm install
```

Create a `.env` file:

```env
TMDB_API_KEY=your_tmdb_api_key_here
PORT=3000
NODE_ENV=development
```

Start the server:

```bash
npm run dev
# or with Vercel CLI
vercel dev
```

The API will run at `http://localhost:3000`. Open `public/index.html` in a browser to view the demo frontend.

---

## API Endpoints Overview

| Endpoint                                           | Method | Description                                                                      |
| -------------------------------------------------- | ------ | -------------------------------------------------------------------------------- |
| `/api/home`                                        | GET    | Curated home sections (Trending, Top Rated, Genres, Netflix Originals, etc.)     |
| `/api/search?q={query}&page={page}`                | GET    | Search movies or TV shows                                                        |
| `/api/details/{type}/{id}`                          | GET    | Media details with cast, crew, recommendations, and trailer (type: 'movie' or 'tv') |
| `/api/cast/{id}`                                   | GET    | Cast/actor details including known-for movies and shows                          |
| `/api/player/movie/{id}`                           | GET    | Streaming sources for a movie                                                    |
| `/api/player/tv/{id}?s={season}&e={episode}`       | GET    | Streaming sources for a TV episode                                               |
| `/api/image/{size}/{file}`                         | GET    | TMDB image proxy with resizing and fallback                                      |
| `/api/list?endpoint={tmdb_endpoint}&params={JSON}` | GET    | Fetch a custom list from TMDB (e.g., top-rated, popular)                         |

---

## Example Usage

**Fetch home data:**

```bash
curl http://localhost:3000/api/home
```

**Search movies or TV shows:**

```bash
curl "http://localhost:3000/api/search?q=avengers"
```

**Get media details:**

```bash
# Get movie details
curl http://localhost:3000/api/details/movie/299534

# Get TV show details
curl http://localhost:3000/api/details/tv/1668
```

**Get cast info:**

```bash
curl http://localhost:3000/api/cast/500
```

**Get streaming sources for a movie:**

```bash
curl http://localhost:3000/api/player/movie/299534
```

**Get streaming sources for a TV episode:**

```bash
curl "http://localhost:3000/api/player/tv/1668?s=1&e=1"
```

**Fetch a custom TMDB list:**

```bash
curl "http://localhost:3000/api/list?endpoint=/movie/top_rated"
```

---

## Endpoint Examples

### 1. Home Data

**Request:**

```http
GET /api/home
```

**Response:**

```json
{
  "data": [
    {
      "title": "Trending Now",
      "layout_type": "carousel",
      "items": [
        {
          "id": 12345,
          "title": "Sample Movie",
          "overview": "This is a sample movie overview.",
          "poster_path": "/poster123.jpg",
          "backdrop_path": "/backdrop123.jpg",
          "media_type": "movie",
          "vote_average": 7.8,
          "release_date": "2023-01-01",
          "genre_ids": [12, 28],
          "view_path": "/api/details/movie/12345",
          "details_link": "/api/details/movie/12345"
        }
      ]
    },
    {
      "title": "Top Rated",
      "layout_type": "row",
      "items": [
        {
          "id": 12346,
          "title": "Top Rated Movie",
          "overview": "This is another sample movie.",
          "poster_path": "/poster456.jpg",
          "backdrop_path": "/backdrop456.jpg",
          "media_type": "movie",
          "vote_average": 8.5,
          "release_date": "2023-02-01",
          "genre_ids": [18, 36],
          "view_path": "/api/details/movie/12346",
          "details_link": "/api/details/movie/12346"
        }
      ]
    }
  ],
  "meta": {
    "timestamp": "2023-01-01T12:00:00.000Z",
    "version": "1.0.0"
  }
}
```

### 2. Search Results

**Request:**

```http
GET /api/search?q=avengers
```

**Response:**

```json
{
  "meta": {
    "query": "avengers",
    "page": 1,
    "total_pages": 1,
    "total_results": 42
  },
  "results": [
    {
      "id": 299534,
      "title": "Avengers: Endgame",
      "overview": "After the devastating events of Avengers: Infinity War...",
      "poster_path": "/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
      "backdrop_path": "/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
      "media_type": "movie",
      "vote_average": 8.3,
      "release_date": "2019-04-24",
      "genre_ids": [12, 28, 878],
      "view_path": "/api/details/movie/299534",
      "details_link": "/api/details/movie/299534"
    },
    {
      "id": 24428,
      "title": "The Avengers",
      "overview": "When an unexpected enemy emerges...",
      "poster_path": "/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg",
      "backdrop_path": "/hbn46fQaRmlpBuUrEiFqv0Gkl6r.jpg",
      "media_type": "movie",
      "vote_average": 7.7,
      "release_date": "2012-04-25",
      "genre_ids": [878, 28, 12],
      "view_path": "/api/details/movie/24428",
      "details_link": "/api/details/movie/24428"
    }
  ]
}
```

### 3. Media Details

**Movie Details Request:**

```http
GET /api/details/movie/12345
```

**Movie Details Response:**

```json
{
  "id": 12345,
  "title": "Sample Movie",
  "overview": "This is a sample movie overview.",
  "tagline": "A sample tagline",
  "runtime": 120,
  "release_date": "2023-01-01",
  "vote_average": 7.8,
  "vote_count": 1000,
  "genres": [
    { "id": 12, "name": "Adventure" },
    { "id": 28, "name": "Action" }
  ],
  "backdrop": "https://image.tmdb.org/t/p/original/backdrop123.jpg",
  "poster": "https://image.tmdb.org/t/p/w500/poster123.jpg",
  "trailer_url": "https://www.youtube.com/watch?v=example",
  "homepage": "https://example.com/movie",
  "status": "Released",
  "original_language": "en",
  "production_companies": [
    {
      "id": 1,
      "name": "Sample Studio",
      "logo_path": "/logo123.png",
      "origin_country": "US"
    }
  ],
  "cast": [
    {
      "id": 500,
      "name": "John Doe",
      "character": "Main Character",
      "profile_path": "/actor123.jpg",
      "profile": "https://image.tmdb.org/t/p/w185/actor123.jpg",
      "view_cast_link": "/api/cast/500"
    }
  ],
  "related": [
    {
      "id": 12346,
      "type": "movie",
      "title": "Sequel Movie",
      "poster_path": "/poster124.jpg",
      "poster": "https://image.tmdb.org/t/p/w342/poster124.jpg",
      "details_link": "/api/details/movie/12346",
      "year": "2024",
      "rating": 8.0
    }
  ],
  "view_path": "/api/details/movie/12345"
}
```

**TV Show Details Request:**

```http
GET /api/details/tv/54321
```

**TV Show Details Response:**

```json
{
  "id": 54321,
  "name": "Sample TV Show",
  "overview": "This is a sample TV show overview.",
  "first_air_date": "2023-01-01",
  "last_air_date": "2023-12-31",
  "number_of_seasons": 1,
  "number_of_episodes": 10,
  "vote_average": 8.2,
  "vote_count": 500,
  "genres": [
    { "id": 18, "name": "Drama" },
    { "id": 80, "name": "Crime" }
  ],
  "backdrop_path": "/backdrop54321.jpg",
  "backdrop": "https://image.tmdb.org/t/p/original/backdrop54321.jpg",
  "poster_path": "/poster54321.jpg",
  "poster": "https://image.tmdb.org/t/p/w500/poster54321.jpg",
  "trailer_url": "https://www.youtube.com/watch?v=example2",
  "homepage": "https://example.com/tv",
  "status": "Returning Series",
  "seasons": [
    {
      "number": 1,
      "name": "Season 1",
      "episode_count": 10,
      "air_date": "2023-01-01",
      "poster_path": "/season1.jpg",
      "poster": "https://image.tmdb.org/t/p/w500/season1.jpg",
      "overview": "First season overview"
    }
  ],
  "cast": [
    {
      "id": 501,
      "name": "Jane Smith",
      "character": "Lead Role",
      "profile_path": "/actor501.jpg",
      "profile": "https://image.tmdb.org/t/p/w185/actor501.jpg",
      "view_cast_link": "/api/cast/501"
    }
  ],
  "related": [
    {
      "id": 54322,
      "type": "tv",
      "title": "Spin-off Series",
      "poster_path": "/poster54322.jpg",
      "poster": "https://image.tmdb.org/t/p/w342/poster54322.jpg",
      "details_link": "/api/details/tv/54322",
      "year": "2024",
      "rating": 8.1
    }
  ],
  "view_path": "/api/details/tv/54321"
}
```

### 4. Cast/Actor Details

**Request:**

```http
GET /api/cast/500
```

**Response:**

```json
{
  "id": 500,
  "name": "John Doe",
  "biography": "John Doe is an American actor known for...",
  "birthday": "1980-01-01",
  "deathday": null,
  "place_of_birth": "Los Angeles, California, USA",
  "profile_path": "/actor500.jpg",
  "profile": "https://image.tmdb.org/t/p/h632/actor500.jpg",
  "known_for": {
    "movies": [
      {
        "id": 12345,
        "title": "Sample Movie",
        "character": "Main Character",
        "poster_path": "/poster123.jpg",
        "poster": "https://image.tmdb.org/t/p/w342/poster123.jpg",
        "details_link": "/api/details/movie/12345"
        "details_link": "/api/details/movie/299534"
      }
    ],
    "shows": [
      {
        "id": 1668,
        "title": "Avengers Assemble",
        "poster": "https://image.tmdb.org/t/p/w342/poster_path.jpg",
        "details_link": "/api/details/tv/1668"
      }
    ]
  }
}
```

---

### 5. Streaming Sources (Player)

**Movie Request:**

```http
GET /api/player/movie/299534
```

**Response:**

```json
{
  "meta": {
    "content_id": 299534,
    "type": "movie",
    "season": null,
    "episode": null,
    "back_path": "/api/details/movie/299534"
  },
  "sources": [
    {
      "id": "pstream",
      "name": "P-Stream",
      "stream_url": "https://iframe.pstream.mov/media/tmdb-movie-299534"
    },
    {
      "id": "vidlink",
      "name": "VidLink",
      "stream_url": "https://vidlink.pro/movie/299534"
    }
  ]
}
```

**TV Episode Request:**

```http
GET /api/player/tv/1668?s=1&e=1
```

**Response:**

```json
{
  "meta": {
    "content_id": 1668,
    "type": "tv",
    "season": 1,
    "episode": 1,
    "back_path": "/api/details/tv/1668"
  },
  "sources": [
    {
      "id": "pstream",
      "name": "P-Stream",
      "stream_url": "https://iframe.pstream.mov/media/tmdb-tv-1668/1/1"
    },
    {
      "id": "vidlink",
      "name": "VidLink",
      "stream_url": "https://vidlink.pro/tv/1668/1/1"
    }
  ]
}
```

---

## Response Objects Reference

### Movie Object
```json
{
  "id": 12345,
  "title": "Movie Title",
  "overview": "Movie overview text...",
  "poster_path": "/poster123.jpg",
  "backdrop_path": "/backdrop123.jpg",
  "media_type": "movie",
  "vote_average": 7.8,
  "release_date": "2023-01-01",
  "genre_ids": [12, 28],
  "view_path": "/api/details/movie/12345",
  "details_link": "/api/details/movie/12345"
}
```

### TV Show Object
```json
{
  "id": 54321,
  "name": "TV Show Title",
  "overview": "TV show overview...",
  "poster_path": "/poster54321.jpg",
  "backdrop_path": "/backdrop54321.jpg",
  "media_type": "tv",
  "vote_average": 8.2,
  "first_air_date": "2023-01-01",
  "genre_ids": [18, 80],
  "view_path": "/api/details/tv/54321",
  "details_link": "/api/details/tv/54321"
}
```

### Cast Member Object
```json
{
  "id": 500,
  "name": "Actor Name",
  "character": "Character Name",
  "profile_path": "/actor500.jpg",
  "view_cast_link": "/api/cast/500"
}
```

### Genre Object
```json
{
  "id": 28,
  "name": "Action"
}
```

## Frontend Demo

* Located at `public/index.html`
* Loads `/api/home` sections dynamically
* Displays trending carousel, genre rows, and Netflix Originals
* Provides search functionality and previews for movies/TV shows
* Uses proxy images for safe loading

---

## Image Handling

* Sizes: `w92`, `w154`, `w185`, `w342`, `w500`, `w780`, `original`
* Example: `/api/image/w500/poster_path.jpg`
* Fallback: 1x1 transparent pixel
* TMDB URL mapping: Poster: `https://image.tmdb.org/t/p/w500/{poster_path}`

---

## Response Format

**Success:**

```json
{
  "data": [...],
  "meta": {
    "timestamp": "2023-10-15T12:00:00Z",
    "version": "1.0.0",
    "api_version": "v1"
  }
}
```

**Error:**

```json
{
  "error": {
    "status": 404,
    "message": "Resource not found",
    "code": "not_found"
  }
}
```

---

## Development Notes

* Frontend: `public/` (HTML, JS, CSS)
* Tailwind CSS: Use PostCSS or CLI for production
* Dev server reloads automatically:

```bash
npm run dev
```

* Logs: `logs/`
* Health check endpoint: `/health`

---

## Production Deployment

1. Set `NODE_ENV=production`
2. Configure reverse proxy (Nginx/Apache)
3. Enable SSL/TLS
4. Add environment variables

---

## Contributing

1. Fork the repo
2. Create a feature branch
3. Commit changes
4. Push branch
5. Open Pull Request

---

## License

MIT
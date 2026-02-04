# Vyla Media API

Vyla is a headless media API that provides easy access to TMDB's movie and TV show data with a clean, consistent interface. It's perfect for building media-focused applications without dealing with complex API integrations.

## Features

- Get trending, top-rated, and genre-specific content
- Search for movies and TV shows
- Get detailed information about movies and TV shows
- Automatic image URL generation
- CORS enabled for frontend integration

## Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/vyla-api.git
   cd vyla-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```
   TMDB_API_KEY=your_tmdb_api_key
   PORT=3001
   ```

4. **Start the development server**
   ```bash
   vercel dev
   ```
   The API will be available at `http://localhost:3001`

## API Endpoints

### Home Page
Get curated content for the home page

```http
GET /api/home
```

**Response Example:**
```json
{
  "trending": [
    {
      "id": 12345,
      "title": "Movie Title",
      "overview": "Movie overview...",
      "posterPath": "https://image.tmdb.org/t/p/w500/poster_path.jpg",
      "backdropPath": "https://image.tmdb.org/t/p/original/backdrop_path.jpg",
      "mediaType": "movie",
      "voteAverage": 7.8,
      "releaseDate": "2023-10-15"
    }
  ],
  "topRated": [...],
  "netflixOriginals": [...],
  "actionMovies": [...],
  "comedyMovies": [...],
  "horrorMovies": [...],
  "romanceMovies": [...],
  "documentaries": [...]
}
```

### Search
Search for movies and TV shows

```http
GET /api/search?q=query
```

### Get Details
Get detailed information about a movie or TV show

```http
GET /api/details/movie/{id}
GET /api/details/tv/{id}
```

### Player
Get streaming information for a movie or TV show

```http
GET /api/player/movie/{id}
GET /api/player/tv/{id}/season/{season}/episode/{episode}
```

## Deployment

Deploy your own instance with Vercel:

1. Fork this repository
2. Create a new project in Vercel
3. Add your `TMDB_API_KEY` to the environment variables
4. Deploy!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Credits

- [TMDB](https://www.themoviedb.org/) for the movie and TV show data
- [Vercel](https://vercel.com) for hosting
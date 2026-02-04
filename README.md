![Vyla Headless API Thumbnail](https://vyla.vercel.app/images/thumbnail.png)

# Vyla Headless API

Vyla is a production-ready **Headless Media API**. It transforms raw TMDB data into a structured, UI-ready JSON format. Whether you are building a Web, Mobile, or TV app, you can use Vyla as your backend to skip the complex logic of data fetching, image proxying, and layout structuring.

## How to Use Vyla

You can integrate Vyla into your project in two ways:

### 1. The "Plug & Play" Method (No Setup)

Simply point your frontend's fetch requests to my hosted instance. No API keys or server management required on your end.

* **Base URL:** `https://vyla-api.vercel.app/api`

### 2. The "Self-Hosted" Method (Fork)

If you want to customize the logic, add your own genres, or manage your own rate limits:

1. **Fork** this repository.
2. Add your `TMDB_ACCESS_TOKEN` to your Vercel/Environment variables.
3. Deploy and use your own generated URL.

---

## Integration Example

Fetch your homepage content with a single call:

```javascript
const response = await fetch('https://vyla-api.vercel.app/api/home');
const { data, meta } = await response.json();

// 'data' contains your carousel, bento grids, and movie rows
// 'meta' contains your navigation paths for the "Back" button

```

---

## API Path Mapping

| Endpoint | Purpose | Use Case |
| --- | --- | --- |
| `/home` | **Content Discovery** | Powering the main dashboard and tabs. |
| `/details/:type/:id` | **Item View** | Fetching full metadata, cast, and trailers for a title. |
| `/list?path=...` | **Exploration** | Powering the "View All" or "Genre" pages. |
| `/search?q=...` | **Global Search** | Instant results for Movies, TV, and Actors. |
| `/image/:size/:file` | **Image Optimization** | Serving resized, proxied posters and backdrops. |

---

## Layout Logic

Vyla doesn't just send data; it sends **instructions**. The API response tells your frontend how to look:

* **`layout_type: "carousel"`**: Use a hero slider.
* **`layout_type: "bento"`**: Use a CSS grid (supporting `wide`, `large`, or `normal` tiles).
* **`layout_type: "row"`**: Use a standard horizontal scroller.
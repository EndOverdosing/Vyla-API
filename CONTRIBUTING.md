# Contributing to Vyla API

Thank you for your interest in Vyla API! This guide will help you get started whether you want to:
- Use the hosted API for your frontend
- Fork and deploy your own instance
- Contribute improvements back to the project

---

## For Frontend Developers

### Using the Hosted API

**Just start coding!** No setup required.

```javascript
const API_BASE = 'https://vyla-api.vercel.app/api';

fetch(`${API_BASE}/home`)
  .then(res => res.json())
  .then(data => console.log(data));
```

See [API_DOCS.md](./API_DOCS.md) for complete endpoint documentation.

---

## Forking & Self-Hosting

### Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/vyla-api)

1. Click the button above
2. Sign in to Vercel
3. Add environment variable: `TMDB_API_KEY`
4. Deploy!

Your API will be live at: `https://your-project.vercel.app/api`

### Manual Setup

#### 1. Fork the Repository

Click the "Fork" button on GitHub.

#### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/vyla-api.git
cd vyla-api
```

#### 3. Install Dependencies

```bash
npm install
```

#### 4. Get TMDB API Key

1. Go to [TMDB](https://www.themoviedb.org/signup)
2. Create an account
3. Go to Settings → API
4. Request an API key
5. Copy your API key

#### 5. Configure Environment

Create `.env` file:

```env
TMDB_API_KEY=your_api_key_here
PORT=3000
NODE_ENV=development
```

#### 6. Run Locally

```bash
npm run dev
```

Your API will be at `http://localhost:3000/api`

#### 7. Test the API

```bash
curl http://localhost:3000/api/health
curl http://localhost:3000/api/home
```

---

## Deployment Options

### Vercel (Recommended)

**Why Vercel?**
- Free tier available
- Automatic HTTPS
- Global CDN
- Zero configuration
- Git integration

**Deploy:**

```bash
npm i -g vercel
vercel login
vercel --prod
```

**Set Environment Variables:**

```bash
vercel env add TMDB_API_KEY
```

### Railway

**Deploy:**

```bash
npm i -g @railway/cli
railway login
railway init
railway up
```

**Add environment variables in Railway dashboard**

### Heroku

```bash
heroku create your-app-name
heroku config:set TMDB_API_KEY=your_key_here
git push heroku main
```

### Docker

**Build:**

```bash
docker build -t vyla-api .
```

**Run:**

```bash
docker run -p 3000:3000 -e TMDB_API_KEY=your_key_here vyla-api
```

**Docker Compose:**

```yaml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - TMDB_API_KEY=${TMDB_API_KEY}
      - NODE_ENV=production
```

### DigitalOcean App Platform

1. Connect your GitHub repository
2. Set environment variable: `TMDB_API_KEY`
3. Deploy!

---

## Development

### Project Structure

```
vyla-api/
├── controllers/        # API endpoint handlers
│   ├── castController.js
│   ├── detailsController.js
│   ├── homeController.js
│   ├── imageController.js
│   ├── listController.js
│   ├── playerController.js
│   └── searchController.js
├── routes/            # API routes
│   └── index.js
├── services/          # External service integrations
│   └── tmdb.js
├── utils/             # Helper functions
│   └── urlHelper.js
├── config/            # Configuration files
│   └── sources.js     # Streaming sources
├── server.js          # Main server file
├── package.json
└── README.md
```

### Adding a New Endpoint

1. **Create controller** in `controllers/`:

```javascript
exports.myNewEndpoint = async (req, res) => {
  try {
    const data = await fetchSomeData();
    res.json({
      success: true,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
```

2. **Add route** in `routes/index.js`:

```javascript
const myController = require('../controllers/myController');
router.get('/my-endpoint', myController.myNewEndpoint);
```

3. **Test locally**:

```bash
npm run dev
curl http://localhost:3000/api/my-endpoint
```

### Adding a Streaming Source

Edit `config/sources.js`:

```javascript
{
  id: "newsource",
  name: "New Source",
  isFrench: false,
  needsSandbox: false,
  urls: {
    movie: "https://newsource.com/movie/{id}",
    tv: "https://newsource.com/tv/{id}/{season}/{episode}"
  },
  startTimeParam: 'time',
  timeFormat: 'seconds',
  supportsEvents: true,
  eventOrigin: 'https://newsource.com'
}
```

### Code Style

- No comments in production code
- Use async/await for asynchronous operations
- Validate all inputs
- Return consistent response formats
- Log errors in development mode

---

## Testing

### Manual Testing

```bash
npm run dev

curl http://localhost:3000/api/home
curl http://localhost:3000/api/search?q=test
curl http://localhost:3000/api/details/movie/550
```

### Health Check

```bash
curl http://localhost:3000/api/health
curl http://localhost:3000/api/status
```

---

## Customization Ideas

### Custom Home Sections

Edit `controllers/homeController.js` to add/remove sections:

```javascript
const [
  trending,
  myCustomSection
] = await Promise.allSettled([
  tmdb.getTrending('all', 'day'),
  tmdb.getMoviesByGenre(YOUR_GENRE_ID)
]);
```

### Custom Rate Limiting

Add rate limiting middleware:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use('/api/', limiter);
```

### Add Caching

Use Redis or in-memory caching:

```javascript
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 });

app.use((req, res, next) => {
  const key = req.originalUrl;
  const cached = cache.get(key);
  
  if (cached) {
    return res.json(cached);
  }
  
  res.sendResponse = res.json;
  res.json = (body) => {
    cache.set(key, body);
    res.sendResponse(body);
  };
  next();
});
```

---

## Contributing Back

We welcome contributions!

### What We're Looking For

- **Bug fixes**
- **New streaming sources**
- **Performance improvements**
- **Documentation improvements**
- **New API endpoints**
- **Frontend examples**

### How to Contribute

1. **Fork the repository**

2. **Create a feature branch**:
```bash
git checkout -b feature/amazing-feature
```

3. **Make your changes**

4. **Test thoroughly**:
```bash
npm run dev
```

5. **Commit with clear messages**:
```bash
git commit -m "Add amazing feature"
```

6. **Push to your fork**:
```bash
git push origin feature/amazing-feature
```

7. **Open a Pull Request**

### Pull Request Guidelines

- Clear description of changes
- Maintain existing code style
- Update documentation if needed
- Test all endpoints
- Keep commits atomic

### Reporting Issues

**Bug Reports:**
- Clear title and description
- Steps to reproduce
- Expected vs actual behavior
- API endpoint and request details

**Feature Requests:**
- Clear use case
- Why it's beneficial
- Proposed implementation (optional)

---

## Sharing Your Implementation

Built something cool with Vyla API? We'd love to see it!

- Share on GitHub Discussions
- Tag us on Twitter/X
- Submit to our Showcase

---

## Resources

- [TMDB API Docs](https://developers.themoviedb.org/3)
- [Express.js Docs](https://expressjs.com/)
- [Vercel Docs](https://vercel.com/docs)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

## Community

- **GitHub Issues**: Bug reports and features
- **GitHub Discussions**: Questions and ideas
- **Discord**: [Coming Soon]

---

## License

MIT License - Free to use in personal and commercial projects

---

## Thank You

Thanks for contributing to Vyla API! Your contributions help make this project better for everyone.

**Happy Coding!**
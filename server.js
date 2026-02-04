const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;

const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', apiRoutes);

app.get('/api', (req, res) => {
    res.json({
        status: "active",
        endpoints: {
            home: "/api/home",
            search: "/api/search?q={query}",
            details: "/api/details/{type}/{id}",
            player: "/api/player/{type}/{id}",
            image_proxy: "/api/image/{size}/{file}",
            list: "/api/list?endpoint={tmdb_endpoint}&params={json_params}"
        }
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
    });
});

if (require.main === module) {
    app.listen(PORT, () => {
    });
}

module.exports = app;
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const apiRoutes = require('./routes');

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api', apiRoutes);

app.get('/', (req, res) => {
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

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Vyla Headless API running on port ${PORT}`);
    });
}

module.exports = app;
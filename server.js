require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

let requestCount = 0;
let lastRequestTime = null;
let errorCount = 0;
let startTime = Date.now();

app.use(cors({
    origin: NODE_ENV === 'production'
        ? process.env.ALLOWED_ORIGINS?.split(',') || '*'
        : '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    maxAge: 86400
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: NODE_ENV === 'production' ? '1d' : 0,
    etag: true
}));

app.use((req, res, next) => {
    requestCount++;
    lastRequestTime = new Date();

    const startTime = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - startTime;

        if (res.statusCode >= 400) {
            errorCount++;
        }
    });

    next();
});

app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.json({
        success: true,
        name: 'Vyla Media API',
        version: '1.1.0',
        status: 'active',
        environment: NODE_ENV,
        uptime: Math.floor((Date.now() - startTime) / 1000),
        documentation: 'https://github.com/endoverdosing/Vyla-API',
        endpoints: {
            api_root: '/api',
            home: '/api/home',
            search: '/api/search?q={query}',
            details: '/api/details/{type}/{id}',
            cast: '/api/cast/{id}',
            player: '/api/player/{type}/{id}',
            list: '/api/list?endpoint={tmdb_endpoint}',
            health: '/api/health',
            status: '/api/status'
        },
        links: {
            github: 'https://github.com/endoverdosing/Vyla-API',
            tmdb: 'https://www.themoviedb.org',
            documentation: 'https://github.com/endoverdosing/Vyla-API#readme'
        }
    });
});

app.get('/api/status', (req, res) => {
    const uptime = Math.floor((Date.now() - startTime) / 1000);
    const memoryUsage = process.memoryUsage();

    res.json({
        success: true,
        status: 'operational',
        environment: NODE_ENV,
        uptime: {
            seconds: uptime,
            formatted: formatUptime(uptime)
        },
        memory: {
            heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + ' MB',
            heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + ' MB',
            rss: Math.round(memoryUsage.rss / 1024 / 1024) + ' MB',
            external: Math.round(memoryUsage.external / 1024 / 1024) + ' MB'
        },
        requests: {
            total: requestCount,
            errors: errorCount,
            successRate: requestCount > 0
                ? Math.round(((requestCount - errorCount) / requestCount) * 100) + '%'
                : '100%',
            lastRequest: lastRequestTime
        },
        timestamp: new Date().toISOString()
    });
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'The requested resource was not found',
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString(),
        suggestion: 'Check the API documentation at /api'
    });
});

app.use((err, req, res, next) => {
    console.error('[ERROR]', {
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method
    });

    errorCount++;

    const statusCode = err.statusCode || err.status || 500;
    const message = NODE_ENV === 'production'
        ? 'Internal Server Error'
        : err.message;

    res.status(statusCode).json({
        success: false,
        error: err.name || 'Error',
        message,
        path: req.originalUrl,
        timestamp: new Date().toISOString(),
        ...(NODE_ENV === 'development' && {
            stack: err.stack,
            details: err.details || null
        })
    });
});

function formatUptime(seconds) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

    return parts.join(' ');
}

if (require.main === module) {
    const server = app.listen(PORT, () => {
        console.log('='.repeat(50));
        console.log(`🚀 Vyla Media API Server`);
        console.log('='.repeat(50));
        console.log(`Environment: ${NODE_ENV}`);
        console.log(`Port: ${PORT}`);
        console.log(`URL: http://localhost:${PORT}`);
        console.log(`API: http://localhost:${PORT}/api`);
        console.log(`Health: http://localhost:${PORT}/api/health`);
        console.log(`Status: http://localhost:${PORT}/api/status`);
        console.log('='.repeat(50));
    });

    process.on('SIGTERM', () => {
        console.log('SIGTERM signal received: closing HTTP server');
        server.close(() => {
            console.log('HTTP server closed');
            process.exit(0);
        });
    });

    process.on('SIGINT', () => {
        console.log('SIGINT signal received: closing HTTP server');
        server.close(() => {
            console.log('HTTP server closed');
            process.exit(0);
        });
    });

    process.on('unhandledRejection', (reason, promise) => {
        console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });

    process.on('uncaughtException', (error) => {
        console.error('Uncaught Exception:', error);
        process.exit(1);
    });
}

module.exports = app;
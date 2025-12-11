// configurazione di Express (middleware, routes)
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// importa Firebase Admin centralizzato
const { db, auth } = require('./config/firebase');

// importa error handler
const { errorHandler, notFoundHandler } = require('./utils/errorHandler');

// importa routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');

const app = express();

// sicurezza headers
app.use(helmet());

// CORS configurato (limita origin in produzione)
const corsOptions = {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// logging (solo in development)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// rate limiting globale
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minuti
    max: 100, // max 100 richieste per IP
    message: { status: 'fail', message: 'Troppe richieste, riprova più tardi.' }
});
app.use('/api', limiter);

// rate limiting più restrittivo per auth
const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 ora
    max: 10, // max 10 tentativi
    message: { status: 'fail', message: 'Troppi tentativi di login, riprova più tardi.' }
});
app.use('/api/auth', authLimiter);

// body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// root endpoint
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'GreenZone API - Backend attivo',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            auth: '/api/auth',
            users: '/api/users'
        }
    });
});

// health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// monta routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// 404 handler
app.use(notFoundHandler);

// error handler centralizzato
app.use(errorHandler);

module.exports = { app, db, auth };



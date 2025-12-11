// verifica token Firebase
const { auth } = require('../config/firebase');
const { AppError } = require('../utils/errorHandler');

/**
 * Middleware per verificare il token Firebase ID
 * Estrae il token dall'header Authorization: Bearer <token>
 * Allega req.user con uid, email e claims
 */
const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next(new AppError('Token di autenticazione mancante', 401));
        }

        const token = authHeader.split('Bearer ')[1];

        if (!token) {
            return next(new AppError('Token di autenticazione non valido', 401));
        }

        // Verifica il token con Firebase Admin
        const decodedToken = await auth.verifyIdToken(token);

        // Allega i dati utente alla richiesta
        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email,
            emailVerified: decodedToken.email_verified,
            role: decodedToken.role || 'user', // custom claim
            claims: decodedToken
        };

        next();
    } catch (error) {
        console.error('Errore verifica token:', error.message);

        if (error.code === 'auth/id-token-expired') {
            return next(new AppError('Token scaduto, effettua nuovamente il login', 401));
        }
        if (error.code === 'auth/id-token-revoked') {
            return next(new AppError('Token revocato, effettua nuovamente il login', 401));
        }

        return next(new AppError('Token non valido', 401));
    }
};

/**
 * Middleware per verificare il ruolo admin
 * Da usare dopo verifyToken
 */
const requireAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    return next(new AppError('Accesso negato: richiesti privilegi admin', 403));
};

/**
 * Middleware per verificare che l'utente stia accedendo ai propri dati o sia admin
 */
const requireSelfOrAdmin = (req, res, next) => {
    const targetUid = req.params.uid;

    if (req.user && (req.user.uid === targetUid || req.user.role === 'admin')) {
        return next();
    }
    return next(new AppError('Accesso negato: non autorizzato', 403));
};

module.exports = { verifyToken, requireAdmin, requireSelfOrAdmin };

// verifica token Firebase
const { auth, db } = require('../config/firebase');
const { AppError } = require('../utils/errorHandler');

/**
 * Middleware per verificare il token Firebase ID
 * Estrae il token dall'header Authorization: Bearer <token>
 * Recupera il ruolo aggiornato da Firestore
 * Allega req.user con uid, email, role e claims
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

        // Recupera il ruolo aggiornato da Firestore
        const userDoc = await db.collection('users').doc(decodedToken.uid).get();
        const ruoloFirestore = userDoc.exists ? userDoc.data().ruolo : 'user';

        // Allega i dati utente alla richiesta
        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email,
            emailVerified: decodedToken.email_verified,
            role: ruoloFirestore, // ruolo da Firestore (sempre aggiornato)
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

/**
 * Middleware per verificare che l'utente sia il creatore del place o admin
 */
const requirePlaceOwnerOrAdmin = async (req, res, next) => {
    try {
        const placeId = req.params.id;

        if (!placeId) {
            return next(new AppError('ID luogo mancante', 400));
        }

        // Recupera il place da Firestore
        const placeDoc = await db.collection('places').doc(placeId).get();

        if (!placeDoc.exists) {
            return next(new AppError('Luogo non trovato', 404));
        }

        const place = placeDoc.data();

        // Verifica se l'utente è il creatore o admin
        if (req.user && (req.user.uid === place.createdBy || req.user.role === 'admin')) {
            req.place = { id: placeDoc.id, ...place };
            return next();
        }

        return next(new AppError('Accesso negato: non sei il proprietario di questo luogo', 403));
    } catch (error) {
        return next(new AppError('Errore nella verifica dei permessi', 500));
    }
};

module.exports = { verifyToken, requireAdmin, requireSelfOrAdmin, requirePlaceOwnerOrAdmin };

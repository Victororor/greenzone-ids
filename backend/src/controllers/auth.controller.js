// Controller per l'autenticazione
const { auth, db } = require('../config/firebase');
const userService = require('../services/user.service');
const { AppError } = require('../utils/errorHandler');
const { z } = require('zod');

// Schema di validazione per registrazione
const registerSchema = z.object({
    nome: z.string().min(2, 'Nome deve avere almeno 2 caratteri').max(50),
    cognome: z.string().min(2, 'Cognome deve avere almeno 2 caratteri').max(50)
});

/**
 * POST /api/auth/register
 * Registra il profilo utente in Firestore dopo che il client ha creato l'account in Firebase Auth
 * Il client invia il token Firebase dopo aver fatto signup
 */
const register = async (req, res, next) => {
    try {
        // Valida i dati aggiuntivi
        const validatedData = registerSchema.parse(req.body);

        // req.user è già popolato dal middleware verifyToken
        const userData = {
            uid: req.user.uid,
            email: req.user.email,
            nome: validatedData.nome,
            cognome: validatedData.cognome,
            ruolo: 'user' // Nuovi utenti sono sempre 'user'
        };

        const newUser = await userService.createUser(userData);

        res.status(201).json({
            status: 'success',
            message: 'Registrazione completata con successo',
            data: { user: newUser }
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return next(new AppError(error.errors[0].message, 400));
        }
        next(error);
    }
};

/**
 * GET /api/auth/verify
 * Verifica che il token sia valido e restituisce i dati utente
 * Utile per il client per verificare la sessione
 */
const verifySession = async (req, res, next) => {
    try {
        // Il middleware verifyToken ha già verificato il token
        // Prova a recuperare il profilo Firestore
        let userProfile = null;

        try {
            userProfile = await userService.getUserById(req.user.uid);
        } catch (error) {
            // Profilo non ancora creato in Firestore
            userProfile = null;
        }

        res.status(200).json({
            status: 'success',
            data: {
                uid: req.user.uid,
                email: req.user.email,
                emailVerified: req.user.emailVerified,
                role: req.user.role,
                profile: userProfile
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * POST /api/auth/logout
 * Revoca i token dell'utente
 * Nota: Il logout effettivo avviene lato client eliminando il token
 * Questo endpoint revoca tutti i refresh token dell'utente
 */
const logout = async (req, res, next) => {
    try {
        // Revoca tutti i refresh token dell'utente
        await auth.revokeRefreshTokens(req.user.uid);

        res.status(200).json({
            status: 'success',
            message: 'Logout effettuato con successo. Tutti i token sono stati revocati.'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * POST /api/auth/set-role (solo admin)
 * Imposta il ruolo di un utente tramite custom claims
 */
const setUserRole = async (req, res, next) => {
    try {
        const { uid, role } = req.body;

        if (!uid || !role) {
            return next(new AppError('uid e role sono richiesti', 400));
        }

        if (!['user', 'admin'].includes(role)) {
            return next(new AppError('Ruolo non valido. Usa: user, admin', 400));
        }

        // Imposta custom claims
        await auth.setCustomUserClaims(uid, { role });

        // Aggiorna anche in Firestore
        await userService.updateUser(uid, { ruolo: role });

        res.status(200).json({
            status: 'success',
            message: `Ruolo aggiornato a ${role} per utente ${uid}`
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    verifySession,
    logout,
    setUserRole
};

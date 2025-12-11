// Controller per l'autenticazione
const { auth, db } = require('../config/firebase');
const userService = require('../services/user.service');
const authService = require('../services/auth.service');
const { AppError } = require('../utils/errorHandler');
const { z } = require('zod');

// Schema di validazione per signup unificato
const signupSchema = z.object({
    email: z.string().email('Email non valida'),
    password: z.string().min(6, 'Password deve avere almeno 6 caratteri'),
    nome: z.string().min(2, 'Nome deve avere almeno 2 caratteri').max(50),
    cognome: z.string().min(2, 'Cognome deve avere almeno 2 caratteri').max(50)
});

// Schema di validazione per login
const loginSchema = z.object({
    email: z.string().email('Email non valida'),
    password: z.string().min(1, 'Password richiesta')
});

// Schema di validazione per registrazione (legacy)
const registerSchema = z.object({
    nome: z.string().min(2, 'Nome deve avere almeno 2 caratteri').max(50),
    cognome: z.string().min(2, 'Cognome deve avere almeno 2 caratteri').max(50)
});

/**
 * POST /api/auth/signup
 * Registrazione unificata: crea account Firebase + profilo Firestore in un'unica chiamata
 */
const signup = async (req, res, next) => {
    try {
        const validatedData = signupSchema.parse(req.body);

        const result = await authService.signup(validatedData);

        res.status(201).json({
            status: 'success',
            message: 'Registrazione completata con successo',
            data: result
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return next(new AppError(error.errors[0].message, 400));
        }
        next(error);
    }
};

/**
 * POST /api/auth/login
 * Login unificato: autentica e restituisce profilo + token
 */
const login = async (req, res, next) => {
    try {
        const validatedData = loginSchema.parse(req.body);

        const result = await authService.login(validatedData);

        res.status(200).json({
            status: 'success',
            message: 'Login effettuato con successo',
            data: result
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return next(new AppError(error.errors[0].message, 400));
        }
        next(error);
    }
};

/**
 * POST /api/auth/refresh
 * Rinnova il token usando il refreshToken
 */
const refresh = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return next(new AppError('refreshToken richiesto', 400));
        }

        const result = await authService.refreshToken(refreshToken);

        res.status(200).json({
            status: 'success',
            data: result
        });
    } catch (error) {
        next(error);
    }
};

/**
 * POST /api/auth/register (legacy)
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
    signup,
    login,
    refresh,
    register,
    verifySession,
    logout,
    setUserRole
};

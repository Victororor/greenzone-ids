// Controller per la gestione degli utenti
const userService = require('../services/user.service');
const { AppError } = require('../utils/errorHandler');
const { z } = require('zod');

// Schema di validazione per creazione utente
const createUserSchema = z.object({
    email: z.string().email('Email non valida'),
    nome: z.string().min(2, 'Nome deve avere almeno 2 caratteri').max(50),
    cognome: z.string().min(2, 'Cognome deve avere almeno 2 caratteri').max(50),
    ruolo: z.enum(['user', 'admin']).optional().default('user')
});

// Schema di validazione per aggiornamento utente
const updateUserSchema = z.object({
    nome: z.string().min(2).max(50).optional(),
    cognome: z.string().min(2).max(50).optional(),
    ruolo: z.enum(['user', 'admin']).optional()
}).refine(data => Object.keys(data).length > 0, {
    message: 'Almeno un campo deve essere fornito per l\'aggiornamento'
});

/**
 * GET /api/users
 * Ottiene tutti gli utenti (solo admin)
 */
const getAllUsers = async (req, res, next) => {
    try {
        const includeDeleted = req.query.includeDeleted === 'true';
        const users = await userService.getAllUsers(includeDeleted);

        res.status(200).json({
            status: 'success',
            results: users.length,
            data: { users }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/users/:uid
 * Ottiene un utente specifico
 */
const getUserById = async (req, res, next) => {
    try {
        const { uid } = req.params;
        const user = await userService.getUserById(uid);

        res.status(200).json({
            status: 'success',
            data: { user }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * POST /api/users
 * Crea un nuovo utente (profilo Firestore dopo registrazione Firebase Auth)
 */
const createUser = async (req, res, next) => {
    try {
        // Valida i dati in ingresso
        const validatedData = createUserSchema.parse(req.body);

        // Usa l'uid dall'utente autenticato
        const userData = {
            uid: req.user.uid,
            email: req.user.email,
            ...validatedData
        };

        const newUser = await userService.createUser(userData);

        res.status(201).json({
            status: 'success',
            message: 'Utente creato con successo',
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
 * PUT /api/users/:uid
 * Aggiorna un utente
 */
const updateUser = async (req, res, next) => {
    try {
        const { uid } = req.params;

        // Valida i dati in ingresso
        const validatedData = updateUserSchema.parse(req.body);

        // Solo admin può cambiare il ruolo
        if (validatedData.ruolo && req.user.role !== 'admin') {
            return next(new AppError('Solo admin può modificare il ruolo', 403));
        }

        const updatedUser = await userService.updateUser(uid, validatedData);

        res.status(200).json({
            status: 'success',
            message: 'Utente aggiornato con successo',
            data: { user: updatedUser }
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return next(new AppError(error.errors[0].message, 400));
        }
        next(error);
    }
};

/**
 * DELETE /api/users/:uid
 * Soft delete di un utente
 */
const softDeleteUser = async (req, res, next) => {
    try {
        const { uid } = req.params;
        const result = await userService.softDeleteUser(uid);

        res.status(200).json({
            status: 'success',
            message: result.message
        });
    } catch (error) {
        next(error);
    }
};

/**
 * DELETE /api/users/:uid/hard
 * Hard delete di un utente (solo admin)
 */
const hardDeleteUser = async (req, res, next) => {
    try {
        const { uid } = req.params;
        const result = await userService.hardDeleteUser(uid);

        res.status(200).json({
            status: 'success',
            message: result.message
        });
    } catch (error) {
        next(error);
    }
};

/**
 * POST /api/users/:uid/restore
 * Ripristina un utente soft-deleted (solo admin)
 */
const restoreUser = async (req, res, next) => {
    try {
        const { uid } = req.params;
        const user = await userService.restoreUser(uid);

        res.status(200).json({
            status: 'success',
            message: 'Utente ripristinato con successo',
            data: { user }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/users/me
 * Ottiene il profilo dell'utente corrente
 */
const getMe = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.user.uid);

        res.status(200).json({
            status: 'success',
            data: { user }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    softDeleteUser,
    hardDeleteUser,
    restoreUser,
    getMe
};

/**
 * Favorite Controller
 * Gestisce le richieste HTTP per i preferiti
 */
const favoriteService = require('../services/favorite.service');
const { AppError } = require('../utils/errorHandler');
const { z } = require('zod');

// Schema di validazione per aggiungere un preferito
const addFavoriteSchema = z.object({
    placeId: z.string().min(1, 'ID luogo richiesto')
});

/**
 * POST /api/favorites
 * Aggiunge un luogo ai preferiti
 */
const addFavorite = async (req, res, next) => {
    try {
        const validatedData = addFavoriteSchema.parse(req.body);
        const userId = req.user.uid;

        const favorite = await favoriteService.addFavorite(userId, validatedData.placeId);

        res.status(201).json({
            status: 'success',
            message: 'Luogo aggiunto ai preferiti',
            data: { favorite }
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return next(new AppError(error.errors[0].message, 400));
        }
        next(error);
    }
};

/**
 * DELETE /api/favorites/:placeId
 * Rimuove un luogo dai preferiti tramite placeId
 */
const removeFavorite = async (req, res, next) => {
    try {
        const { placeId } = req.params;
        const userId = req.user.uid;

        const result = await favoriteService.removeFavorite(userId, placeId);

        res.status(200).json({
            status: 'success',
            message: result.message
        });
    } catch (error) {
        next(error);
    }
};

/**
 * DELETE /api/favorites/id/:favoriteId
 * Rimuove un preferito tramite il suo ID
 */
const removeFavoriteById = async (req, res, next) => {
    try {
        const { favoriteId } = req.params;
        const userId = req.user.uid;

        const result = await favoriteService.removeFavoriteById(userId, favoriteId);

        res.status(200).json({
            status: 'success',
            message: result.message
        });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/favorites
 * Ottiene tutti i preferiti dell'utente autenticato
 */
const getMyFavorites = async (req, res, next) => {
    try {
        const userId = req.user.uid;
        const favorites = await favoriteService.getUserFavorites(userId);

        res.status(200).json({
            status: 'success',
            results: favorites.length,
            data: { favorites }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/favorites/ids
 * Ottiene solo gli ID dei luoghi preferiti (più leggero)
 */
const getMyFavoriteIds = async (req, res, next) => {
    try {
        const userId = req.user.uid;
        const placeIds = await favoriteService.getUserFavoriteIds(userId);

        res.status(200).json({
            status: 'success',
            results: placeIds.length,
            data: { placeIds }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/favorites/check/:placeId
 * Verifica se un luogo è nei preferiti
 */
const checkFavorite = async (req, res, next) => {
    try {
        const { placeId } = req.params;
        const userId = req.user.uid;

        const isFavorite = await favoriteService.isFavorite(userId, placeId);

        res.status(200).json({
            status: 'success',
            data: {
                placeId,
                isFavorite
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * POST /api/favorites/toggle
 * Toggle preferito: aggiunge se non esiste, rimuove se esiste
 */
const toggleFavorite = async (req, res, next) => {
    try {
        const validatedData = addFavoriteSchema.parse(req.body);
        const userId = req.user.uid;

        const result = await favoriteService.toggleFavorite(userId, validatedData.placeId);

        res.status(200).json({
            status: 'success',
            message: result.message,
            data: {
                action: result.action,
                favorite: result.favorite || null
            }
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return next(new AppError(error.errors[0].message, 400));
        }
        next(error);
    }
};

/**
 * GET /api/favorites/count/:placeId
 * Conta quanti utenti hanno un luogo nei preferiti (pubblico)
 */
const getFavoriteCount = async (req, res, next) => {
    try {
        const { placeId } = req.params;
        const count = await favoriteService.getFavoriteCount(placeId);

        res.status(200).json({
            status: 'success',
            data: {
                placeId,
                favoriteCount: count
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addFavorite,
    removeFavorite,
    removeFavoriteById,
    getMyFavorites,
    getMyFavoriteIds,
    checkFavorite,
    toggleFavorite,
    getFavoriteCount
};

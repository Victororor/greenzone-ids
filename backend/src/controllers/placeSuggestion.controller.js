const placeSuggestionService = require('../services/placeSuggestion.service');
const { AppError } = require('../utils/errorHandler');
const { z } = require('zod');

const createSuggestionSchema = z.object({
    name: z.string().min(2).max(100),
    category: z.string(),
    description: z.string().max(1000).optional(),
    location: z.object({
        latitude: z.number(),
        longitude: z.number(),
        address: z.string().optional(),
        city: z.string().optional(),
        country: z.string().optional()
    }),
    tags: z.array(z.string()).optional(),
    contact: z.object({
        phone: z.string().optional(),
        email: z.string().optional(),
        website: z.string().optional()
    }).optional(),
    openingHours: z.record(z.any()).optional()
});

/**
 * POST /api/place-suggestions
 * Utente crea una segnalazione
 */
const createSuggestion = async (req, res, next) => {
    try {
        const body = createSuggestionSchema.parse(req.body);
        const suggestion = await placeSuggestionService.createSuggestion(body, req.user.uid);

        res.status(201).json({
            status: 'success',
            message: 'Suggerimento inviato',
            data: { suggestion }
        });
    } catch (error) {
        if (error.name === 'ZodError') {
            return next(new AppError(error.errors[0].message, 400));
        }
        next(error);
    }
};

/**
 * GET /api/place-suggestions
 * Admin prende tutti i pending
 */
const getPendingSuggestions = async (req, res, next) => {
    try {
        const suggestions = await placeSuggestionService.getPendingSuggestions();
        res.status(200).json({
            status: 'success',
            results: suggestions.length,
            data: { suggestions }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * POST /api/place-suggestions/:id/approve
 * Admin approva una segnalazione
 */
const approveSuggestion = async (req, res, next) => {
    try {
        const msg = await placeSuggestionService.approveSuggestion(req.params.id, req.user.uid);
        res.status(200).json({
            status: 'success',
            message: 'Suggerimento approvato e convertito in luogo',
        });
    } catch (error) {
        next(error);
    }
};

/**
 * POST /api/place-suggestions/:id/reject
 * Admin rifiuta una segnalazione
 */
const rejectSuggestion = async (req, res, next) => {
    try {
        const msg = await placeSuggestionService.rejectSuggestion(req.params.id, req.user.uid);
        res.status(200).json({
            status: 'success',
            message: 'Suggerimento rifiutato'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createSuggestion,
    getPendingSuggestions,
    approveSuggestion,
    rejectSuggestion
};

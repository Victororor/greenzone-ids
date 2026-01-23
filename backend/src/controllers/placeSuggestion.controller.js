const placeSuggestionService = require('../services/placeSuggestion.service');
const { AppError } = require('../utils/errorHandler');

// UTENTE: crea suggerimento
const createSuggestion = async (req, res, next) => {
    try {
        const result = await placeSuggestionService.createSuggestion(req.body, req.user.uid);

        res.status(201).json({
            status: 'success',
            message: 'Luogo inviato per revisione',
            data: { suggestion: result }
        });
    } catch (err) {
        next(err);
    }
};

// UTENTE: recupera suoi suggerimenti
const getMySuggestions = async (req, res, next) => {
    try {
        const suggestions = await placeSuggestionService.getSuggestionsByUser(req.user.uid);

        res.status(200).json({
            status: 'success',
            results: suggestions.length,
            data: { suggestions }
        });
    } catch (err) {
        next(err);
    }
};

// ADMIN: lista pending
const getPendingSuggestions = async (req, res, next) => {
    try {
        const suggestions = await placeSuggestionService.getPendingSuggestions();

        res.status(200).json({
            status: 'success',
            results: suggestions.length,
            data: { suggestions }
        });
    } catch (err) {
        next(err);
    }
};

// ADMIN: approva suggerimento
const approveSuggestion = async (req, res, next) => {
    try {
        const place = await placeSuggestionService.approveSuggestion(req.params.id, req.user.uid);

        res.status(200).json({
            status: 'success',
            message: 'Luogo approvato e pubblicato',
            data: { place }
        });
    } catch (err) {
        next(err);
    }
};

// ADMIN: rifiuta suggerimento
const rejectSuggestion = async (req, res, next) => {
    try {
        await placeSuggestionService.rejectSuggestion(req.params.id, req.user.uid);

        res.status(200).json({
            status: 'success',
            message: 'Suggerimento rifiutato'
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createSuggestion,
    getMySuggestions,
    getPendingSuggestions,
    approveSuggestion,
    rejectSuggestion
};

const express = require('express');
const router = express.Router();
const placeSuggestionController = require('../controllers/placeSuggestion.controller');
const { verifyToken, requireAdmin } = require('../middlewares/auth.middleware');

// ============ ROUTES PROTETTE UTENTE ============

// POST /api/placeSuggestion - invio nuovo luogo
router.post('/', verifyToken, placeSuggestionController.createSuggestion);

// GET /api/placeSuggestion/me - suggerimenti inviati dall'utente
router.get('/me', verifyToken, placeSuggestionController.getMySuggestions);

// ============ ROUTES ADMIN ============

// GET /api/placeSuggestion - lista pending
router.get('/', verifyToken, requireAdmin, placeSuggestionController.getPendingSuggestions);

// POST /api/placeSuggestion/:id/approve - approvazione admin
router.post('/:id/approve', verifyToken, requireAdmin, placeSuggestionController.approveSuggestion);

// POST /api/placeSuggestion/:id/reject - rifiuto admin
router.post('/:id/reject', verifyToken, requireAdmin, placeSuggestionController.rejectSuggestion);

module.exports = router;

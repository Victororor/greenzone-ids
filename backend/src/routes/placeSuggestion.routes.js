const express = require('express');
const router = express.Router();

const suggestionController = require('../controllers/placeSuggestion.controller');
const { verifyToken, requireAdmin } = require('../middlewares/auth.middleware');

// Utente invia suggerimento
router.post('/', verifyToken, suggestionController.createSuggestion);

// Admin legge pending
router.get('/', verifyToken, requireAdmin, suggestionController.getPendingSuggestions);

// Admin approva
router.post('/:id/approve', verifyToken, requireAdmin, suggestionController.approveSuggestion);

// Admin rifiuta
router.post('/:id/reject', verifyToken, requireAdmin, suggestionController.rejectSuggestion);

module.exports = router;

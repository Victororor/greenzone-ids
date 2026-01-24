const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favorite.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// GET /api/favorites -> lista dei preferiti dell’utente loggato
router.get('/me', verifyToken, favoriteController.getMyFavorites);

// POST /api/favorites -> aggiungi un preferito
router.post('/placeId', verifyToken, favoriteController.addFavorite);

// DELETE /api/favorites/:placeId -> rimuovi preferito
router.delete('/:placeId', verifyToken, favoriteController.removeFavorite);

module.exports = router;

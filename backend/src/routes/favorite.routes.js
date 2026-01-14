/**
 * Favorite Routes
 * Gestione dei luoghi preferiti degli utenti
 */
const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favorite.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// ============ ROUTES PUBBLICHE ============

// GET /api/favorites/count/:placeId - Conta preferiti per un luogo
router.get('/count/:placeId', favoriteController.getFavoriteCount);

// ============ ROUTES PROTETTE (utente autenticato) ============

// GET /api/favorites - I miei preferiti (con dettagli luoghi)
router.get('/', verifyToken, favoriteController.getMyFavorites);

// GET /api/favorites/ids - Solo gli ID dei luoghi preferiti
router.get('/ids', verifyToken, favoriteController.getMyFavoriteIds);

// GET /api/favorites/check/:placeId - Verifica se un luogo è nei preferiti
router.get('/check/:placeId', verifyToken, favoriteController.checkFavorite);

// POST /api/favorites - Aggiunge un luogo ai preferiti
router.post('/', verifyToken, favoriteController.addFavorite);

// POST /api/favorites/toggle - Toggle preferito (aggiunge/rimuove)
router.post('/toggle', verifyToken, favoriteController.toggleFavorite);

// DELETE /api/favorites/:placeId - Rimuove dai preferiti tramite placeId
router.delete('/:placeId', verifyToken, favoriteController.removeFavorite);

// DELETE /api/favorites/id/:favoriteId - Rimuove dai preferiti tramite favoriteId
router.delete('/id/:favoriteId', verifyToken, favoriteController.removeFavoriteById);

module.exports = router;

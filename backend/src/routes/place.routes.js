/*
    Place CRUD Routes
    Gestione dei luoghi "bio" sulla mappa
*/
const express = require('express');
const router = express.Router();
const placeController = require('../controllers/place.controller');
const { verifyToken, requireAdmin, requirePlaceOwnerOrAdmin } = require('../middlewares/auth.middleware');

// ============ ROUTES PUBBLICHE ============

// GET /api/places - lista tutti i luoghi
router.get('/', placeController.getAllPlaces);

// GET /api/places/nearby - luoghi vicini (per la mappa)
// Query: ?lat=41.9028&lng=12.4964&radius=10
router.get('/nearby', placeController.getNearbyPlaces);

// GET /api/places/category/:category - luoghi per categoria
router.get('/category/:category', placeController.getPlacesByCategory);

// GET /api/places/user/:uid - luoghi creati da un utente
router.get('/user/:uid', placeController.getPlacesByUser);

// GET /api/places/:id - dettaglio singolo luogo
router.get('/:id', placeController.getPlaceById);

// ============ ROUTES PROTETTE ============

// POST /api/places - crea nuovo luogo (utente autenticato)
router.post('/', verifyToken, placeController.createPlace);

// PUT /api/places/:id - modifica luogo (owner o admin)
router.put('/:id', verifyToken, requirePlaceOwnerOrAdmin, placeController.updatePlace);

// DELETE /api/places/:id - soft delete (owner o admin)
router.delete('/:id', verifyToken, requirePlaceOwnerOrAdmin, placeController.softDeletePlace);

// ============ ROUTES ADMIN ONLY ============

// DELETE /api/places/:id/permanent - hard delete (solo admin)
router.delete('/:id/permanent', verifyToken, requireAdmin, placeController.hardDeletePlace);

// PATCH /api/places/:id/restore - ripristina luogo (solo admin)
router.patch('/:id/restore', verifyToken, requireAdmin, placeController.restorePlace);

module.exports = router;

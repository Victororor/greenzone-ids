/**
 * Admin Routes
 * Routes per la dashboard admin e operazioni amministrative
 * TUTTE le routes richiedono autenticazione + ruolo admin
 */
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { verifyToken, requireAdmin } = require('../middlewares/auth.middleware');

// Applica middleware a tutte le routes
router.use(verifyToken);
router.use(requireAdmin);

// ============ DASHBOARD ============

// GET /api/admin/dashboard - Statistiche generali
router.get('/dashboard', adminController.getDashboardStats);

// GET /api/admin/dashboard/recent - Attività recenti
router.get('/dashboard/recent', adminController.getRecentActivity);

// ============ GESTIONE UTENTI ============

// GET /api/admin/users - Lista utenti (filtri: isDeleted, ruolo)
router.get('/users', adminController.getAllUsers);

// GET /api/admin/users/search - Cerca utenti (query: q)
router.get('/users/search', adminController.searchUsers);

// GET /api/admin/users/:uid - Dettaglio utente
router.get('/users/:uid', adminController.getUserById);

// PUT /api/admin/users/:uid - Modifica utente
router.put('/users/:uid', adminController.updateUser);

// PATCH /api/admin/users/:uid/role - Cambia ruolo utente
router.patch('/users/:uid/role', adminController.changeUserRole);

// DELETE /api/admin/users/:uid/soft - Soft delete utente
router.delete('/users/:uid/soft', adminController.softDeleteUser);

// DELETE /api/admin/users/:uid/hard - Hard delete utente
router.delete('/users/:uid/hard', adminController.hardDeleteUser);

// POST /api/admin/users/:uid/restore - Ripristina utente
router.post('/users/:uid/restore', adminController.restoreUser);

// ============ GESTIONE LUOGHI ============

// GET /api/admin/places - Lista luoghi (filtri: isDeleted, isVerified, isActive, category)
router.get('/places', adminController.getAllPlaces);

// GET /api/admin/places/search - Cerca luoghi (query: q)
router.get('/places/search', adminController.searchPlaces);

// GET /api/admin/places/:id - Dettaglio luogo
router.get('/places/:id', adminController.getPlaceById);

// POST /api/admin/places - Crea luogo
router.post('/places', adminController.createPlace);

// PUT /api/admin/places/:id - Modifica luogo
router.put('/places/:id', adminController.updatePlace);

// PATCH /api/admin/places/:id/verify - Verifica/toglie verifica luogo
router.patch('/places/:id/verify', adminController.toggleVerification);

// DELETE /api/admin/places/:id/soft - Soft delete luogo
router.delete('/places/:id/soft', adminController.softDeletePlace);

// DELETE /api/admin/places/:id/hard - Hard delete luogo
router.delete('/places/:id/hard', adminController.hardDeletePlace);

// POST /api/admin/places/:id/restore - Ripristina luogo
router.post('/places/:id/restore', adminController.restorePlace);

// ============ GESTIONE SEGNALAZIONI ============

// GET /api/admin/reports - Lista segnalazioni (filtri: status, reason, placeId)
router.get('/reports', adminController.getAllReports);

// GET /api/admin/reports/stats - Statistiche segnalazioni
router.get('/reports/stats', adminController.getReportsStats);

// PATCH /api/admin/reports/:id - Gestisci segnalazione
router.patch('/reports/:id', adminController.handleReport);

// DELETE /api/admin/reports/:id - Elimina segnalazione
router.delete('/reports/:id', adminController.deleteReport);

module.exports = router;

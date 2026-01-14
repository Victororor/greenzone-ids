/**
 * Report Routes
 * Gestione delle segnalazioni dei luoghi
 */
const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const { verifyToken, requireAdmin } = require('../middlewares/auth.middleware');

// ============ ROUTES UTENTE AUTENTICATO ============

// POST /api/reports - Crea una nuova segnalazione
router.post('/', verifyToken, reportController.createReport);

// GET /api/reports/my - Le mie segnalazioni
router.get('/my', verifyToken, reportController.getMyReports);

// GET /api/reports/:id - Dettaglio segnalazione (propria o admin)
router.get('/:id', verifyToken, reportController.getReportById);

// ============ ROUTES ADMIN ONLY ============

// GET /api/reports - Lista tutte le segnalazioni
router.get('/', verifyToken, requireAdmin, reportController.getAllReports);

// GET /api/reports/pending - Segnalazioni in attesa
router.get('/pending', verifyToken, requireAdmin, reportController.getPendingReports);

// GET /api/reports/stats - Statistiche segnalazioni
router.get('/stats', verifyToken, requireAdmin, reportController.getReportsStats);

// GET /api/reports/place/:placeId - Segnalazioni per luogo
router.get('/place/:placeId', verifyToken, requireAdmin, reportController.getReportsByPlace);

// PATCH /api/reports/:id - Aggiorna stato segnalazione
router.patch('/:id', verifyToken, requireAdmin, reportController.updateReport);

// DELETE /api/reports/:id - Elimina segnalazione
router.delete('/:id', verifyToken, requireAdmin, reportController.deleteReport);

module.exports = router;

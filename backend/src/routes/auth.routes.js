/*
    Auth Routes
    - /api/auth/register - registra profilo utente (dopo signup Firebase)
    - /api/auth/verify - verifica sessione/token
    - /api/auth/logout - revoca token
    - /api/auth/set-role - imposta ruolo (admin only)
*/
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken, requireAdmin } = require('../middlewares/auth.middleware');

// POST /api/auth/register - registra profilo utente in Firestore
// Richiede token valido (utente ha già fatto signup su Firebase Auth)
router.post('/register', verifyToken, authController.register);

// GET /api/auth/verify - verifica token e restituisce dati utente
router.get('/verify', verifyToken, authController.verifySession);

// POST /api/auth/logout - revoca tutti i refresh token
router.post('/logout', verifyToken, authController.logout);

// POST /api/auth/set-role - imposta ruolo utente (solo admin)
router.post('/set-role', verifyToken, requireAdmin, authController.setUserRole);

module.exports = router;

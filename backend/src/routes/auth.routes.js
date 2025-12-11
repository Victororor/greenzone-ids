/*
    Auth Routes
    - /api/auth/signup - registrazione unificata (account + profilo)
    - /api/auth/login - login unificato (autenticazione + profilo)
    - /api/auth/refresh - rinnova token
    - /api/auth/register - registra profilo (legacy, richiede token)
    - /api/auth/verify - verifica sessione/token
    - /api/auth/logout - revoca token
    - /api/auth/set-role - imposta ruolo (admin only)
*/
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken, requireAdmin } = require('../middlewares/auth.middleware');

// POST /api/auth/signup - registrazione unificata (NO token richiesto)
// Crea account Firebase + profilo Firestore in un'unica chiamata
router.post('/signup', authController.signup);

// POST /api/auth/login - login unificato (NO token richiesto)
// Autentica e restituisce profilo + token
router.post('/login', authController.login);

// POST /api/auth/refresh - rinnova token usando refreshToken (NO token richiesto)
router.post('/refresh', authController.refresh);

// POST /api/auth/register - registra profilo utente in Firestore (legacy)
// Richiede token valido (utente ha già fatto signup su Firebase Auth)
router.post('/register', verifyToken, authController.register);

// GET /api/auth/verify - verifica token e restituisce dati utente
router.get('/verify', verifyToken, authController.verifySession);

// POST /api/auth/logout - revoca tutti i refresh token
router.post('/logout', verifyToken, authController.logout);

// POST /api/auth/set-role - imposta ruolo utente (solo admin)
router.post('/set-role', verifyToken, requireAdmin, authController.setUserRole);

module.exports = router;

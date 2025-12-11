/*
    User CRUD Routes
    Tutte le routes richiedono autenticazione
*/
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken, requireAdmin, requireSelfOrAdmin } = require('../middlewares/auth.middleware');

// GET /api/users/me - profilo utente corrente
router.get('/me', verifyToken, userController.getMe);

// GET /api/users - lista tutti gli utenti (solo admin)
router.get('/', verifyToken, requireAdmin, userController.getAllUsers);

// GET /api/users/:uid - dettaglio utente (self o admin)
router.get('/:uid', verifyToken, requireSelfOrAdmin, userController.getUserById);

// POST /api/users - crea profilo utente (alternativa a /auth/register)
router.post('/', verifyToken, userController.createUser);

// PUT /api/users/:uid - aggiorna utente (self o admin)
router.put('/:uid', verifyToken, requireSelfOrAdmin, userController.updateUser);

// DELETE /api/users/:uid - soft delete utente (self o admin)
router.delete('/:uid', verifyToken, requireSelfOrAdmin, userController.softDeleteUser);

// DELETE /api/users/:uid/hard - hard delete definitivo (solo admin)
router.delete('/:uid/hard', verifyToken, requireAdmin, userController.hardDeleteUser);

// POST /api/users/:uid/restore - ripristina utente soft-deleted (solo admin)
router.post('/:uid/restore', verifyToken, requireAdmin, userController.restoreUser);

module.exports = router;

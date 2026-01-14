/**
 * Admin Controller
 * Controller per la dashboard admin e operazioni amministrative
 */
const adminService = require('../services/admin.service');
const userService = require('../services/user.service');
const placeService = require('../services/place.service');
const reportService = require('../services/report.service');
const { AppError } = require('../utils/errorHandler');
const { z } = require('zod');

/**
 * GET /api/admin/dashboard
 * Ottiene statistiche generali per la dashboard
 */
const getDashboardStats = async (req, res, next) => {
    try {
        const stats = await adminService.getDashboardStats();

        res.status(200).json({
            status: 'success',
            data: { stats }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/admin/dashboard/recent
 * Ottiene attività recenti per la dashboard
 */
const getRecentActivity = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 10;

        const [recentPlaces, recentUsers, recentReports] = await Promise.all([
            adminService.getRecentPlaces(limit),
            adminService.getRecentUsers(limit),
            adminService.getRecentReports(limit)
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                recentPlaces,
                recentUsers,
                recentReports
            }
        });
    } catch (error) {
        next(error);
    }
};

// ============ GESTIONE UTENTI ============

/**
 * GET /api/admin/users
 * Lista tutti gli utenti con filtri
 */
const getAllUsers = async (req, res, next) => {
    try {
        const filters = {
            isDeleted: req.query.isDeleted === 'true' ? true :
                req.query.isDeleted === 'false' ? false : undefined,
            ruolo: req.query.ruolo
        };

        const users = await adminService.getAllUsersAdmin(filters);

        res.status(200).json({
            status: 'success',
            results: users.length,
            data: { users }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/admin/users/search
 * Cerca utenti per email o nome
 */
const searchUsers = async (req, res, next) => {
    try {
        const { q } = req.query;

        if (!q || q.length < 2) {
            return next(new AppError('Termine di ricerca troppo corto (minimo 2 caratteri)', 400));
        }

        const users = await adminService.searchUsers(q);

        res.status(200).json({
            status: 'success',
            results: users.length,
            data: { users }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/admin/users/:uid
 * Dettaglio utente
 */
const getUserById = async (req, res, next) => {
    try {
        const { uid } = req.params;
        const user = await userService.getUserById(uid, true); // include deleted

        res.status(200).json({
            status: 'success',
            data: { user }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * PUT /api/admin/users/:uid
 * Modifica utente
 */
const updateUser = async (req, res, next) => {
    try {
        const { uid } = req.params;
        const user = await userService.updateUser(uid, req.body);

        res.status(200).json({
            status: 'success',
            message: 'Utente aggiornato con successo',
            data: { user }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * DELETE /api/admin/users/:uid/soft
 * Soft delete utente
 */
const softDeleteUser = async (req, res, next) => {
    try {
        const { uid } = req.params;

        // Non permettere di eliminare se stessi
        if (uid === req.user.uid) {
            return next(new AppError('Non puoi eliminare il tuo stesso account da qui', 400));
        }

        const result = await userService.softDeleteUser(uid);

        res.status(200).json({
            status: 'success',
            message: result.message
        });
    } catch (error) {
        next(error);
    }
};

/**
 * DELETE /api/admin/users/:uid/hard
 * Hard delete utente
 */
const hardDeleteUser = async (req, res, next) => {
    try {
        const { uid } = req.params;

        // Non permettere di eliminare se stessi
        if (uid === req.user.uid) {
            return next(new AppError('Non puoi eliminare il tuo stesso account', 400));
        }

        const result = await userService.hardDeleteUser(uid);

        res.status(200).json({
            status: 'success',
            message: result.message
        });
    } catch (error) {
        next(error);
    }
};

/**
 * POST /api/admin/users/:uid/restore
 * Ripristina utente eliminato
 */
const restoreUser = async (req, res, next) => {
    try {
        const { uid } = req.params;
        const user = await userService.restoreUser(uid);

        res.status(200).json({
            status: 'success',
            message: 'Utente ripristinato con successo',
            data: { user }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * PATCH /api/admin/users/:uid/role
 * Cambia ruolo utente
 */
const changeUserRole = async (req, res, next) => {
    try {
        const { uid } = req.params;
        const { ruolo } = req.body;

        if (!ruolo || !['user', 'admin'].includes(ruolo)) {
            return next(new AppError('Ruolo non valido. Valori: user, admin', 400));
        }

        // Non permettere di cambiare il proprio ruolo
        if (uid === req.user.uid) {
            return next(new AppError('Non puoi cambiare il tuo stesso ruolo', 400));
        }

        const user = await userService.updateUser(uid, { ruolo });

        res.status(200).json({
            status: 'success',
            message: `Ruolo utente cambiato a "${ruolo}"`,
            data: { user }
        });
    } catch (error) {
        next(error);
    }
};

// ============ GESTIONE LUOGHI ============

/**
 * GET /api/admin/places
 * Lista tutti i luoghi con filtri (inclusi eliminati)
 */
const getAllPlaces = async (req, res, next) => {
    try {
        const filters = {
            isDeleted: req.query.isDeleted === 'true' ? true :
                req.query.isDeleted === 'false' ? false : undefined,
            isVerified: req.query.isVerified === 'true' ? true :
                req.query.isVerified === 'false' ? false : undefined,
            isActive: req.query.isActive === 'true' ? true :
                req.query.isActive === 'false' ? false : undefined,
            category: req.query.category
        };

        const places = await adminService.getAllPlacesAdmin(filters);

        res.status(200).json({
            status: 'success',
            results: places.length,
            data: { places }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/admin/places/search
 * Cerca luoghi per nome o indirizzo
 */
const searchPlaces = async (req, res, next) => {
    try {
        const { q } = req.query;

        if (!q || q.length < 2) {
            return next(new AppError('Termine di ricerca troppo corto (minimo 2 caratteri)', 400));
        }

        const places = await adminService.searchPlaces(q);

        res.status(200).json({
            status: 'success',
            results: places.length,
            data: { places }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/admin/places/:id
 * Dettaglio luogo (anche eliminati)
 */
const getPlaceById = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Accesso diretto al documento per vedere anche eliminati
        const { db } = require('../config/firebase');
        const doc = await db.collection('places').doc(id).get();

        if (!doc.exists) {
            return next(new AppError('Luogo non trovato', 404));
        }

        res.status(200).json({
            status: 'success',
            data: {
                place: {
                    id: doc.id,
                    ...doc.data()
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * POST /api/admin/places
 * Crea un nuovo luogo (come admin)
 */
const createPlace = async (req, res, next) => {
    try {
        const place = await placeService.createPlace(req.body, req.user.uid);

        res.status(201).json({
            status: 'success',
            message: 'Luogo creato con successo',
            data: { place }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * PUT /api/admin/places/:id
 * Modifica luogo
 */
const updatePlace = async (req, res, next) => {
    try {
        const { id } = req.params;
        const place = await placeService.updatePlace(id, req.body);

        res.status(200).json({
            status: 'success',
            message: 'Luogo aggiornato con successo',
            data: { place }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * PATCH /api/admin/places/:id/verify
 * Verifica/toglie verifica a un luogo
 */
const toggleVerification = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { isVerified } = req.body;

        if (typeof isVerified !== 'boolean') {
            return next(new AppError('isVerified deve essere un booleano', 400));
        }

        const place = await adminService.togglePlaceVerification(id, isVerified);

        res.status(200).json({
            status: 'success',
            message: isVerified ? 'Luogo verificato' : 'Verifica rimossa',
            data: { place }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * DELETE /api/admin/places/:id/soft
 * Soft delete luogo
 */
const softDeletePlace = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await placeService.softDeletePlace(id);

        res.status(200).json({
            status: 'success',
            message: result.message
        });
    } catch (error) {
        next(error);
    }
};

/**
 * DELETE /api/admin/places/:id/hard
 * Hard delete luogo
 */
const hardDeletePlace = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await placeService.hardDeletePlace(id);

        res.status(200).json({
            status: 'success',
            message: result.message
        });
    } catch (error) {
        next(error);
    }
};

/**
 * POST /api/admin/places/:id/restore
 * Ripristina luogo eliminato
 */
const restorePlace = async (req, res, next) => {
    try {
        const { id } = req.params;
        const place = await placeService.restorePlace(id);

        res.status(200).json({
            status: 'success',
            message: 'Luogo ripristinato con successo',
            data: { place }
        });
    } catch (error) {
        next(error);
    }
};

// ============ GESTIONE SEGNALAZIONI ============

/**
 * GET /api/admin/reports
 * Lista tutte le segnalazioni
 */
const getAllReports = async (req, res, next) => {
    try {
        const filters = {
            status: req.query.status,
            reason: req.query.reason,
            placeId: req.query.placeId
        };

        const reports = await reportService.getAllReports(filters);

        res.status(200).json({
            status: 'success',
            results: reports.length,
            data: { reports }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/admin/reports/stats
 * Statistiche segnalazioni
 */
const getReportsStats = async (req, res, next) => {
    try {
        const stats = await reportService.getReportsStats();

        res.status(200).json({
            status: 'success',
            data: { stats }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * PATCH /api/admin/reports/:id
 * Gestisci segnalazione (cambia stato, aggiungi note)
 */
const handleReport = async (req, res, next) => {
    try {
        const { id } = req.params;
        const report = await reportService.updateReportStatus(id, req.body, req.user.uid);

        res.status(200).json({
            status: 'success',
            message: 'Segnalazione aggiornata',
            data: { report }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * DELETE /api/admin/reports/:id
 * Elimina segnalazione
 */
const deleteReport = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await reportService.deleteReport(id);

        res.status(200).json({
            status: 'success',
            message: result.message
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    // Dashboard
    getDashboardStats,
    getRecentActivity,
    // Users
    getAllUsers,
    searchUsers,
    getUserById,
    updateUser,
    softDeleteUser,
    hardDeleteUser,
    restoreUser,
    changeUserRole,
    // Places
    getAllPlaces,
    searchPlaces,
    getPlaceById,
    createPlace,
    updatePlace,
    toggleVerification,
    softDeletePlace,
    hardDeletePlace,
    restorePlace,
    // Reports
    getAllReports,
    getReportsStats,
    handleReport,
    deleteReport
};

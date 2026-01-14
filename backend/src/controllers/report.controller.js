/**
 * Report Controller
 * Gestisce le richieste HTTP per le segnalazioni
 */
const reportService = require('../services/report.service');
const { AppError } = require('../utils/errorHandler');
const { z } = require('zod');

// Schema di validazione per la creazione di una segnalazione
const createReportSchema = z.object({
    placeId: z.string().min(1, 'ID luogo richiesto'),
    reason: z.enum(reportService.VALID_REASONS, {
        errorMap: () => ({ message: `Motivo non valido. Valori: ${reportService.VALID_REASONS.join(', ')}` })
    }),
    description: z.string().max(1000, 'Descrizione troppo lunga (max 1000 caratteri)').optional()
});

// Schema di validazione per l'aggiornamento dello stato
const updateReportSchema = z.object({
    status: z.enum(reportService.VALID_STATUSES, {
        errorMap: () => ({ message: `Status non valido. Valori: ${reportService.VALID_STATUSES.join(', ')}` })
    }).optional(),
    adminNotes: z.string().max(1000, 'Note troppo lunghe (max 1000 caratteri)').optional()
}).refine(data => data.status || data.adminNotes !== undefined, {
    message: 'Almeno uno tra status e adminNotes deve essere fornito'
});

/**
 * POST /api/reports
 * Crea una nuova segnalazione (utente autenticato)
 */
const createReport = async (req, res, next) => {
    try {
        const validatedData = createReportSchema.parse(req.body);
        const userId = req.user.uid;

        const report = await reportService.createReport(validatedData, userId);

        res.status(201).json({
            status: 'success',
            message: 'Segnalazione inviata con successo',
            data: { report }
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return next(new AppError(error.errors[0].message, 400));
        }
        next(error);
    }
};

/**
 * GET /api/reports
 * Lista tutte le segnalazioni (solo admin)
 * Query params: status, reason, placeId
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
 * GET /api/reports/pending
 * Lista segnalazioni in attesa (solo admin)
 */
const getPendingReports = async (req, res, next) => {
    try {
        const reports = await reportService.getPendingReports();

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
 * GET /api/reports/stats
 * Statistiche segnalazioni (solo admin)
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
 * GET /api/reports/my
 * Le mie segnalazioni (utente autenticato)
 */
const getMyReports = async (req, res, next) => {
    try {
        const userId = req.user.uid;
        const reports = await reportService.getReportsByUser(userId);

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
 * GET /api/reports/place/:placeId
 * Segnalazioni per un luogo specifico (solo admin)
 */
const getReportsByPlace = async (req, res, next) => {
    try {
        const { placeId } = req.params;
        const reports = await reportService.getReportsByPlace(placeId);

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
 * GET /api/reports/:id
 * Dettaglio singola segnalazione
 */
const getReportById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const report = await reportService.getReportById(id);

        // Se non è admin, può vedere solo le proprie segnalazioni
        if (req.user.role !== 'admin' && report.reportedBy !== req.user.uid) {
            return next(new AppError('Accesso negato', 403));
        }

        res.status(200).json({
            status: 'success',
            data: { report }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * PATCH /api/reports/:id
 * Aggiorna stato segnalazione (solo admin)
 */
const updateReport = async (req, res, next) => {
    try {
        const { id } = req.params;
        const validatedData = updateReportSchema.parse(req.body);
        const adminId = req.user.uid;

        const report = await reportService.updateReportStatus(id, validatedData, adminId);

        res.status(200).json({
            status: 'success',
            message: 'Segnalazione aggiornata con successo',
            data: { report }
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return next(new AppError(error.errors[0].message, 400));
        }
        next(error);
    }
};

/**
 * DELETE /api/reports/:id
 * Elimina segnalazione (solo admin)
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
    createReport,
    getAllReports,
    getPendingReports,
    getReportsStats,
    getMyReports,
    getReportsByPlace,
    getReportById,
    updateReport,
    deleteReport
};

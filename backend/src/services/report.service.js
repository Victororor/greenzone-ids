/**
 * Report Service
 * Gestisce le segnalazioni dei luoghi da parte degli utenti
 */
const { db } = require('../config/firebase');
const { AppError } = require('../utils/errorHandler');
const admin = require('firebase-admin');

const COLLECTION_NAME = 'reports';
const PLACES_COLLECTION = 'places';

/**
 * Motivi validi per una segnalazione
 */
const VALID_REASONS = [
    'closed',           // Luogo chiuso definitivamente
    'incorrect_info',   // Informazioni non corrette
    'not_green',        // Non è realmente un luogo green/bio
    'spam',             // Spam o pubblicità
    'inappropriate',    // Contenuto inappropriato
    'duplicate',        // Luogo duplicato
    'other'             // Altro motivo
];

/**
 * Stati possibili di una segnalazione
 */
const VALID_STATUSES = ['pending', 'reviewed', 'resolved', 'dismissed'];

/**
 * Crea una nuova segnalazione per un luogo
 */
const createReport = async (reportData, userId) => {
    const { placeId, reason, description } = reportData;

    // Verifica che il luogo esista
    const placeDoc = await db.collection(PLACES_COLLECTION).doc(placeId).get();
    if (!placeDoc.exists) {
        throw new AppError('Luogo non trovato', 404);
    }

    const placeData = placeDoc.data();
    if (placeData.isDeleted) {
        throw new AppError('Impossibile segnalare un luogo eliminato', 400);
    }

    // Verifica che l'utente non abbia già segnalato questo luogo con lo stesso motivo (pending)
    const existingReport = await db.collection(COLLECTION_NAME)
        .where('placeId', '==', placeId)
        .where('reportedBy', '==', userId)
        .where('reason', '==', reason)
        .where('status', '==', 'pending')
        .get();

    if (!existingReport.empty) {
        throw new AppError('Hai già una segnalazione in attesa per questo luogo con lo stesso motivo', 409);
    }

    const newReport = {
        placeId,
        placeName: placeData.name, // Salva il nome per riferimento rapido
        reason,
        description: description || '',
        reportedBy: userId,
        status: 'pending',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        reviewedBy: null,
        reviewedAt: null,
        adminNotes: null
    };

    const docRef = await db.collection(COLLECTION_NAME).add(newReport);

    return {
        id: docRef.id,
        ...newReport,
        createdAt: new Date(),
        updatedAt: new Date()
    };
};

/**
 * Ottiene tutte le segnalazioni (per admin)
 * Supporta filtri per status, reason, placeId
 */
const getAllReports = async (filters = {}) => {
    let query = db.collection(COLLECTION_NAME);

    // Filtro per status
    if (filters.status) {
        if (!VALID_STATUSES.includes(filters.status)) {
            throw new AppError(`Status non valido. Valori: ${VALID_STATUSES.join(', ')}`, 400);
        }
        query = query.where('status', '==', filters.status);
    }

    // Filtro per reason
    if (filters.reason) {
        if (!VALID_REASONS.includes(filters.reason)) {
            throw new AppError(`Motivo non valido. Valori: ${VALID_REASONS.join(', ')}`, 400);
        }
        query = query.where('reason', '==', filters.reason);
    }

    // Filtro per placeId
    if (filters.placeId) {
        query = query.where('placeId', '==', filters.placeId);
    }

    // Ordina per data creazione (più recenti prima)
    query = query.orderBy('createdAt', 'desc');

    const snapshot = await query.get();

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
};

/**
 * Ottiene le segnalazioni in pending (per dashboard admin)
 */
const getPendingReports = async () => {
    const snapshot = await db.collection(COLLECTION_NAME)
        .where('status', '==', 'pending')
        .orderBy('createdAt', 'desc')
        .get();

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
};

/**
 * Ottiene una segnalazione per ID
 */
const getReportById = async (reportId) => {
    const doc = await db.collection(COLLECTION_NAME).doc(reportId).get();

    if (!doc.exists) {
        throw new AppError('Segnalazione non trovata', 404);
    }

    return {
        id: doc.id,
        ...doc.data()
    };
};

/**
 * Ottiene le segnalazioni fatte da un utente specifico
 */
const getReportsByUser = async (userId) => {
    const snapshot = await db.collection(COLLECTION_NAME)
        .where('reportedBy', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
};

/**
 * Ottiene le segnalazioni per un luogo specifico
 */
const getReportsByPlace = async (placeId) => {
    const snapshot = await db.collection(COLLECTION_NAME)
        .where('placeId', '==', placeId)
        .orderBy('createdAt', 'desc')
        .get();

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
};

/**
 * Aggiorna lo stato di una segnalazione (solo admin)
 */
const updateReportStatus = async (reportId, updateData, adminId) => {
    const docRef = db.collection(COLLECTION_NAME).doc(reportId);
    const doc = await docRef.get();

    if (!doc.exists) {
        throw new AppError('Segnalazione non trovata', 404);
    }

    const { status, adminNotes } = updateData;

    if (status && !VALID_STATUSES.includes(status)) {
        throw new AppError(`Status non valido. Valori: ${VALID_STATUSES.join(', ')}`, 400);
    }

    const updates = {
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    if (status) {
        updates.status = status;
        updates.reviewedBy = adminId;
        updates.reviewedAt = admin.firestore.FieldValue.serverTimestamp();
    }

    if (adminNotes !== undefined) {
        updates.adminNotes = adminNotes;
    }

    await docRef.update(updates);

    const updated = await docRef.get();
    return {
        id: updated.id,
        ...updated.data()
    };
};

/**
 * Elimina una segnalazione (solo admin)
 */
const deleteReport = async (reportId) => {
    const docRef = db.collection(COLLECTION_NAME).doc(reportId);
    const doc = await docRef.get();

    if (!doc.exists) {
        throw new AppError('Segnalazione non trovata', 404);
    }

    await docRef.delete();

    return { message: 'Segnalazione eliminata con successo' };
};

/**
 * Ottiene statistiche sulle segnalazioni (per dashboard admin)
 */
const getReportsStats = async () => {
    const snapshot = await db.collection(COLLECTION_NAME).get();

    const stats = {
        total: 0,
        pending: 0,
        reviewed: 0,
        resolved: 0,
        dismissed: 0,
        byReason: {}
    };

    // Inizializza contatori per ogni reason
    VALID_REASONS.forEach(reason => {
        stats.byReason[reason] = 0;
    });

    snapshot.docs.forEach(doc => {
        const data = doc.data();
        stats.total++;

        // Conta per status
        if (stats[data.status] !== undefined) {
            stats[data.status]++;
        }

        // Conta per reason
        if (data.reason && stats.byReason[data.reason] !== undefined) {
            stats.byReason[data.reason]++;
        }
    });

    return stats;
};

module.exports = {
    createReport,
    getAllReports,
    getPendingReports,
    getReportById,
    getReportsByUser,
    getReportsByPlace,
    updateReportStatus,
    deleteReport,
    getReportsStats,
    VALID_REASONS,
    VALID_STATUSES
};

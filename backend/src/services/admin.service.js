/**
 * Admin Service
 * Servizi specifici per la dashboard admin
 */
const { db, auth } = require('../config/firebase');
const { AppError } = require('../utils/errorHandler');
const admin = require('firebase-admin');

const USERS_COLLECTION = 'users';
const PLACES_COLLECTION = 'places';
const REPORTS_COLLECTION = 'reports';

/**
 * Ottiene statistiche generali per la dashboard admin
 */
const getDashboardStats = async () => {
    // Conta utenti
    const usersSnapshot = await db.collection(USERS_COLLECTION).get();
    let totalUsers = 0;
    let activeUsers = 0;
    let deletedUsers = 0;
    let adminUsers = 0;

    usersSnapshot.docs.forEach(doc => {
        const data = doc.data();
        totalUsers++;
        if (data.isDeleted) {
            deletedUsers++;
        } else {
            activeUsers++;
            if (data.ruolo === 'admin') {
                adminUsers++;
            }
        }
    });

    // Conta luoghi
    const placesSnapshot = await db.collection(PLACES_COLLECTION).get();
    let totalPlaces = 0;
    let activePlaces = 0;
    let deletedPlaces = 0;
    let verifiedPlaces = 0;
    const placesByCategory = {};

    placesSnapshot.docs.forEach(doc => {
        const data = doc.data();
        totalPlaces++;
        if (data.isDeleted) {
            deletedPlaces++;
        } else {
            activePlaces++;
            if (data.isVerified) {
                verifiedPlaces++;
            }
            // Conta per categoria
            const category = data.category || 'other';
            placesByCategory[category] = (placesByCategory[category] || 0) + 1;
        }
    });

    // Conta segnalazioni
    const reportsSnapshot = await db.collection(REPORTS_COLLECTION).get();
    let totalReports = 0;
    let pendingReports = 0;
    let resolvedReports = 0;

    reportsSnapshot.docs.forEach(doc => {
        const data = doc.data();
        totalReports++;
        if (data.status === 'pending') {
            pendingReports++;
        } else if (data.status === 'resolved') {
            resolvedReports++;
        }
    });

    return {
        users: {
            total: totalUsers,
            active: activeUsers,
            deleted: deletedUsers,
            admins: adminUsers
        },
        places: {
            total: totalPlaces,
            active: activePlaces,
            deleted: deletedPlaces,
            verified: verifiedPlaces,
            byCategory: placesByCategory
        },
        reports: {
            total: totalReports,
            pending: pendingReports,
            resolved: resolvedReports
        }
    };
};

/**
 * Ottiene tutti i luoghi inclusi quelli eliminati (per admin)
 */
const getAllPlacesAdmin = async (filters = {}) => {
    let query = db.collection(PLACES_COLLECTION);

    // Filtro per stato eliminazione
    if (filters.isDeleted !== undefined) {
        query = query.where('isDeleted', '==', filters.isDeleted);
    }

    // Filtro per verifica
    if (filters.isVerified !== undefined) {
        query = query.where('isVerified', '==', filters.isVerified);
    }

    // Filtro per categoria
    if (filters.category) {
        query = query.where('category', '==', filters.category);
    }

    // Filtro per stato attivo
    if (filters.isActive !== undefined) {
        query = query.where('isActive', '==', filters.isActive);
    }

    const snapshot = await query.get();

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
};

/**
 * Verifica/toglie verifica a un luogo
 */
const togglePlaceVerification = async (placeId, isVerified) => {
    const docRef = db.collection(PLACES_COLLECTION).doc(placeId);
    const doc = await docRef.get();

    if (!doc.exists) {
        throw new AppError('Luogo non trovato', 404);
    }

    await docRef.update({
        isVerified: isVerified,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    const updated = await docRef.get();
    return {
        id: updated.id,
        ...updated.data()
    };
};

/**
 * Ottiene tutti gli utenti con informazioni estese (per admin)
 */
const getAllUsersAdmin = async (filters = {}) => {
    let query = db.collection(USERS_COLLECTION);

    // Filtro per stato eliminazione
    if (filters.isDeleted !== undefined) {
        query = query.where('isDeleted', '==', filters.isDeleted);
    }

    // Filtro per ruolo
    if (filters.ruolo) {
        query = query.where('ruolo', '==', filters.ruolo);
    }

    const snapshot = await query.get();
    const users = [];

    for (const doc of snapshot.docs) {
        const userData = doc.data();

        // Conta i luoghi creati dall'utente
        const placesSnapshot = await db.collection(PLACES_COLLECTION)
            .where('createdBy', '==', doc.id)
            .where('isDeleted', '==', false)
            .get();

        // Conta le segnalazioni fatte dall'utente
        const reportsSnapshot = await db.collection(REPORTS_COLLECTION)
            .where('reportedBy', '==', doc.id)
            .get();

        users.push({
            ...userData,
            placesCount: placesSnapshot.size,
            reportsCount: reportsSnapshot.size
        });
    }

    return users;
};

/**
 * Ottiene i luoghi creati recentemente (per dashboard)
 */
const getRecentPlaces = async (limit = 10) => {
    const snapshot = await db.collection(PLACES_COLLECTION)
        .where('isDeleted', '==', false)
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .get();

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
};

/**
 * Ottiene gli utenti registrati recentemente (per dashboard)
 */
const getRecentUsers = async (limit = 10) => {
    const snapshot = await db.collection(USERS_COLLECTION)
        .where('isDeleted', '==', false)
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .get();

    return snapshot.docs.map(doc => ({
        ...doc.data()
    }));
};

/**
 * Ottiene le segnalazioni recenti (per dashboard)
 */
const getRecentReports = async (limit = 10) => {
    const snapshot = await db.collection(REPORTS_COLLECTION)
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .get();

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
};

/**
 * Cerca utenti per email o nome
 */
const searchUsers = async (searchTerm) => {
    // Firestore non supporta ricerca full-text, quindi recuperiamo tutti e filtriamo
    const snapshot = await db.collection(USERS_COLLECTION)
        .where('isDeleted', '==', false)
        .get();

    const searchLower = searchTerm.toLowerCase();

    return snapshot.docs
        .map(doc => doc.data())
        .filter(user =>
            user.email.toLowerCase().includes(searchLower) ||
            user.nome.toLowerCase().includes(searchLower) ||
            user.cognome.toLowerCase().includes(searchLower)
        );
};

/**
 * Cerca luoghi per nome o indirizzo
 */
const searchPlaces = async (searchTerm) => {
    const snapshot = await db.collection(PLACES_COLLECTION)
        .where('isDeleted', '==', false)
        .get();

    const searchLower = searchTerm.toLowerCase();

    return snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(place =>
            place.name.toLowerCase().includes(searchLower) ||
            (place.location?.address && place.location.address.toLowerCase().includes(searchLower)) ||
            (place.location?.city && place.location.city.toLowerCase().includes(searchLower))
        );
};

module.exports = {
    getDashboardStats,
    getAllPlacesAdmin,
    togglePlaceVerification,
    getAllUsersAdmin,
    getRecentPlaces,
    getRecentUsers,
    getRecentReports,
    searchUsers,
    searchPlaces
};

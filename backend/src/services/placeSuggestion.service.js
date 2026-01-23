const { db } = require('../config/firebase');
const { AppError } = require('../utils/errorHandler');

const COLLECTION = 'placeSuggestion';
const PLACES_COLLECTION = 'places';

// UTENTE crea suggerimento
const createSuggestion = async (data, userId) => {
    const payload = {
        name: data.name,
        description: data.description || null,
        category: data.category || null,
        location: data.location || null,
        contact: data.contact || null,
        openingHours: data.openingHours || null,
        tags: data.tags || null,

        status: 'pending',
        submittedBy: userId,
        reviewedBy: null,
        reviewedAt: null,

        createdAt: new Date(),
        updatedAt: new Date()
    };

    const doc = await db.collection(COLLECTION).add(payload);
    return { id: doc.id, ...payload };
};

// UTENTE recupera i suoi suggerimenti
const getSuggestionsByUser = async (userId) => {
    const snap = await db.collection(COLLECTION)
        .where('submittedBy', '==', userId)
        .get();

    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// ADMIN lista pending
const getPendingSuggestions = async () => {
    const snap = await db.collection(COLLECTION)
        .where('status', '==', 'pending')
        .get();

    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// ADMIN approva -> sposta in `places`
const approveSuggestion = async (id, adminUid) => {
    const doc = await db.collection(COLLECTION).doc(id).get();
    if (!doc.exists) throw new AppError('Suggerimento non trovato', 404);

    const suggestion = doc.data();
    if (suggestion.status !== 'pending') throw new AppError('Suggerimento già processato', 400);

    // crea place finale
    const newPlace = {
        name: suggestion.name,
        description: suggestion.description || '',
        location: suggestion.location,
        contact: suggestion.contact || {},
        category: suggestion.category,

        tags: suggestion.tags || [],
        rating: 0,
        reviewsCount: 0,

        createdBy: suggestion.submittedBy,
        createdAt: new Date(),
        updatedAt: new Date(),

        isActive: true,
        isVerified: false,
        isDeleted: false,
        deletedAt: null
    };

    const created = await db.collection(PLACES_COLLECTION).add(newPlace);

    // aggiorna suggestion
    await db.collection(COLLECTION).doc(id).update({
        status: 'approved',
        reviewedBy: adminUid,
        reviewedAt: new Date(),
        updatedAt: new Date()
    });

    return { id: created.id, ...newPlace };
};

// ADMIN rifiuta
const rejectSuggestion = async (id, adminUid) => {
    const doc = await db.collection(COLLECTION).doc(id).get();
    if (!doc.exists) throw new AppError('Suggerimento non trovato', 404);

    await db.collection(COLLECTION).doc(id).update({
        status: 'rejected',
        reviewedBy: adminUid,
        reviewedAt: new Date(),
        updatedAt: new Date()
    });
};

module.exports = {
    createSuggestion,
    getSuggestionsByUser,
    getPendingSuggestions,
    approveSuggestion,
    rejectSuggestion
};

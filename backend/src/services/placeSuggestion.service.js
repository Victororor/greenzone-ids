const { db, admin } = require('../config/firebase');
const { AppError } = require('../utils/errorHandler');

const COLLECTION_NAME = 'placeSuggestion';

/**
 * Crea una nuova segnalazione luogo (utente)
 */
const createSuggestion = async (data, submittedBy) => {
    const suggestion = {
        name: data.name,
        description: data.description || '',
        category: data.category,
        location: {
            latitude: data.location.latitude,
            longitude: data.location.longitude,
            address: data.location.address || '',
            city: data.location.city || '',
            country: data.location.country || ''
        },
        tags: data.tags || null,
        contact: data.contact || null,
        openingHours: data.openingHours || null,
        submittedBy,
        status: 'pending',
        reviewedBy: null,
        reviewedAt: null,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection(COLLECTION_NAME).add(suggestion);

    return { id: docRef.id, ...suggestion };
};

/**
 * Prende tutte le segnalazioni pending (solo admin)
 */
const getPendingSuggestions = async () => {
    const snapshot = await db.collection(COLLECTION_NAME)
        .where('status', '==', 'pending')
        .get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/**
 * Approva una segnalazione e crea un place vero
 */
const approveSuggestion = async (id, adminUid) => {
    const suggestionRef = db.collection(COLLECTION_NAME).doc(id);
    const snap = await suggestionRef.get();

    if (!snap.exists) throw new AppError('Segnalazione non trovata', 404);

    const suggestion = snap.data();

    // crea un luogo nella collezione places
    const place = {
        name: suggestion.name,
        description: suggestion.description,
        category: suggestion.category,
        location: suggestion.location,
        tags: suggestion.tags || [],
        contact: suggestion.contact || {},
        openingHours: suggestion.openingHours || null,
        rating: 0,
        reviewsCount: 0,
        createdBy: suggestion.submittedBy,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        isVerified: false,
        isActive: true,
        isDeleted: false,
        deletedAt: null
    };

    await db.collection('places').add(place);

    // aggiorna la segnalazione come approvata
    await suggestionRef.update({
        status: 'approved',
        reviewedBy: adminUid,
        reviewedAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { message: 'Segnalazione approvata e luogo creato' };
};

/**
 * Rifiuta una segnalazione
 */
const rejectSuggestion = async (id, adminUid) => {
    const suggestionRef = db.collection(COLLECTION_NAME).doc(id);
    const snap = await suggestionRef.get();

    if (!snap.exists) throw new AppError('Segnalazione non trovata', 404);

    await suggestionRef.update({
        status: 'rejected',
        reviewedBy: adminUid,
        reviewedAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { message: 'Segnalazione rifiutata' };
};

module.exports = {
    createSuggestion,
    getPendingSuggestions,
    approveSuggestion,
    rejectSuggestion
};

/**
 * Favorite Service
 * Gestisce i luoghi preferiti degli utenti
 */
const { db } = require('../config/firebase');
const { AppError } = require('../utils/errorHandler');
const admin = require('firebase-admin');

const COLLECTION_NAME = 'favorites';
const PLACES_COLLECTION = 'places';
const USERS_COLLECTION = 'users';

/**
 * Aggiunge un luogo ai preferiti dell'utente
 */
const addFavorite = async (userId, placeId) => {
    // Verifica che il luogo esista e sia attivo
    const placeDoc = await db.collection(PLACES_COLLECTION).doc(placeId).get();

    if (!placeDoc.exists) {
        throw new AppError('Luogo non trovato', 404);
    }

    const placeData = placeDoc.data();

    if (placeData.isDeleted) {
        throw new AppError('Impossibile aggiungere ai preferiti un luogo eliminato', 400);
    }

    // Verifica se il preferito esiste già
    const existingFavorite = await db.collection(COLLECTION_NAME)
        .where('userId', '==', userId)
        .where('placeId', '==', placeId)
        .get();

    if (!existingFavorite.empty) {
        throw new AppError('Luogo già presente nei preferiti', 409);
    }

    // Crea il preferito
    const favorite = {
        userId,
        placeId,
        placeName: placeData.name,
        placeCategory: placeData.category,
        placeCity: placeData.location?.city || '',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection(COLLECTION_NAME).add(favorite);

    return {
        id: docRef.id,
        ...favorite,
        createdAt: new Date()
    };
};

/**
 * Rimuove un luogo dai preferiti dell'utente
 */
const removeFavorite = async (userId, placeId) => {
    // Trova il preferito
    const favoriteQuery = await db.collection(COLLECTION_NAME)
        .where('userId', '==', userId)
        .where('placeId', '==', placeId)
        .get();

    if (favoriteQuery.empty) {
        throw new AppError('Preferito non trovato', 404);
    }

    // Elimina il preferito
    const favoriteDoc = favoriteQuery.docs[0];
    await favoriteDoc.ref.delete();

    return { message: 'Luogo rimosso dai preferiti' };
};

/**
 * Rimuove un preferito per ID
 */
const removeFavoriteById = async (userId, favoriteId) => {
    const favoriteRef = db.collection(COLLECTION_NAME).doc(favoriteId);
    const favoriteDoc = await favoriteRef.get();

    if (!favoriteDoc.exists) {
        throw new AppError('Preferito non trovato', 404);
    }

    const favoriteData = favoriteDoc.data();

    // Verifica che il preferito appartenga all'utente
    if (favoriteData.userId !== userId) {
        throw new AppError('Non autorizzato a rimuovere questo preferito', 403);
    }

    await favoriteRef.delete();

    return { message: 'Luogo rimosso dai preferiti' };
};

/**
 * Ottiene tutti i preferiti di un utente
 */
const getUserFavorites = async (userId) => {
    const snapshot = await db.collection(COLLECTION_NAME)
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();

    const favorites = [];

    for (const doc of snapshot.docs) {
        const favoriteData = doc.data();

        // Recupera i dati aggiornati del luogo
        const placeDoc = await db.collection(PLACES_COLLECTION).doc(favoriteData.placeId).get();

        if (placeDoc.exists && !placeDoc.data().isDeleted) {
            const placeData = placeDoc.data();
            favorites.push({
                id: doc.id,
                ...favoriteData,
                place: {
                    id: placeDoc.id,
                    name: placeData.name,
                    description: placeData.description,
                    category: placeData.category,
                    location: placeData.location,
                    rating: placeData.rating,
                    isVerified: placeData.isVerified,
                    contact: placeData.contact
                }
            });
        }
    }

    return favorites;
};

/**
 * Ottiene i preferiti con solo gli ID dei luoghi (più leggero)
 */
const getUserFavoriteIds = async (userId) => {
    const snapshot = await db.collection(COLLECTION_NAME)
        .where('userId', '==', userId)
        .get();

    return snapshot.docs.map(doc => doc.data().placeId);
};

/**
 * Verifica se un luogo è nei preferiti dell'utente
 */
const isFavorite = async (userId, placeId) => {
    const favoriteQuery = await db.collection(COLLECTION_NAME)
        .where('userId', '==', userId)
        .where('placeId', '==', placeId)
        .get();

    return !favoriteQuery.empty;
};

/**
 * Conta quanti utenti hanno un luogo nei preferiti
 */
const getFavoriteCount = async (placeId) => {
    const snapshot = await db.collection(COLLECTION_NAME)
        .where('placeId', '==', placeId)
        .get();

    return snapshot.size;
};

/**
 * Toggle preferito: aggiunge se non esiste, rimuove se esiste
 */
const toggleFavorite = async (userId, placeId) => {
    const isFav = await isFavorite(userId, placeId);

    if (isFav) {
        await removeFavorite(userId, placeId);
        return { action: 'removed', message: 'Luogo rimosso dai preferiti' };
    } else {
        const favorite = await addFavorite(userId, placeId);
        return { action: 'added', message: 'Luogo aggiunto ai preferiti', favorite };
    }
};

/**
 * Rimuove tutti i preferiti di un utente (per cancellazione account)
 */
const removeAllUserFavorites = async (userId) => {
    const snapshot = await db.collection(COLLECTION_NAME)
        .where('userId', '==', userId)
        .get();

    const batch = db.batch();
    snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
    });

    await batch.commit();

    return { message: `Rimossi ${snapshot.size} preferiti` };
};

/**
 * Rimuove tutti i preferiti per un luogo (quando viene eliminato)
 */
const removeAllPlaceFavorites = async (placeId) => {
    const snapshot = await db.collection(COLLECTION_NAME)
        .where('placeId', '==', placeId)
        .get();

    const batch = db.batch();
    snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
    });

    await batch.commit();

    return { message: `Rimossi ${snapshot.size} preferiti per il luogo` };
};

module.exports = {
    addFavorite,
    removeFavorite,
    removeFavoriteById,
    getUserFavorites,
    getUserFavoriteIds,
    isFavorite,
    getFavoriteCount,
    toggleFavorite,
    removeAllUserFavorites,
    removeAllPlaceFavorites
};

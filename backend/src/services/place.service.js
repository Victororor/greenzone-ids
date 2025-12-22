// Logica di business per i luoghi "bio"
const { db } = require('../config/firebase');
const { AppError } = require('../utils/errorHandler');

const COLLECTION_NAME = 'places';

/**
 * Calcola la distanza tra due punti usando la formula di Haversine
 * @returns distanza in km
 */
const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Raggio della Terra in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

/**
 * Crea un nuovo luogo
 */
const createPlace = async (placeData, userId) => {
    const newPlace = {
        name: placeData.name,
        description: placeData.description || '',
        location: {
            latitude: placeData.location.latitude,
            longitude: placeData.location.longitude,
            address: placeData.location.address || '',
            city: placeData.location.city || '',
            country: placeData.location.country || ''
        },
        category: placeData.category,
        tags: placeData.tags || [],
        rating: 0,
        reviewsCount: 0,
        openingHours: placeData.openingHours || {},
        contact: placeData.contact || {},
        createdBy: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        isVerified: false,
        isActive: true,
        isDeleted: false,
        deletedAt: null
    };

    const docRef = await db.collection(COLLECTION_NAME).add(newPlace);

    return {
        id: docRef.id,
        ...newPlace
    };
};

/**
 * Ottiene tutti i luoghi (con filtri opzionali)
 */
const getAllPlaces = async (filters = {}) => {
    let query = db.collection(COLLECTION_NAME).where('isDeleted', '==', false);

    if (filters.category) {
        query = query.where('category', '==', filters.category);
    }

    if (filters.city) {
        query = query.where('location.city', '==', filters.city);
    }

    if (filters.isVerified !== undefined) {
        query = query.where('isVerified', '==', filters.isVerified);
    }

    const snapshot = await query.get();

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
};

/**
 * Ottiene luoghi vicini a delle coordinate
 */
const getNearbyPlaces = async (latitude, longitude, radiusKm = 10) => {
    // Firestore non supporta query geospaziali native
    // Prendiamo tutti i luoghi attivi e filtriamo lato server
    const snapshot = await db.collection(COLLECTION_NAME)
        .where('isDeleted', '==', false)
        .where('isActive', '==', true)
        .get();

    const places = [];

    snapshot.docs.forEach(doc => {
        const data = doc.data();
        const distance = haversineDistance(
            latitude,
            longitude,
            data.location.latitude,
            data.location.longitude
        );

        if (distance <= radiusKm) {
            places.push({
                id: doc.id,
                ...data,
                distance: Math.round(distance * 100) / 100
            });
        }
    });

    // Ordina per distanza
    return places.sort((a, b) => a.distance - b.distance);
};

/**
 * Ottiene un luogo per ID
 */
const getPlaceById = async (placeId) => {
    const doc = await db.collection(COLLECTION_NAME).doc(placeId).get();

    if (!doc.exists) {
        throw new AppError('Luogo non trovato', 404);
    }

    const data = doc.data();

    if (data.isDeleted) {
        throw new AppError('Luogo non trovato', 404);
    }

    return {
        id: doc.id,
        ...data
    };
};

/**
 * Ottiene luoghi per categoria
 */
const getPlacesByCategory = async (category) => {
    const snapshot = await db.collection(COLLECTION_NAME)
        .where('isDeleted', '==', false)
        .where('category', '==', category)
        .get();

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
};

/**
 * Ottiene luoghi creati da un utente
 */
const getPlacesByUser = async (userId) => {
    const snapshot = await db.collection(COLLECTION_NAME)
        .where('isDeleted', '==', false)
        .where('createdBy', '==', userId)
        .get();

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
};

/**
 * Aggiorna un luogo
 */
const updatePlace = async (placeId, updateData) => {
    const docRef = db.collection(COLLECTION_NAME).doc(placeId);
    const doc = await docRef.get();

    if (!doc.exists) {
        throw new AppError('Luogo non trovato', 404);
    }

    const data = doc.data();
    if (data.isDeleted) {
        throw new AppError('Luogo non trovato', 404);
    }

    const allowedUpdates = ['name', 'description', 'location', 'category', 'tags', 'openingHours', 'contact', 'isActive', 'isVerified'];
    const filteredUpdates = {};

    for (const key of allowedUpdates) {
        if (updateData[key] !== undefined) {
            filteredUpdates[key] = updateData[key];
        }
    }

    filteredUpdates.updatedAt = new Date();

    await docRef.update(filteredUpdates);

    const updated = await docRef.get();
    return {
        id: updated.id,
        ...updated.data()
    };
};

/**
 * Soft delete di un luogo
 */
const softDeletePlace = async (placeId) => {
    const docRef = db.collection(COLLECTION_NAME).doc(placeId);
    const doc = await docRef.get();

    if (!doc.exists) {
        throw new AppError('Luogo non trovato', 404);
    }

    const data = doc.data();
    if (data.isDeleted) {
        throw new AppError('Luogo già eliminato', 400);
    }

    await docRef.update({
        isDeleted: true,
        deletedAt: new Date(),
        updatedAt: new Date()
    });

    return { message: 'Luogo eliminato con successo' };
};

/**
 * Hard delete di un luogo (solo admin)
 */
const hardDeletePlace = async (placeId) => {
    const docRef = db.collection(COLLECTION_NAME).doc(placeId);
    const doc = await docRef.get();

    if (!doc.exists) {
        throw new AppError('Luogo non trovato', 404);
    }

    await docRef.delete();

    return { message: 'Luogo eliminato permanentemente' };
};

/**
 * Ripristina un luogo eliminato (solo admin)
 */
const restorePlace = async (placeId) => {
    const docRef = db.collection(COLLECTION_NAME).doc(placeId);
    const doc = await docRef.get();

    if (!doc.exists) {
        throw new AppError('Luogo non trovato', 404);
    }

    const data = doc.data();
    if (!data.isDeleted) {
        throw new AppError('Il luogo non è eliminato', 400);
    }

    await docRef.update({
        isDeleted: false,
        deletedAt: null,
        updatedAt: new Date()
    });

    const restored = await docRef.get();
    return {
        id: restored.id,
        ...restored.data()
    };
};

module.exports = {
    createPlace,
    getAllPlaces,
    getNearbyPlaces,
    getPlaceById,
    getPlacesByCategory,
    getPlacesByUser,
    updatePlace,
    softDeletePlace,
    hardDeletePlace,
    restorePlace
};

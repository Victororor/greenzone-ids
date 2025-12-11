// logica di business legata agli utenti
const { db, auth } = require('../config/firebase');
const { AppError } = require('../utils/errorHandler');
const admin = require('firebase-admin');

const USERS_COLLECTION = 'users';

/**
 * Schema utente:
 * - uid (string, PK)
 * - email (string, unique)
 * - nome (string)
 * - cognome (string)
 * - ruolo (string: 'user' | 'admin')
 * - createdAt (timestamp)
 * - updatedAt (timestamp)
 * - isDeleted (boolean)
 * - deletedAt (timestamp | null)
 */

/**
 * Crea un nuovo utente in Firestore
 */
const createUser = async (userData) => {
    const { uid, email, nome, cognome, ruolo = 'user' } = userData;

    // Verifica se l'utente esiste già
    const existingUser = await db.collection(USERS_COLLECTION).doc(uid).get();
    if (existingUser.exists) {
        throw new AppError('Utente già esistente', 409);
    }

    const now = admin.firestore.FieldValue.serverTimestamp();

    const newUser = {
        uid,
        email,
        nome,
        cognome,
        ruolo,
        createdAt: now,
        updatedAt: now,
        isDeleted: false,
        deletedAt: null
    };

    await db.collection(USERS_COLLECTION).doc(uid).set(newUser);

    // Imposta custom claims per il ruolo
    await auth.setCustomUserClaims(uid, { role: ruolo });

    return { uid, email, nome, cognome, ruolo };
};

/**
 * Ottiene un utente per uid
 */
const getUserById = async (uid, includeDeleted = false) => {
    const doc = await db.collection(USERS_COLLECTION).doc(uid).get();

    if (!doc.exists) {
        throw new AppError('Utente non trovato', 404);
    }

    const user = doc.data();

    if (user.isDeleted && !includeDeleted) {
        throw new AppError('Utente non trovato', 404);
    }

    return user;
};

/**
 * Ottiene tutti gli utenti (esclusi i soft-deleted per default)
 */
const getAllUsers = async (includeDeleted = false) => {
    let query = db.collection(USERS_COLLECTION);

    if (!includeDeleted) {
        query = query.where('isDeleted', '==', false);
    }

    const snapshot = await query.get();
    const users = [];

    snapshot.forEach(doc => {
        users.push(doc.data());
    });

    return users;
};

/**
 * Aggiorna un utente
 */
const updateUser = async (uid, updateData) => {
    const userRef = db.collection(USERS_COLLECTION).doc(uid);
    const doc = await userRef.get();

    if (!doc.exists) {
        throw new AppError('Utente non trovato', 404);
    }

    const currentUser = doc.data();
    if (currentUser.isDeleted) {
        throw new AppError('Impossibile modificare un utente eliminato', 400);
    }

    // Campi consentiti per l'aggiornamento
    const allowedFields = ['nome', 'cognome', 'ruolo'];
    const filteredData = {};

    for (const field of allowedFields) {
        if (updateData[field] !== undefined) {
            filteredData[field] = updateData[field];
        }
    }

    filteredData.updatedAt = admin.firestore.FieldValue.serverTimestamp();

    await userRef.update(filteredData);

    // Se il ruolo è cambiato, aggiorna i custom claims
    if (updateData.ruolo) {
        await auth.setCustomUserClaims(uid, { role: updateData.ruolo });
    }

    return await getUserById(uid);
};

/**
 * Soft delete: imposta isDeleted = true
 */
const softDeleteUser = async (uid) => {
    const userRef = db.collection(USERS_COLLECTION).doc(uid);
    const doc = await userRef.get();

    if (!doc.exists) {
        throw new AppError('Utente non trovato', 404);
    }

    const user = doc.data();
    if (user.isDeleted) {
        throw new AppError('Utente già eliminato', 400);
    }

    await userRef.update({
        isDeleted: true,
        deletedAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { message: 'Utente eliminato (soft delete)' };
};

/**
 * Hard delete: elimina definitivamente utente da Firestore e Firebase Auth
 * Solo admin può eseguire questa operazione
 */
const hardDeleteUser = async (uid) => {
    const userRef = db.collection(USERS_COLLECTION).doc(uid);
    const doc = await userRef.get();

    if (!doc.exists) {
        throw new AppError('Utente non trovato', 404);
    }

    // Elimina da Firestore
    await userRef.delete();

    // Elimina da Firebase Auth
    try {
        await auth.deleteUser(uid);
    } catch (error) {
        console.error('Errore eliminazione da Firebase Auth:', error.message);
        // Continua anche se l'utente non esiste in Auth
    }

    return { message: 'Utente eliminato definitivamente (hard delete)' };
};

/**
 * Ripristina un utente soft-deleted
 */
const restoreUser = async (uid) => {
    const userRef = db.collection(USERS_COLLECTION).doc(uid);
    const doc = await userRef.get();

    if (!doc.exists) {
        throw new AppError('Utente non trovato', 404);
    }

    const user = doc.data();
    if (!user.isDeleted) {
        throw new AppError('Utente non è eliminato', 400);
    }

    await userRef.update({
        isDeleted: false,
        deletedAt: null,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return await getUserById(uid);
};

module.exports = {
    createUser,
    getUserById,
    getAllUsers,
    updateUser,
    softDeleteUser,
    hardDeleteUser,
    restoreUser
};

/**
 * Auth Service
 * Gestisce signup e login unificati tramite Firebase REST API
 */
const { db, admin } = require('../config/firebase');
const { AppError } = require('../utils/errorHandler');

// API Key Firebase (la stessa usata dal frontend)
const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;
const FIREBASE_AUTH_URL = 'https://identitytoolkit.googleapis.com/v1';

/**
 * Registra un nuovo utente (crea account Firebase + profilo Firestore)
 */
const signup = async ({ email, password, nome, cognome }) => {
    let firebaseUser = null;

    try {
        // 1. Crea account su Firebase Auth tramite REST API
        const signupResponse = await fetch(
            `${FIREBASE_AUTH_URL}/accounts:signUp?key=${FIREBASE_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    password,
                    returnSecureToken: true
                })
            }
        );

        const signupData = await signupResponse.json();

        if (signupData.error) {
            // Gestisci errori Firebase
            const errorMessage = parseFirebaseError(signupData.error);
            throw new AppError(errorMessage, 400);
        }

        firebaseUser = signupData;

        // 2. Crea profilo in Firestore
        const userProfile = {
            uid: signupData.localId,
            email: signupData.email,
            nome,
            cognome,
            ruolo: 'user',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            isDeleted: false,
            deletedAt: null
        };

        await db.collection('users').doc(signupData.localId).set(userProfile);

        // 3. Restituisci tutto
        return {
            user: {
                uid: signupData.localId,
                email: signupData.email,
                nome,
                cognome,
                ruolo: 'user'
            },
            idToken: signupData.idToken,
            refreshToken: signupData.refreshToken,
            expiresIn: signupData.expiresIn
        };

    } catch (error) {
        // Rollback: se il profilo Firestore fallisce, elimina l'utente Firebase
        if (firebaseUser && firebaseUser.localId && !(error instanceof AppError)) {
            try {
                await admin.auth().deleteUser(firebaseUser.localId);
                console.log('Rollback: utente Firebase eliminato dopo errore Firestore');
            } catch (rollbackError) {
                console.error('Errore durante rollback:', rollbackError.message);
            }
        }
        throw error;
    }
};

/**
 * Login utente (autentica + restituisce profilo)
 */
const login = async ({ email, password }) => {
    // 1. Autentica con Firebase REST API
    const loginResponse = await fetch(
        `${FIREBASE_AUTH_URL}/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                password,
                returnSecureToken: true
            })
        }
    );

    const loginData = await loginResponse.json();

    if (loginData.error) {
        const errorMessage = parseFirebaseError(loginData.error);
        throw new AppError(errorMessage, 401);
    }

    // 2. Recupera profilo da Firestore
    const userDoc = await db.collection('users').doc(loginData.localId).get();

    if (!userDoc.exists) {
        throw new AppError('Profilo utente non trovato. Completa la registrazione.', 404);
    }

    const userData = userDoc.data();

    if (userData.isDeleted) {
        throw new AppError('Account disabilitato. Contatta l\'amministratore.', 403);
    }

    // 3. Restituisci tutto
    return {
        user: {
            uid: userData.uid,
            email: userData.email,
            nome: userData.nome,
            cognome: userData.cognome,
            ruolo: userData.ruolo
        },
        idToken: loginData.idToken,
        refreshToken: loginData.refreshToken,
        expiresIn: loginData.expiresIn
    };
};

/**
 * Refresh del token usando il refreshToken
 */
const refreshToken = async (refreshTokenValue) => {
    const response = await fetch(
        `https://securetoken.googleapis.com/v1/token?key=${FIREBASE_API_KEY}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                grant_type: 'refresh_token',
                refresh_token: refreshTokenValue
            })
        }
    );

    const data = await response.json();

    if (data.error) {
        throw new AppError('Refresh token non valido o scaduto', 401);
    }

    return {
        idToken: data.id_token,
        refreshToken: data.refresh_token,
        expiresIn: data.expires_in
    };
};

/**
 * Parsing errori Firebase Auth
 */
const parseFirebaseError = (error) => {
    const errorMap = {
        'EMAIL_EXISTS': 'Email già registrata',
        'INVALID_EMAIL': 'Email non valida',
        'WEAK_PASSWORD': 'Password troppo debole (minimo 6 caratteri)',
        'EMAIL_NOT_FOUND': 'Email non registrata',
        'INVALID_PASSWORD': 'Password non corretta',
        'INVALID_LOGIN_CREDENTIALS': 'Credenziali non valide',
        'USER_DISABLED': 'Account disabilitato',
        'TOO_MANY_ATTEMPTS_TRY_LATER': 'Troppi tentativi, riprova più tardi'
    };

    return errorMap[error.message] || error.message || 'Errore di autenticazione';
};

module.exports = {
    signup,
    login,
    refreshToken
};

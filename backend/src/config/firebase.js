// inizializzazione Firebase Admin
const admin = require('firebase-admin');

// file JSON per l'accesso a Firebase
const serviceAccount = require('../../greenzoneappbackend-firebase-adminsdk-fbsvc-19fff87daf.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// accesso a Firebase Firestore
const db = admin.firestore();

// accesso a Firebase Authentication
const auth = admin.auth();

module.exports = { admin, db, auth };

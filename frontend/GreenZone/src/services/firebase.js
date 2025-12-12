/**
 * CONFIGURAZIONE FIREBASE PER IL FRONTEND
 * 
 * Questo file è un riferimento per chi sviluppa il frontend.
 * Da usare con React, Vue, Angular, o vanilla JS.
 * 
 * Installare: npm install firebase
 */

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA3OmEo5fTDCmAQBqkgIuwZ53YOdVgUElU",
    authDomain: "greenzoneappbackend.firebaseapp.com",
    projectId: "greenzoneappbackend",
    storageBucket: "greenzoneappbackend.firebasestorage.app",
    messagingSenderId: "571907687188",
    appId: "1:571907687188:web:b70b2a691bd3cedfa7f801",
    measurementId: "G-7XGC4XZZEL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth, firebaseConfig };

/**
 * ESEMPIO DI REGISTRAZIONE UTENTE (per il frontend):
 * 
 * import { createUserWithEmailAndPassword } from "firebase/auth";
 * import { auth } from "./firebase-config";
 * 
 * async function registraUtente(email, password, nome, cognome) {
 *     // Step 1: Crea account in Firebase Auth
 *     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
 *     
 *     // Step 2: Ottieni il token
 *     const token = await userCredential.user.getIdToken();
 *     
 *     // Step 3: Registra profilo nel backend
 *     const response = await fetch('http://localhost:3000/api/auth/register', {
 *         method: 'POST',
 *         headers: {
 *             'Content-Type': 'application/json',
 *             'Authorization': `Bearer ${token}`
 *         },
 *         body: JSON.stringify({ nome, cognome })
 *     });
 *     
 *     return response.json();
 * }
 */

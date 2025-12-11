# GreenZone

Applicazione web per identificare e condividere luoghi "bio" e sostenibili sulla mappa: negozi a energia rinnovabile, fontanelle pubbliche, prodotti biologici, zone verdi e molto altro.

---

# Backend

## Struttura Backend

```
backend/
├── src/
│   ├── app.js                    # Configurazione Express e middleware
│   ├── server.js                 # Avvio del server
│   ├── config/
│   │   └── firebase.js           # Inizializzazione Firebase Admin SDK
│   ├── controllers/
│   │   ├── auth.controller.js    # Logica di autenticazione
│   │   └── user.controller.js    # Logica CRUD utenti
│   ├── middlewares/
│   │   └── auth.middleware.js    # Verifica dei token JWT
│   ├── routes/
│   │   ├── auth.routes.js        # Definizione route di autenticazione
│   │   └── user.routes.js        # Definizione route utenti
│   ├── services/
│   │   └── user.service.js       # Operazioni sul database utenti
│   └── utils/
│       └── errorHandler.js       # Gestione centralizzata degli errori
├── .env                          # Variabili d'ambiente (non committare)
├── .env.example                  # Template variabili d'ambiente
└── package.json
```

---

## Sistema di Autenticazione

L'autenticazione si basa su **Firebase Authentication**. Il flusso prevede due attori principali:

1. **Firebase Auth** (gestito da Google): si occupa di creare gli account, gestire le password e generare i token JWT
2. **Il nostro backend**: verifica i token e gestisce i dati aggiuntivi degli utenti su Firestore

### Perché due passaggi?

Firebase Auth gestisce solo le credenziali (email/password). I dati del profilo (nome, cognome, ruolo) vengono salvati separatamente su Firestore dal nostro backend. Questo approccio è più sicuro perché le password non transitano mai dal nostro server.

### Flusso di Registrazione

```
UTENTE                     FIREBASE AUTH                 NOSTRO BACKEND
   │                            │                              │
   │  1. email + password       │                              │
   │  ────────────────────────> │                              │
   │                            │                              │
   │  2. restituisce idToken    │                              │
   │  <──────────────────────── │                              │
   │                            │                              │
   │  3. idToken + nome/cognome                                │
   │  ─────────────────────────────────────────────────────>   │
   │                            │                              │
   │                            │     4. verifica il token     │
   │                            │  <─────────────────────────  │
   │                            │                              │
   │  5. profilo creato                                        │
   │  <─────────────────────────────────────────────────────   │
```

### Flusso di Login

```
UTENTE                     FIREBASE AUTH                 NOSTRO BACKEND
   │                            │                              │
   │  1. email + password       │                              │
   │  ────────────────────────> │                              │
   │                            │                              │
   │  2. restituisce idToken    │                              │
   │  <──────────────────────── │                              │
   │                            │                              │
   │  3. usa idToken per le chiamate API                       │
   │  ─────────────────────────────────────────────────────>   │
```

Il token (`idToken`) ha una validità di **1 ora**. Dopo la scadenza, il frontend deve richiederne uno nuovo usando il `refreshToken`.

---

## API Endpoints

**Base URL del backend:** `http://localhost:3000`

Per gli endpoint protetti, includere sempre l'header:
```
Authorization: Bearer <idToken>
```

---

### Endpoint Firebase (Autenticazione)

Questi endpoint sono forniti direttamente da Firebase e servono per creare account e fare login.

**Base URL Firebase:** `https://identitytoolkit.googleapis.com/v1`

#### Registrazione Account

Crea un nuovo account su Firebase Auth.

```
POST /accounts:signUp?key=<FIREBASE_API_KEY>
```

| Header | Valore |
|--------|--------|
| Content-Type | application/json |

**Body:**
```json
{
  "email": "mario.rossi@email.com",
  "password": "Password123!",
  "returnSecureToken": true
}
```

**Risposta:**
```json
{
  "idToken": "eyJhbGciOiJS...",
  "refreshToken": "AMf-vBz6...",
  "localId": "VI0OZ4ljM7Y3JWz68P57zXCcAsp2",
  "email": "mario.rossi@email.com",
  "expiresIn": "3600"
}
```

Il campo `idToken` è il Bearer Token da usare nelle chiamate al backend.

---

#### Login

Effettua il login con un account esistente.

```
POST /accounts:signInWithPassword?key=<FIREBASE_API_KEY>
```

| Header | Valore |
|--------|--------|
| Content-Type | application/json |

**Body:**
```json
{
  "email": "mario.rossi@email.com",
  "password": "Password123!",
  "returnSecureToken": true
}
```

La risposta ha la stessa struttura della registrazione.

---

### Endpoint Pubblici

Questi endpoint non richiedono autenticazione.

#### Info API
```
GET /
```
Restituisce informazioni generali sull'API e la lista degli endpoint disponibili.

#### Health Check
```
GET /health
```
Verifica che il server sia attivo.

---

### Endpoint Autenticazione (`/api/auth`)

#### Registrazione Profilo

Dopo aver creato l'account su Firebase, questo endpoint salva i dati aggiuntivi (nome, cognome) nel database Firestore.

```
POST /api/auth/register
```

| Header | Valore |
|--------|--------|
| Content-Type | application/json |
| Authorization | Bearer `<idToken>` |

**Body:**
```json
{
  "nome": "Mario",
  "cognome": "Rossi"
}
```

**Risposta (201):**
```json
{
  "status": "success",
  "message": "Registrazione completata con successo",
  "data": {
    "user": {
      "uid": "VI0OZ4ljM7Y3JWz68P57zXCcAsp2",
      "email": "mario.rossi@email.com",
      "nome": "Mario",
      "cognome": "Rossi",
      "ruolo": "user"
    }
  }
}
```

---

#### Verifica Sessione

Controlla se il token è valido e restituisce i dati dell'utente.

```
GET /api/auth/verify
```

| Header | Valore |
|--------|--------|
| Authorization | Bearer `<idToken>` |

---

#### Logout

Invalida tutti i refresh token dell'utente lato server.

```
POST /api/auth/logout
```

| Header | Valore |
|--------|--------|
| Authorization | Bearer `<idToken>` |

Ricorda che il logout va completato anche lato client chiamando `signOut()` di Firebase.

---

#### Modifica Ruolo (solo admin)

Permette a un amministratore di cambiare il ruolo di un utente.

```
POST /api/auth/set-role
```

| Header | Valore |
|--------|--------|
| Content-Type | application/json |
| Authorization | Bearer `<idToken>` |

**Body:**
```json
{
  "uid": "uid_utente_da_modificare",
  "role": "admin"
}
```

Ruoli disponibili: `user`, `admin`

---

### Endpoint Utenti (`/api/users`)

#### Profilo Personale

Restituisce i dati dell'utente autenticato.

```
GET /api/users/me
```

| Header | Valore |
|--------|--------|
| Authorization | Bearer `<idToken>` |

---

#### Lista Utenti (solo admin)

Restituisce tutti gli utenti registrati.

```
GET /api/users
```

| Header | Valore |
|--------|--------|
| Authorization | Bearer `<idToken>` |

| Query Param | Tipo | Descrizione |
|-------------|------|-------------|
| includeDeleted | boolean | Se `true`, include anche gli utenti eliminati |

---

#### Dettaglio Utente

Restituisce i dati di un utente specifico. L'utente può vedere solo il proprio profilo, a meno che non sia admin.

```
GET /api/users/:uid
```

---

#### Creazione Profilo

Crea un nuovo profilo utente nel database.

```
POST /api/users
```

**Body:**
```json
{
  "email": "luigi.verdi@email.com",
  "nome": "Luigi",
  "cognome": "Verdi",
  "ruolo": "user"
}
```

---

#### Modifica Utente

Aggiorna i dati di un utente. L'utente può modificare solo il proprio profilo, a meno che non sia admin.

```
PUT /api/users/:uid
```

**Body:**
```json
{
  "nome": "Mario",
  "cognome": "Bianchi"
}
```

Il campo `ruolo` può essere modificato solo dagli admin.

---

#### Eliminazione (soft delete)

Marca l'utente come eliminato senza cancellare effettivamente i dati.

```
DELETE /api/users/:uid
```

---

#### Eliminazione Definitiva (solo admin)

Rimuove permanentemente l'utente dal database e da Firebase Auth.

```
DELETE /api/users/:uid/hard
```

---

#### Ripristino Utente (solo admin)

Recupera un utente che era stato eliminato con soft delete.

```
POST /api/users/:uid/restore
```

---

## Schema Utente (Firestore)

Collection: `users`

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| uid | string | ID univoco (corrisponde all'UID di Firebase Auth) |
| email | string | Email dell'utente |
| nome | string | Nome |
| cognome | string | Cognome |
| ruolo | string | `user` oppure `admin` |
| createdAt | timestamp | Data di creazione |
| updatedAt | timestamp | Data ultima modifica |
| isDeleted | boolean | `true` se l'utente è stato eliminato |
| deletedAt | timestamp | Data di eliminazione |

---

## Codici di Errore

| Codice | Significato |
|--------|-------------|
| 400 | Richiesta non valida (dati mancanti o formato errato) |
| 401 | Non autenticato (token mancante, scaduto o non valido) |
| 403 | Non autorizzato (permessi insufficienti per questa operazione) |
| 404 | Risorsa non trovata |
| 409 | Conflitto (es. email già registrata) |
| 429 | Troppe richieste, attendi prima di riprovare |
| 500 | Errore interno del server |

Tutte le risposte di errore seguono questo formato:

```json
{
  "status": "fail",
  "message": "Descrizione dell'errore"
}
```

---

## Rate Limiting

Per evitare abusi, le richieste sono limitate:

| Endpoint | Limite |
|----------|--------|
| `/api/*` | 100 richieste ogni 15 minuti |
| `/api/auth/*` | 10 richieste ogni ora |

Superato il limite, il server risponde con errore 429.

---

## Test con Postman

### 1. Creare un account

```
POST https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA3OmEo5fTDCmAQBqkgIuwZ53YOdVgUElU

Body (JSON):
{
  "email": "test@email.com",
  "password": "Password123!",
  "returnSecureToken": true
}
```

Dalla risposta, copia il valore di `idToken`.

### 2. Registrare il profilo

```
POST http://localhost:3000/api/auth/register

Headers:
- Content-Type: application/json
- Authorization: Bearer <token_copiato>

Body (JSON):
{
  "nome": "Test",
  "cognome": "Utente"
}
```

### 3. Fare login

Per ottenere un nuovo token (quello vecchio scade dopo 1 ora):

```
POST https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA3OmEo5fTDCmAQBqkgIuwZ53YOdVgUElU

Body (JSON):
{
  "email": "test@email.com",
  "password": "Password123!",
  "returnSecureToken": true
}
```

### 4. Usare il token

Per tutte le altre chiamate, aggiungi l'header:
```
Authorization: Bearer <idToken>
```

---

## Note per il Frontend

### Gestione del Token

Il token scade dopo 1 ora. Firebase SDK gestisce automaticamente il refresh:

```javascript
// Ottieni sempre un token valido prima di ogni chiamata
const token = await user.getIdToken();
```

### Stato di Autenticazione

Per sapere quando l'utente si logga o slogga:

```javascript
import { onAuthStateChanged } from 'firebase/auth';

onAuthStateChanged(auth, (user) => {
  if (user) {
    // Utente loggato
  } else {
    // Utente non loggato
  }
});
```

### Promuovere il Primo Admin

Per creare il primo amministratore del sistema:

1. Vai sulla console di Firebase
2. Apri Firestore Database
3. Trova la collection `users` e seleziona il tuo documento
4. Cambia il campo `ruolo` da `user` a `admin`
5. Fai logout e login per ricevere un nuovo token con i permessi aggiornati

---

# Frontend

*Da completare*

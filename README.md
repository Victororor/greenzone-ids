# GreenZone

Applicazione web per identificare e condividere luoghi "bio" e sostenibili sulla mappa.

---

## Legenda

| Simbolo | Significato |
|---------|-------------|
| 🔒 | Richiede header `Authorization: Bearer <idToken>` |
| 🔒 Admin | Solo utenti con ruolo `admin` |
| 🔒 Owner/Admin | Solo il creatore della risorsa o admin |

---

# Backend API

**Base URL:** `http://localhost:3000`

---

## Autenticazione (`/api/auth`)

### POST /api/auth/signup
Registra un nuovo utente nel sistema creando account Firebase e profilo Firestore.

| Header | Valore |
|--------|--------|
| Content-Type | application/json |

```json
{
  "email": "mario@email.com",
  "password": "Password123!",
  "nome": "Mario",
  "cognome": "Rossi"
}
```

**Risposta:** `user`, `idToken`, `refreshToken`, `expiresIn`

---

### POST /api/auth/login
Autentica un utente esistente e restituisce i token di accesso.

| Header | Valore |
|--------|--------|
| Content-Type | application/json |

```json
{
  "email": "mario@email.com",
  "password": "Password123!"
}
```

**Risposta:** `user`, `idToken`, `refreshToken`, `expiresIn`

---

### POST /api/auth/refresh
Rinnova un token di accesso scaduto utilizzando il refresh token.

| Header | Valore |
|--------|--------|
| Content-Type | application/json |

```json
{
  "refreshToken": "AMf-vBz6..."
}
```

**Risposta:** `idToken`, `refreshToken`, `expiresIn`

---

### GET /api/auth/verify 🔒
Verifica la validità del token JWT e restituisce i dati dell'utente autenticato.

| Header | Valore |
|--------|--------|
| Authorization | Bearer `<idToken>` |

**Risposta:** `user`

---

### POST /api/auth/logout 🔒
Revoca tutti i refresh token dell'utente, invalidando tutte le sessioni attive.

| Header | Valore |
|--------|--------|
| Authorization | Bearer `<idToken>` |

**Risposta:** `message`

---

### POST /api/auth/set-role 🔒 Admin
Modifica il ruolo di un utente (solo amministratori).

| Header | Valore |
|--------|--------|
| Content-Type | application/json |
| Authorization | Bearer `<idToken>` |

```json
{
  "uid": "uid_utente",
  "role": "admin"
}
```

**Risposta:** `message`

---

## Utenti (`/api/users`)

### GET /api/users/me 🔒
Restituisce il profilo completo dell'utente attualmente autenticato.

| Header | Valore |
|--------|--------|
| Authorization | Bearer `<idToken>` |

**Risposta:** `user`

---

### GET /api/users 🔒 Admin
Restituisce la lista di tutti gli utenti registrati (solo amministratori).

| Header | Valore |
|--------|--------|
| Authorization | Bearer `<idToken>` |

| Query Param | Descrizione |
|-------------|-------------|
| includeDeleted | Se `true`, include utenti eliminati |

**Risposta:** `users[]`

---

### GET /api/users/:uid 🔒
Restituisce i dettagli di un utente specifico (solo proprio profilo o admin).

| Header | Valore |
|--------|--------|
| Authorization | Bearer `<idToken>` |

**Risposta:** `user`

---

### PUT /api/users/:uid 🔒
Aggiorna i dati di un utente (solo proprio profilo o admin).

| Header | Valore |
|--------|--------|
| Content-Type | application/json |
| Authorization | Bearer `<idToken>` |

```json
{
  "nome": "Mario",
  "cognome": "Bianchi"
}
```

**Risposta:** `user`

---

### DELETE /api/users/:uid 🔒
Esegue soft delete dell'utente, marcandolo come eliminato ma mantenendo i dati.

| Header | Valore |
|--------|--------|
| Authorization | Bearer `<idToken>` |

**Risposta:** `message`

---

### DELETE /api/users/:uid/hard 🔒 Admin
Elimina definitivamente un utente e tutti i suoi dati (solo amministratori).

| Header | Valore |
|--------|--------|
| Authorization | Bearer `<idToken>` |

**Risposta:** `message`

---

### POST /api/users/:uid/restore 🔒 Admin
Ripristina un utente precedentemente eliminato con soft delete.

| Header | Valore |
|--------|--------|
| Authorization | Bearer `<idToken>` |

**Risposta:** `user`

---

## Luoghi (`/api/places`)

### GET /api/places
Restituisce la lista di tutti i luoghi bio attivi, con filtri opzionali.

| Header | Valore |
|--------|--------|
| Content-Type | application/json |

| Query Param | Descrizione |
|-------------|-------------|
| category | Filtra per categoria (`restaurant`, `shop`, `farm`, `market`, `cafe`, `bakery`, `other`) |
| city | Filtra per città |
| isVerified | Se `true`, solo luoghi verificati |

**Esempi:**

| Chiamata | Risultato |
|----------|-----------|
| `/api/places` | Tutti i luoghi attivi |
| `/api/places?category=restaurant` | Solo ristoranti |
| `/api/places?city=Roma` | Solo luoghi a Roma |
| `/api/places?category=restaurant&city=Roma` | Ristoranti a Roma |
| `/api/places?category=farm&city=Milano&isVerified=true` | Farm verificate a Milano |

> **Nota:** I filtri possono essere combinati usando `&` tra un parametro e l'altro.

**Risposta:** `places[]`

---

### GET /api/places/nearby
Restituisce i luoghi entro un certo raggio da una posizione geografica (per la mappa).

| Header | Valore |
|--------|--------|
| Content-Type | application/json |

| Query Param | Descrizione |
|-------------|-------------|
| lat | **Obbligatorio** - Latitudine (es: `41.9028`) |
| lng | **Obbligatorio** - Longitudine (es: `12.4964`) |
| radius | Raggio in km (default: `10`, max: `100`) |

**Esempio:** `/api/places/nearby?lat=41.9028&lng=12.4964&radius=5`

**Risposta:** `places[]` con campo `distance` (km) per ogni luogo, ordinati per vicinanza

---

### GET /api/places/category/:category
Restituisce tutti i luoghi appartenenti a una specifica categoria.

| Header | Valore |
|--------|--------|
| Content-Type | application/json |

**Categorie valide:** `restaurant`, `shop`, `farm`, `market`, `cafe`, `bakery`, `other`

**Risposta:** `places[]`

---

### GET /api/places/user/:uid
Restituisce tutti i luoghi creati da un utente specifico.

| Header | Valore |
|--------|--------|
| Content-Type | application/json |

**Risposta:** `places[]`

---

### GET /api/places/:id
Restituisce i dettagli completi di un singolo luogo.

| Header | Valore |
|--------|--------|
| Content-Type | application/json |

**Risposta:** `place`

---

### POST /api/places 🔒
Crea un nuovo luogo bio associandolo all'utente autenticato come proprietario.

| Header | Valore |
|--------|--------|
| Content-Type | application/json |
| Authorization | Bearer `<idToken>` |

```json
{
  "name": "Bio Farm Roma",
  "description": "Fattoria biologica con prodotti km0",
  "location": {
    "latitude": 41.9028,
    "longitude": 12.4964,
    "address": "Via Roma 123",
    "city": "Roma",
    "country": "Italy"
  },
  "category": "farm",
  "tags": ["bio", "km0", "organic"],
  "openingHours": {
    "monday": { "open": "09:00", "close": "18:00" },
    "tuesday": { "open": "09:00", "close": "18:00" }
  },
  "contact": {
    "phone": "+39123456789",
    "email": "info@biofarm.it",
    "website": "https://biofarm.it"
  }
}
```

**Risposta:** `place`

---

### PUT /api/places/:id 🔒 Owner/Admin
Aggiorna i dati di un luogo esistente (solo proprietario o admin).

| Header | Valore |
|--------|--------|
| Content-Type | application/json |
| Authorization | Bearer `<idToken>` |

```json
{
  "name": "Nuovo Nome",
  "description": "Nuova descrizione",
  "isActive": true
}
```

> **Nota:** Solo admin può modificare `isVerified`

**Risposta:** `place`

---

### DELETE /api/places/:id 🔒 Owner/Admin
Esegue soft delete del luogo, nascondendolo dalle ricerche ma mantenendo i dati.

| Header | Valore |
|--------|--------|
| Authorization | Bearer `<idToken>` |

**Risposta:** `message`

---

### DELETE /api/places/:id/permanent 🔒 Admin
Elimina definitivamente un luogo dal database (solo amministratori).

| Header | Valore |
|--------|--------|
| Authorization | Bearer `<idToken>` |

**Risposta:** `message`

---

### PATCH /api/places/:id/restore 🔒 Admin
Ripristina un luogo precedentemente eliminato con soft delete.

| Header | Valore |
|--------|--------|
| Authorization | Bearer `<idToken>` |

**Risposta:** `place`

---

## Schema Luogo (Firestore)

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| id | string | ID auto-generato da Firestore |
| name | string | Nome del luogo |
| description | string | Descrizione del luogo |
| location | object | `{ latitude, longitude, address, city, country }` |
| category | string | `restaurant` / `shop` / `farm` / `market` / `cafe` / `bakery` / `other` |
| tags | array | Array di tag (es: `["bio", "km0"]`) |
| rating | number | Valutazione media (0-5) |
| reviewsCount | number | Numero di recensioni |
| openingHours | object | Orari di apertura per giorno |
| contact | object | `{ phone, email, website }` |
| createdBy | string | UID dell'utente creatore |
| createdAt | timestamp | Data di creazione |
| updatedAt | timestamp | Data ultima modifica |
| isVerified | boolean | Se verificato da admin |
| isActive | boolean | Se attivo e visibile |
| isDeleted | boolean | Se eliminato (soft delete) |
| deletedAt | timestamp | Data di eliminazione |

---

## Schema Utente (Firestore)

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| uid | string | UID Firebase univoco |
| email | string | Email dell'utente |
| nome | string | Nome |
| cognome | string | Cognome |
| ruolo | string | `user` / `admin` |
| createdAt | timestamp | Data di registrazione |
| updatedAt | timestamp | Data ultima modifica |
| isDeleted | boolean | Se eliminato (soft delete) |
| deletedAt | timestamp | Data di eliminazione |

---

## Codici Errore

| Codice | Significato | Descrizione |
|--------|-------------|-------------|
| 400 | Bad Request | Dati non validi o mancanti |
| 401 | Unauthorized | Token mancante o non valido |
| 403 | Forbidden | Permessi insufficienti |
| 404 | Not Found | Risorsa non trovata |
| 409 | Conflict | Conflitto (es. email già esistente) |
| 429 | Too Many Requests | Limite di richieste superato |
| 500 | Internal Server Error | Errore interno del server |

---

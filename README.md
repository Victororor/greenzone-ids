# 🌿 GreenZone

Applicazione per identificare e condividere luoghi "bio" e sostenibili sulla mappa: fontanelle, negozi bio, ristoranti sostenibili, colonnine di ricarica, e molto altro.

---

## 📋 Indice

- [Legenda](#legenda)
- [Ruoli Utente](#ruoli-utente)
- [Backend API](#backend-api)
  - [Autenticazione](#autenticazione-apiauth)
  - [Utenti](#utenti-apiusers)
  - [Luoghi](#luoghi-apiplaces)
  - [Preferiti](#preferiti-apifavorites)
  - [Segnalazioni](#segnalazioni-apireports)
  - [Dashboard Admin](#dashboard-admin-apiadmin)
- [Schemi Firestore](#schemi-firestore)
- [Codici Errore](#codici-errore)
- [Rate Limiting](#rate-limiting)

---

## Legenda

| Simbolo | Significato |
|---------|-------------|
| 🔒 | Richiede header `Authorization: Bearer <idToken>` |
| 🔒 Admin | Solo utenti con ruolo `admin` |
| 🔒 Owner/Admin | Solo il creatore della risorsa o admin |

---

## Ruoli Utente

| Ruolo | Descrizione | Permessi |
|-------|-------------|----------|
| `user` | Utente base | Crea luoghi, segnala luoghi, gestisce preferiti, gestisce il proprio profilo |
| `admin` | Amministratore | Accesso completo: gestione utenti, luoghi, segnalazioni, verifica luoghi |

---

# Backend API

**Base URL:** `http://localhost:3000`

**Endpoints disponibili:**
| Endpoint | Descrizione |
|----------|-------------|
| `/api/auth` | Autenticazione e gestione sessioni |
| `/api/users` | Gestione profili utente |
| `/api/places` | Gestione luoghi green/bio |
| `/api/favorites` | Gestione preferiti utente |
| `/api/reports` | Segnalazioni luoghi |
| `/api/admin` | Dashboard e operazioni amministrative |

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
  "email": "mario.rossi@test.com",
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
Restituisce la lista di tutti gli utenti registrati.

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
Elimina definitivamente un utente e tutti i suoi dati.

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

### Categorie Valide

| Valore | Descrizione |
|--------|-------------|
| `restaurant` | Ristorante bio/sostenibile |
| `shop` | Negozio bio/eco-friendly |
| `farm` | Fattoria biologica |
| `market` | Mercato contadino/bio |
| `cafe` | Bar/caffetteria sostenibile |
| `bakery` | Panetteria artigianale/bio |
| `other` | Altro tipo di luogo green |

---

### GET /api/places
Restituisce la lista di tutti i luoghi bio attivi, con filtri opzionali.

| Query Param | Descrizione |
|-------------|-------------|
| category | Filtra per categoria |
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

**Risposta:** `places[]`

---

### GET /api/places/nearby
Restituisce i luoghi entro un certo raggio da una posizione geografica (per la mappa).

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

**Risposta:** `places[]`

---

### GET /api/places/user/:uid
Restituisce tutti i luoghi creati da un utente specifico.

**Risposta:** `places[]`

---

### GET /api/places/:id
Restituisce i dettagli completi di un singolo luogo.

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
Elimina definitivamente un luogo dal database.

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

## Preferiti (`/api/favorites`)

Il sistema di preferiti permette agli utenti autenticati di salvare i luoghi preferiti per un accesso rapido. I luoghi preferiti vengono visualizzati in una sezione dedicata dell'app.

---

### POST /api/favorites 🔒
Aggiunge un luogo ai preferiti dell'utente.

| Header | Valore |
|--------|--------|
| Content-Type | application/json |
| Authorization | Bearer `<idToken>` |

```json
{
  "placeId": "abc123xyz"
}
```

| Campo | Tipo | Obbligatorio | Descrizione |
|-------|------|--------------|-------------|
| placeId | string | ✅ | ID del luogo da aggiungere ai preferiti |

**Risposta:**
```json
{
  "success": true,
  "message": "Place added to favorites",
  "favorite": {
    "id": "fav123",
    "userId": "uid123",
    "placeId": "abc123xyz",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

> **Nota:** Un utente non può aggiungere lo stesso luogo ai preferiti più volte.

---

### GET /api/favorites 🔒
Restituisce tutti i luoghi preferiti dell'utente con i dettagli completi.

| Header | Valore |
|--------|--------|
| Authorization | Bearer `<idToken>` |

**Risposta:**
```json
{
  "success": true,
  "favorites": [
    {
      "id": "fav123",
      "userId": "uid123",
      "placeId": "abc123xyz",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "place": {
        "id": "abc123xyz",
        "name": "Bio Farm Roma",
        "category": "farm",
        "...": "altri campi del luogo"
      }
    }
  ]
}
```

---

### GET /api/favorites/ids 🔒
Restituisce solo gli ID dei luoghi preferiti (utile per verifiche rapide lato client).

| Header | Valore |
|--------|--------|
| Authorization | Bearer `<idToken>` |

**Risposta:**
```json
{
  "success": true,
  "placeIds": ["abc123xyz", "def456", "ghi789"]
}
```

---

### GET /api/favorites/check/:placeId 🔒
Verifica se un luogo specifico è tra i preferiti dell'utente.

| Header | Valore |
|--------|--------|
| Authorization | Bearer `<idToken>` |

**Risposta:**
```json
{
  "success": true,
  "isFavorite": true
}
```

---

### POST /api/favorites/toggle 🔒
Alterna lo stato di preferito di un luogo (aggiunge se non presente, rimuove se presente).

| Header | Valore |
|--------|--------|
| Content-Type | application/json |
| Authorization | Bearer `<idToken>` |

```json
{
  "placeId": "abc123xyz"
}
```

**Risposta (aggiunto):**
```json
{
  "success": true,
  "action": "added",
  "message": "Place added to favorites",
  "favorite": { "..." }
}
```

**Risposta (rimosso):**
```json
{
  "success": true,
  "action": "removed",
  "message": "Place removed from favorites"
}
```

---

### DELETE /api/favorites/:placeId 🔒
Rimuove un luogo dai preferiti usando il placeId.

| Header | Valore |
|--------|--------|
| Authorization | Bearer `<idToken>` |

**Risposta:**
```json
{
  "success": true,
  "message": "Place removed from favorites"
}
```

---

### GET /api/favorites/count/:placeId
Restituisce il numero totale di utenti che hanno salvato un luogo nei preferiti. **Endpoint pubblico.**

**Risposta:**
```json
{
  "success": true,
  "placeId": "abc123xyz",
  "count": 42
}
```

---

## Segnalazioni (`/api/reports`)

Il sistema di segnalazioni permette agli utenti autenticati di segnalare luoghi con informazioni errate, chiusi, o inappropriati. Le segnalazioni vengono poi gestite dagli admin.

### Motivi di Segnalazione Validi

| Valore | Descrizione | Quando usarlo |
|--------|-------------|---------------|
| `closed` | Luogo chiuso definitivamente | Il luogo non esiste più o ha chiuso |
| `incorrect_info` | Informazioni non corrette | Indirizzo, orari, contatti sbagliati |
| `not_green` | Non è realmente green/bio | Il luogo non è sostenibile come dichiarato |
| `spam` | Spam o pubblicità | Il luogo è stato inserito per fare pubblicità |
| `inappropriate` | Contenuto inappropriato | Contenuti offensivi o fuori tema |
| `duplicate` | Luogo duplicato | Esiste già un altro record per lo stesso posto |
| `other` | Altro motivo | Qualsiasi altro problema |

### Stati di una Segnalazione

| Stato | Descrizione |
|-------|-------------|
| `pending` | In attesa di revisione da parte di un admin |
| `reviewed` | Vista dall'admin, in fase di valutazione |
| `resolved` | Problema risolto (luogo corretto o rimosso) |
| `dismissed` | Segnalazione rigettata (non valida) |

---

### POST /api/reports 🔒
Crea una nuova segnalazione per un luogo esistente.

| Header | Valore |
|--------|--------|
| Content-Type | application/json |
| Authorization | Bearer `<idToken>` |

```json
{
  "placeId": "abc123xyz",
  "reason": "not_green",
  "description": "Questo ristorante non usa prodotti bio, ho verificato personalmente"
}
```

| Campo | Tipo | Obbligatorio | Descrizione |
|-------|------|--------------|-------------|
| placeId | string | ✅ | ID del luogo da segnalare |
| reason | string | ✅ | Motivo della segnalazione (vedi tabella sopra) |
| description | string | ❌ | Descrizione dettagliata (max 1000 caratteri) |

**Risposta:** `report`

> **Nota:** Non puoi creare due segnalazioni con lo stesso motivo per lo stesso luogo se la prima è ancora in stato `pending`.

---

### GET /api/reports/my 🔒
Restituisce tutte le segnalazioni inviate dall'utente autenticato.

| Header | Valore |
|--------|--------|
| Authorization | Bearer `<idToken>` |

**Risposta:** `reports[]`

---

### GET /api/reports/:id 🔒
Restituisce i dettagli di una segnalazione specifica.

| Header | Valore |
|--------|--------|
| Authorization | Bearer `<idToken>` |

> **Nota:** Un utente può vedere solo le proprie segnalazioni. Gli admin possono vedere tutte.

**Risposta:** `report`

---

## Dashboard Admin (`/api/admin`)

> ⚠️ **Tutte le routes in questa sezione richiedono autenticazione con ruolo `admin`.**

### Dashboard e Statistiche

#### GET /api/admin/dashboard 🔒 Admin
Statistiche generali per la dashboard admin.

**Risposta:**
```json
{
  "stats": {
    "users": {
      "total": 100,
      "active": 95,
      "deleted": 5,
      "admins": 2
    },
    "places": {
      "total": 50,
      "active": 45,
      "deleted": 5,
      "verified": 20,
      "byCategory": {
        "restaurant": 15,
        "shop": 10,
        "farm": 8,
        "market": 5,
        "cafe": 4,
        "bakery": 2,
        "other": 1
      }
    },
    "reports": {
      "total": 15,
      "pending": 5,
      "resolved": 10
    }
  }
}
```

---

#### GET /api/admin/dashboard/recent 🔒 Admin
Attività recenti (ultimi utenti registrati, luoghi creati, segnalazioni).

| Query Param | Descrizione |
|-------------|-------------|
| limit | Numero di elementi per categoria (default: 10) |

**Risposta:** 
```json
{
  "recentPlaces": [...],
  "recentUsers": [...],
  "recentReports": [...]
}
```

---

### Gestione Utenti (Admin)

#### GET /api/admin/users 🔒 Admin
Lista tutti gli utenti con filtri e contatori.

| Query Param | Descrizione |
|-------------|-------------|
| isDeleted | `true` per utenti eliminati, `false` per attivi |
| ruolo | Filtra per ruolo: `user` o `admin` |

**Risposta:** `users[]` - Ogni utente include:
- `placesCount`: numero di luoghi creati
- `reportsCount`: numero di segnalazioni fatte

---

#### GET /api/admin/users/search?q= 🔒 Admin
Cerca utenti per email, nome o cognome.

| Query Param | Descrizione |
|-------------|-------------|
| q | Termine di ricerca (minimo 2 caratteri) |

**Esempio:** `/api/admin/users/search?q=mario`

**Risposta:** `users[]`

---

#### GET /api/admin/users/:uid 🔒 Admin
Dettaglio di un utente specifico (anche se eliminato).

**Risposta:** `user`

---

#### PUT /api/admin/users/:uid 🔒 Admin
Modifica i dati di un utente.

```json
{
  "nome": "Mario",
  "cognome": "Rossi"
}
```

**Risposta:** `user`

---

#### PATCH /api/admin/users/:uid/role 🔒 Admin
Cambia il ruolo di un utente.

```json
{
  "ruolo": "admin"
}
```

> **Nota:** Non puoi cambiare il tuo stesso ruolo.

**Risposta:** `user`

---

#### DELETE /api/admin/users/:uid/soft 🔒 Admin
Soft delete: disabilita l'utente mantenendo i dati.

> **Nota:** Non puoi eliminare te stesso.

**Risposta:** `message`

---

#### DELETE /api/admin/users/:uid/hard 🔒 Admin
Hard delete: elimina definitivamente l'utente e tutti i suoi dati.

> **Nota:** Non puoi eliminare te stesso.

**Risposta:** `message`

---

#### POST /api/admin/users/:uid/restore 🔒 Admin
Ripristina un utente precedentemente eliminato con soft delete.

**Risposta:** `user`

---

### Gestione Luoghi (Admin)

#### GET /api/admin/places 🔒 Admin
Lista tutti i luoghi con filtri avanzati (include anche quelli eliminati).

| Query Param | Descrizione |
|-------------|-------------|
| isDeleted | `true` / `false` |
| isVerified | `true` / `false` |
| isActive | `true` / `false` |
| category | Categoria del luogo |

**Esempi:**
- `/api/admin/places?isDeleted=true` - Solo luoghi eliminati
- `/api/admin/places?isVerified=false` - Luoghi non ancora verificati
- `/api/admin/places?category=restaurant&isActive=true` - Ristoranti attivi

**Risposta:** `places[]`

---

#### GET /api/admin/places/search?q= 🔒 Admin
Cerca luoghi per nome, indirizzo o città.

| Query Param | Descrizione |
|-------------|-------------|
| q | Termine di ricerca (minimo 2 caratteri) |

**Risposta:** `places[]`

---

#### GET /api/admin/places/:id 🔒 Admin
Dettaglio di un luogo specifico (anche se eliminato).

**Risposta:** `place`

---

#### POST /api/admin/places 🔒 Admin
Crea un nuovo luogo come admin.

```json
{
  "name": "Nuovo Luogo Bio",
  "description": "Descrizione del luogo",
  "location": {
    "latitude": 41.9028,
    "longitude": 12.4964,
    "address": "Via Roma 123",
    "city": "Roma",
    "country": "Italy"
  },
  "category": "shop"
}
```

**Risposta:** `place`

---

#### PUT /api/admin/places/:id 🔒 Admin
Modifica qualsiasi campo di un luogo.

```json
{
  "name": "Nome Aggiornato",
  "description": "Nuova descrizione",
  "isVerified": true,
  "isActive": true
}
```

**Risposta:** `place`

---

#### PATCH /api/admin/places/:id/verify 🔒 Admin
Verifica o rimuove la verifica da un luogo.

```json
{
  "isVerified": true
}
```

**Risposta:** `place`

---

#### DELETE /api/admin/places/:id/soft 🔒 Admin
Soft delete: nasconde il luogo mantenendo i dati.

**Risposta:** `message`

---

#### DELETE /api/admin/places/:id/hard 🔒 Admin
Hard delete: elimina definitivamente il luogo.

**Risposta:** `message`

---

#### POST /api/admin/places/:id/restore 🔒 Admin
Ripristina un luogo precedentemente eliminato.

**Risposta:** `place`

---

### Gestione Segnalazioni (Admin)

#### GET /api/admin/reports 🔒 Admin
Lista tutte le segnalazioni con filtri.

| Query Param | Descrizione |
|-------------|-------------|
| status | `pending` / `reviewed` / `resolved` / `dismissed` |
| reason | Motivo della segnalazione |
| placeId | ID del luogo segnalato |

**Esempi:**
- `/api/admin/reports?status=pending` - Solo segnalazioni in attesa
- `/api/admin/reports?reason=not_green` - Solo segnalazioni "non green"
- `/api/admin/reports?placeId=abc123` - Segnalazioni per un luogo specifico

**Risposta:** `reports[]`

---

#### GET /api/admin/reports/stats 🔒 Admin
Statistiche dettagliate sulle segnalazioni.

**Risposta:**
```json
{
  "stats": {
    "total": 50,
    "pending": 10,
    "reviewed": 5,
    "resolved": 30,
    "dismissed": 5,
    "byReason": {
      "closed": 8,
      "incorrect_info": 15,
      "not_green": 12,
      "spam": 5,
      "inappropriate": 2,
      "duplicate": 6,
      "other": 2
    }
  }
}
```

---

#### PATCH /api/admin/reports/:id 🔒 Admin
Gestisce una segnalazione: cambia stato e/o aggiunge note.

```json
{
  "status": "resolved",
  "adminNotes": "Verificato: il luogo è stato aggiornato con le informazioni corrette"
}
```

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| status | string | Nuovo stato (`reviewed`, `resolved`, `dismissed`) |
| adminNotes | string | Note dell'amministratore (max 1000 caratteri) |

**Risposta:** `report`

---

#### DELETE /api/admin/reports/:id 🔒 Admin
Elimina definitivamente una segnalazione.

**Risposta:** `message`

---

# Schemi Firestore

## Schema Utente

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

## Schema Luogo

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

## Schema Segnalazione

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| id | string | ID auto-generato da Firestore |
| placeId | string | ID del luogo segnalato |
| placeName | string | Nome del luogo (per riferimento rapido) |
| reason | string | `closed` / `incorrect_info` / `not_green` / `spam` / `inappropriate` / `duplicate` / `other` |
| description | string | Descrizione dettagliata della segnalazione |
| reportedBy | string | UID dell'utente che ha segnalato |
| status | string | `pending` / `reviewed` / `resolved` / `dismissed` |
| createdAt | timestamp | Data di creazione |
| updatedAt | timestamp | Data ultima modifica |
| reviewedBy | string | UID dell'admin che ha gestito (null se pending) |
| reviewedAt | timestamp | Data di gestione (null se pending) |
| adminNotes | string | Note dell'admin |

---

# Codici Errore

| Codice | Significato | Descrizione |
|--------|-------------|-------------|
| 400 | Bad Request | Dati non validi o mancanti |
| 401 | Unauthorized | Token mancante o non valido |
| 403 | Forbidden | Permessi insufficienti |
| 404 | Not Found | Risorsa non trovata |
| 409 | Conflict | Conflitto (es. email già esistente, segnalazione duplicata) |
| 429 | Too Many Requests | Limite di richieste superato |
| 500 | Internal Server Error | Errore interno del server |

---

# Rate Limiting

| Endpoint | Limite | Finestra |
|----------|--------|----------|
| `/api/*` (globale) | 100 richieste | 15 minuti |
| `/api/auth/*` | 10 richieste | 1 ora |

---

# GreenZone

Applicazione web per identificare e condividere luoghi "bio" e sostenibili sulla mappa.

---

# Backend API

**Base URL:** `http://localhost:3000`

**Header per endpoint protetti:**
```
Authorization: Bearer <idToken>
```

---

## Autenticazione (`/api/auth`)

### POST /api/auth/signup
Registra un nuovo utente.

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
Effettua il login.

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
Rinnova il token scaduto.

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
Verifica se il token è valido.

---

### POST /api/auth/logout 🔒
Revoca tutti i refresh token dell'utente.

---

### POST /api/auth/set-role 🔒 Admin
Modifica il ruolo di un utente.

```json
{
  "uid": "uid_utente",
  "role": "admin"
}
```

---

## Utenti (`/api/users`)

### GET /api/users/me 🔒
Restituisce il profilo dell'utente autenticato.

---

### GET /api/users 🔒 Admin
Lista tutti gli utenti.

| Query Param | Descrizione |
|-------------|-------------|
| includeDeleted | Se `true`, include utenti eliminati |

---

### GET /api/users/:uid 🔒
Dettaglio utente (solo proprio profilo o admin).

---

### PUT /api/users/:uid 🔒
Modifica utente (solo proprio profilo o admin).

```json
{
  "nome": "Mario",
  "cognome": "Bianchi"
}
```

---

### DELETE /api/users/:uid 🔒
Soft delete (marca come eliminato).

---

### DELETE /api/users/:uid/hard 🔒 Admin
Hard delete (elimina definitivamente).

---

### POST /api/users/:uid/restore 🔒 Admin
Ripristina utente eliminato.

---

## Schema Utente (Firestore)

| Campo | Tipo |
|-------|------|
| uid | string |
| email | string |
| nome | string |
| cognome | string |
| ruolo | `user` / `admin` |
| createdAt | timestamp |
| updatedAt | timestamp |
| isDeleted | boolean |
| deletedAt | timestamp |

---

## Codici Errore

| Codice | Significato |
|--------|-------------|
| 400 | Dati non validi |
| 401 | Non autenticato |
| 403 | Non autorizzato |
| 404 | Non trovato |
| 409 | Conflitto (es. email esistente) |
| 429 | Troppe richieste |
| 500 | Errore server |

---

## Legenda

- 🔒 = Richiede `Authorization: Bearer <idToken>`
- 🔒 Admin = Solo utenti con ruolo `admin`

---

# Frontend

*Da completare*

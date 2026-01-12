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

## Test Cases

### TC-01 – Registrazione

| Campo | Descrizione |
|-------|-------------|
| ID Test | TC-01 |
| Requisito associato | RF-01 – Registrazione |
| Obiettivo del test | Verificare che l'utente possa registrare correttamente un nuovo account |
| Pre-Condizione | App installata; Connessione attiva; email non già registrata |
| Input | Email valida, password validata, eventuali dati aggiuntivi |
| Procedura | L'utente compila i campi e conferma la registrazione |
| Output atteso | Messaggio di conferma o accesso automatico nell'app |
| Post-Condizione | Utente presente nel database su Firebase |
| Esito | Superato |
| Priorità | Alta |

---

### TC-02 – Login

| Campo | Descrizione |
|-------|-------------|
| ID Test | TC-02 |
| Requisito associato | RF-02 – Login |
| Obiettivo del test | Verificare l'accesso con credenziali corrette e gestione degli errori |
| Pre-Condizione | Account registrato nel database |
| Input | E-mail e password |
| Procedura | Inserire le credenziali e premere "Accedi" |
| Output atteso | Accesso alla schermata principale o errore se credenziali errate |
| Post-Condizione | Sessione utente attiva |
| Esito | Superato |
| Priorità | Alta |

---

### TC-03 – Mappa dei luoghi sostenibili

| Campo | Descrizione |
|-------|-------------|
| ID Test | TC-03 |
| Requisito associato | RF-03 – Mappa dei luoghi sostenibili |
| Obiettivo del test | Verificare che la mappa venga caricata correttamente con i marker |
| Pre-Condizione | Connessione attiva; permesso GPS concesso; luoghi presenti nel database |
| Input | Apertura schermata "Mappa" |
| Procedura | Accedere alla schermata mappa |
| Output atteso | Mappa visibile, marker correttamente posizionati |
| Post-Condizione | Mappa utilizzabile |
| Esito | Superato |
| Priorità | Alta |

---

### TC-04 – Filtri

| Campo | Descrizione |
|-------|-------------|
| ID Test | TC-04 |
| Requisito associato | RF-04 – Filtri |
| Obiettivo del test | Verificare la corretta applicazione dei filtri di categoria e distanza |
| Pre-Condizione | Mappa e marker caricati |
| Input | Categoria selezionata o range distanza |
| Procedura | Applicare il filtro nel pannello dedicato |
| Output atteso | Marker aggiornati in base ai filtri |
| Post-Condizione | Filtri attivi finché non rimossi |
| Esito | Superato |
| Priorità | Media |

---

### TC-05 – Percorso

| Campo | Descrizione |
|-------|-------------|
| ID Test | TC-05 |
| Requisito associato | RF-05 – Percorso |
| Obiettivo del test | Verificare il calcolo del percorso a piedi/in bici tramite Maps API |
| Pre-Condizione | GPS attivo; luogo selezionato sulla mappa |
| Input | Selezione luogo di destinazione |
| Procedura | Premere il pulsante "Indicazioni" |
| Output atteso | Percorso visualizzato sulla mappa con tempo stimato |
| Post-Condizione | Percorso attivo fino a nuova selezione |
| Esito | Superato |
| Priorità | Media |

---

### TC-06 – Segnalazione luogo

| Campo | Descrizione |
|-------|-------------|
| ID Test | TC-06 |
| Requisito associato | RF-06 – Segnalazione luogo |
| Obiettivo del test | Verificare l'inserimento corretto di una nuova segnalazione |
| Pre-Condizione | Utente autenticato; connessione attiva |
| Input | Nome luogo, categoria, posizione, descrizione |
| Procedura | Aprire "Segnala luogo", compilare e inviare |
| Output atteso | Conferma inserimento o messaggio di errore |
| Post-Condizione | Nuovo luogo registrato in Firebase |
| Esito | Superato |
| Priorità | Alta |

---

### TC-07 – Modifica/Eliminazione

| Campo | Descrizione |
|-------|-------------|
| ID Test | TC-07 |
| Requisito associato | RF-07 – Modifica/Eliminazione |
| Obiettivo del test | Verificare la modifica e eliminazione di un luogo |
| Pre-Condizione | Utente autenticato; luogo esistente creato dall'utente |
| Input | Dati modificati o conferma eliminazione |
| Procedura | Selezionare luogo, modificare/eliminare |
| Output atteso | Conferma operazione o messaggio di errore |
| Post-Condizione | Luogo aggiornato o rimosso da Firebase |
| Esito | Superato |
| Priorità | Alta |

---

### TC-08 – Preferiti

| Campo | Descrizione |
|-------|-------------|
| ID Test | TC-08 |
| Requisito associato | RF-08 – Preferiti |
| Obiettivo del test | Verificare l'aggiunta e rimozione di un luogo dai preferiti |
| Pre-Condizione | Utente autenticato |
| Input | Tap su icona preferito |
| Procedura | Aprire luogo → premere icona "Preferito" |
| Output atteso | Lista preferiti aggiornata |
| Post-Condizione | Stato preferito sincronizzato su Firebase |
| Esito | Superato |
| Priorità | Bassa |

---

### TC-09 – Profilo

| Campo | Descrizione |
|-------|-------------|
| ID Test | TC-09 |
| Requisito associato | RF-09 – Profilo |
| Obiettivo del test | Verificare la corretta visualizzazione del profilo utente |
| Pre-Condizione | Utente autenticato |
| Input | Apertura schermata profilo |
| Procedura | Navigare alla sezione "Profilo" |
| Output atteso | Dati utente visualizzati correttamente |
| Post-Condizione | Profilo consultabile |
| Esito | Superato |
| Priorità | Media |

---

### TC-10 – Logout

| Campo | Descrizione |
|-------|-------------|
| ID Test | TC-10 |
| Requisito associato | RF-10 – Logout |
| Obiettivo del test | Verificare la corretta terminazione della sessione |
| Pre-Condizione | Utente autenticato |
| Input | Comando di logout |
| Procedura | Premere "Logout" dal menu o profilo |
| Output atteso | Ritornare alla schermata iniziale/login |
| Post-Condizione | Sessione invalidata |
| Esito | Superato |
| Priorità | Alta |

---

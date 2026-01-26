# GreenZone

GreenZone è un'applicazione mobile sviluppata in React Native che permette agli utenti di scoprire, filtrare e salvare luoghi sostenibili (fattorie, negozi bio, mercati a km0). L'app include un sistema completo di gestione per amministratori per curare i contenuti e gestire l'utenza.

---

## Funzionalità Attive

Attualmente l'applicazione supporta le seguenti funzionalità verificate e funzionanti:

### Lato Utente (User)
* **Esplorazione:** Visualizzazione lista di luoghi ecosostenibili con caricamento dinamico.
* **Filtri Avanzati:** Ricerca luoghi per categoria (Fattoria, Ristorante, Negozio, ecc.).
* **Dettagli Luogo:** Scheda completa con indirizzo, orari di apertura, contatti e descrizione.
* **Preferiti:**
  * Aggiunta luoghi ai preferiti.
  * Visualizzazione lista preferiti salvati.
  * Rimozione rapida tramite gesture "Swipe to Delete" (scorrimento laterale).
* **Suggerimenti:** Possibilità per l'utente di compilare un form per suggerire un nuovo luogo (in attesa di approvazione).
* **Profilo:** Gestione e visualizzazione delle informazioni personali.

### Lato Amministratore (Admin)
* **Dashboard:** Panoramica delle attività e navigazione rapida.
* **Gestione Luoghi (Places):**
  * Visualizzazione di tutti i luoghi presenti nel database.
  * **Modifica:** Aggiornamento dettagli di un luogo esistente.
  * **Soft Delete:** Cancellazione logica dei luoghi (i luoghi vengono nascosti agli utenti e marcati come eliminati, ma non distrutti nel DB).
* **Gestione Suggerimenti:**
  * Visualizzazione delle richieste pendenti inviate dagli utenti.
  * **Approvazione:** Il luogo viene validato e diventa pubblico.
  * **Rifiuto:** Il suggerimento viene eliminato definitivamente.
* **Gestione Utenti:**
  * Visualizzazione lista completa degli utenti registrati con dettagli (Nome, Email).
  * **Eliminazione Utente:** Funzionalità "Swipe to Delete" per rimuovere account.
  * **Sicurezza:** Il sistema filtra automaticamente la lista per impedire a un Admin di eliminare se stesso o altri amministratori.

---

## Tech Stack

* **Frontend:** React Native, Expo, React Navigation.
* **Stato & Storage:** React Hooks, AsyncStorage (per token e persistenza locale).
* **Backend:** Node.js, Express.
* **Database:** Firebase / Firestore (NoSQL).
* **Autenticazione:** Firebase Auth (Gestione Token Bearer).

---

## Struttura del Progetto

### Frontend
La logica dell'app è suddivisa per mantenere il codice pulito e modulare:

```text
frontend/GreenZone/src/
├── components/    # Componenti riutilizzabili nell'interfaccia
├── navigation/    # Gestione dei navigatori (Stack e Tab) e protezione rotte
├── screens/       # Schermate visive (es. AdminUsersScreen, MapScreen)
└── services/      # Punto centrale delle chiamate API
    ├── api.js     # Configurazione base HTTP e Token
    ├── places.js  # API gestione luoghi
    └── users.js   # API gestione utenti

backend/src/
├── config/        # Configurazione Firebase Admin SDK
├── controllers/   # Gestione richieste HTTP (admin, auth, place, user, etc.)
├── middlewares/   # Verifica Token Bearer e Ruoli
├── routes/        # Definizione Endpoint API
├── services/      # Business Logic e interazione col DB
└── utils/         # Configurazione Server ed Error Handling
```
---
## Installazione e Avvio
### Prerequisiti
* Node.js (v14+)
* Expo CLI
* Firebase Account (per backend e autenticazione)

### Istruzioni

```bash
## Frontend
cd greenzone-ids/frontend/GreenZone
npm install
npx expo start
```

## Backend
```bash
cd greenzone-ids/backend
npm install
npm start
```
L'app sarà accessibile tramite l'emulatore Expo o un dispositivo fisico con l'app Expo Go.
In caso di emulatore, utilizzare l'indirizzo IP locale per connettersi al backend, nel file `api.js` in `frontend/GreenZone/src/services/`.
Invece in caso di dispositivo fisico, utilizzare l'indirizzo IP del computer nella rete locale.


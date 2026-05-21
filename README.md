# 🏃 STRANET — Run Together

Una piattaforma di matchmaking in stile "Tinder" dedicata interamente ai corridori. Sviluppata con Vue.js 3, Firebase e Bootstrap 5.

**🔗 Prova l'app online:** [stranet-5408d.web.app](https://stranet-5408d.web.app/)

## ✨ Funzionalità

- **Scoperta tramite Swipe**: Sfoglia i profili degli altri runner: swipe a destra per mettere "like", swipe a sinistra per passare oltre.
- **Match Reciproco**: Quando due runner si mettono mi piace a vicenda, scatta il "Match"!
- **Match in Tempo Reale**: Aggiornamenti live della lista dei match grazie a Firestore `onSnapshot`.
- **Flusso di Onboarding**: Configurazione guidata del profilo in più passaggi per i nuovi utenti.
- **Modalità Scura (Dark Mode)**: Interruttore nelle impostazioni che ricorda la tua preferenza.
- **Integrazione Strava**: Collega direttamente il tuo profilo Strava per mostrare le tue attività.

## 🛠 Tech Stack & Sviluppo

| Livello | Tecnologia |
|-------|-----------|
| Frontend | Vue.js 3 (Composition API) |
| Stato | Pinia |
| Routing | Vue Router 4 |
| Interfaccia Utente | Bootstrap 5 + CSS personalizzato |
| Autenticazione | Firebase Authentication |
| Database | Cloud Firestore |
| Hosting | Firebase Hosting |
| Strumenti di Sviluppo | Creato e rifinito utilizzando Claude, Antigravity e Opencode |

---

## 🚀 Come Funziona STRANET?

L'esperienza su STRANET è pensata per essere immediata, scorrevole e focalizzata sulla community dei runner. Ecco i passaggi chiave dell'applicazione:

### 1. Accesso e Profilazione (Onboarding)
Dopo aver creato un account sicuro tramite email e password (gestito da Firebase Auth), l'utente affronta un processo di onboarding in 3 step. Qui inserisce i suoi dati fisici e atletici (età, biografia, ritmi di corsa) e può collegare il proprio profilo Strava. In questo modo, gli altri utenti sapranno subito se si tratta di un maratoneta esperto o di chi sta muovendo i primi passi nella corsa.

### 2. Il Feed dei Runner (Swipe)
La schermata principale mostra una serie di schede (card) dei runner compatibili nelle vicinanze. Il funzionamento è intuitivo:
- Puoi usare i **pulsanti a schermo**, fare un **gesto di trascinamento (drag)** se sei da smartphone, oppure usare le **frecce della tastiera** da PC.
- Spostando la card a **destra** manifesti interesse; a **sinistra** scarti il profilo.

### 3. Logica del Match e Real-Time
Ogni volta che fai swipe, l'app scrive un documento nella collezione `swipes` di Firestore. Se l'algoritmo rileva che anche l'altro utente ti aveva precedentemente lasciato un "like", viene creato istantaneamente un documento nella collezione `matches`. Grazie ai listener in tempo reale di Firebase, la tua schermata dei Match si aggiornerà all'istante, notificandoti che hai trovato un nuovo compagno di corsa senza bisogno di rinfrescare la pagina.

### 4. Personalizzazione
Dalla schermata Impostazioni l'utente può aggiornare i propri dati in qualsiasi momento grazie alla reattività bidirezionale di Vue (`v-model`) e attivare la Modalità Scura. Il tema visivo è minimale e atletico, dominato dal colore Arancione STRANET (`#E8520A`), e si adatta perfettamente sia agli schermi desktop che a quelli degli smartphone grazie a un approccio di design mobile-first.

---

## 🗄 Struttura del Database

### `users/{uid}` (Utenti)
```
displayName: string
age: number
bio: string
photo: string (URL dell'immagine)
lastActivity: string (URL dell'ultima corsa)
stravaUrl: string
darkMode: boolean
updatedAt: timestamp
```

### `swipes/{id}` (Swipe effettuati)
```
fromId: string (UID di chi fa lo swipe)
toId: string (UID di chi lo riceve)
type: "like" | "pass"
timestamp: timestamp
```

### `matches/{id}` (Match confermati)
```
user_ids: string[] ([uid1, uid2])
matchedAt: timestamp
```

## Accedere all'Account di Test (Demo)

Per facilitare la fase di testing e le sessioni di review del progetto, è stato configurato un account di test dedicato all'interno del database. Questo profilo ha un ecosistema di interazioni già predisposto (il 50% degli utenti fittizi ha già espresso una preferenza positiva nei suoi confronti), rendendo immediata la dimostrazione dei meccanismi di *swipe* e la generazione dei *match* in tempo reale.

### Credenziali di Accesso

Utilizzare le seguenti credenziali nella schermata di login dell'applicazione:

* **E-mail:** `test@gmail.com`
* **Password:** `stranet`

---

# 🏃 STRANET — Run Together

A "Tinder-style" matching platform for runners. Built with Vue.js 3, Firebase, and Bootstrap 5.

## ✨ Features

- **Swipe Discovery** — Browse runner profiles, swipe right to like, left to pass
- **Mutual Matching** — Get matched when two runners like each other
- **Real-time Matches** — Live updates via Firestore `onSnapshot`
- **Onboarding Flow** — Multi-step profile setup for new users
- **Dark Mode** — Persisted toggle in Settings
- **Strava Integration** — Link to runner profiles on Strava

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vue.js 3 (Composition API) |
| State | Pinia |
| Routing | Vue Router 4 |
| UI | Bootstrap 5 + custom CSS |
| Auth | Firebase Authentication |
| Database | Cloud Firestore (Modular SDK v10) |
| Hosting | Firebase Hosting |
| Avatars | Pravatar.cc |

## 📋 Academic Requirements

| Requirement | Implementation |
|-------------|---------------|
| **5 Screens** | Landing, Auth, Onboarding, Home (Swipe), Matches, Settings |
| **Firebase Auth** | Email/password login & registration |
| **Firestore** | `users`, `swipes`, `matches` collections |
| **v-model (×2)** | Onboarding form + Settings edit form |
| **Click events** | Swipe buttons, auth tabs, distance selector |
| **Mobile-first** | Bootstrap 5 grid + bottom navigation |
| **Accessibility** | ARIA labels, roles, semantic HTML throughout |
| **Modular SDK** | Firebase v10+ Modular API (tree-shakeable imports) |

## 🚀 Setup

### 1. Clone & Install

```bash
git clone <your-repo>
cd stranet
npm install
```

### 2. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable **Authentication** → Email/Password
4. Enable **Firestore Database** (start in test mode)
5. Enable **Hosting**

### 3. Configure Firebase

Copy your Firebase config from **Project Settings → General → Your apps**:

```js
// src/services/firebase.js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
}
```

### 4. Deploy Firestore Rules

```bash
npm install -g firebase-tools
firebase login
firebase init firestore
firebase deploy --only firestore:rules
```

### 5. Seed Demo Data (Optional)

```bash
npm install firebase-admin
# Download serviceAccountKey.json from Firebase Console > Service Accounts
# Place it in scripts/serviceAccountKey.json
node scripts/seed.js
```

### 6. Run Locally

```bash
npm run dev
```

### 7. Deploy to Firebase Hosting

```bash
npm run build
firebase deploy --only hosting
```

## 📁 Project Structure

```
stranet/
├── src/
│   ├── services/
│   │   └── firebase.js          # Firebase initialization (Modular SDK)
│   ├── store/
│   │   └── user.js              # Pinia store (auth, profile, dark mode)
│   ├── router/
│   │   └── index.js             # Vue Router + navigation guards
│   ├── components/
│   │   └── BottomNav.vue        # Mobile bottom navigation
│   ├── views/
│   │   ├── LandingView.vue      # Static landing page (Screen 1)
│   │   ├── AuthView.vue         # Login/Register (Screen 2)
│   │   ├── OnboardingView.vue   # Profile setup with v-model (Screen 3)
│   │   ├── HomeView.vue         # Swipe discovery (Screen 4)
│   │   ├── MatchesView.vue      # Matches list - real-time (Screen 5)
│   │   └── SettingsView.vue     # Profile edit + dark mode (Screen 6)
│   ├── App.vue
│   ├── main.js
│   └── style.css                # Global design system
├── scripts/
│   └── seed.js                  # Firestore demo data seeder
├── firebase.json                # Firebase Hosting config
├── firestore.rules              # Security rules
└── firestore.indexes.json       # Composite indexes
```

## 🗄 Database Schema

### `users/{uid}`
```
displayName: string
age: number
bio: string
photo: string (URL - Pravatar or custom)
lastActivity: string (URL)
stravaUrl: string
darkMode: boolean
updatedAt: timestamp
```

### `swipes/{id}`
```
fromId: string (UID)
toId: string (UID)
type: "like" | "pass"
timestamp: timestamp
```

### `matches/{id}`
```
user_ids: string[] ([uid1, uid2])
matchedAt: timestamp
```

## 🎨 Design System

- **Primary Color**: `#E8520A` (STRANET Orange)
- **Typography**: Barlow Condensed (display) + Barlow (body)
- **Theme**: Minimalist athletic — black, white, and orange
- **Dark Mode**: CSS class toggle on `<body>` with CSS variables

## 📱 Screens

1. **Landing** (`/`) — Static hero, how-it-works, CTA
2. **Auth** (`/auth`) — Login/Register tabs with Firebase
3. **Onboarding** (`/onboarding`) — 3-step profile setup (v-model)
4. **Home** (`/home`) — Card swipe with drag gesture & keyboard support
5. **Matches** (`/matches`) — Real-time matched runners list
6. **Settings** (`/settings`) — Profile edit (v-model) + dark mode toggle

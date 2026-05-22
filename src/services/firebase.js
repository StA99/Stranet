// src/services/firebase.js
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// ⚠️  Replace with your actual Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyC5jHrvZIEblEUueXYodWYNTS08jsjAs0w",
  authDomain: "stranet-5408d.firebaseapp.com",
  projectId: "stranet-5408d",
  storageBucket: "stranet-5408d.firebasestorage.app",
  messagingSenderId: "751690710760",
  appId: "1:751690710760:web:77e46aeb0096474e42935d",
  measurementId: "G-GTW9K3RMR4"
};

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export default app

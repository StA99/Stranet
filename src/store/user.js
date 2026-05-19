// src/store/user.js — Store Pinia per autenticazione e profilo utente
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../services/firebase'

export const useUserStore = defineStore('user', () => {

  // ── Stato reattivo ──────────────────────────────────────────────────────
  const currentUser = ref(null)
  const userProfile = ref(null)
  const loading = ref(true)
  const darkMode = ref(false)

  // ── Proprietà calcolate ─────────────────────────────────────────────────
  const isAuthenticated = computed(() => !!currentUser.value)
  const needsOnboarding = computed(() =>
    !!userProfile.value && (!userProfile.value.displayName || !userProfile.value.age)
  )

  // ── Inizializzazione listener Firebase Auth ─────────────────────────────
  function initAuth() {
    return new Promise(resolve => {
      onAuthStateChanged(auth, async (user) => {
        currentUser.value = user
        if (user) await fetchProfile(user.uid)
        else userProfile.value = null
        loading.value = false
        resolve(user)
      })
    })
  }

  // ── Caricamento profilo da Firestore ────────────────────────────────────
  async function fetchProfile(uid) {
    const snap = await getDoc(doc(db, 'users', uid))
    if (snap.exists()) {
      userProfile.value = { id: snap.id, ...snap.data() }
      // Ripristina dark mode dalla preferenza salvata
      if (userProfile.value.darkMode) {
        darkMode.value = true
        document.body.classList.add('dark-theme')
      }
    } else {
      userProfile.value = {}
    }
  }

  // ── Registrazione nuovo utente ──────────────────────────────────────────
  async function register(email, password) {
    const { user } = await createUserWithEmailAndPassword(auth, email, password)
    // Crea documento utente su Firestore (foto placeholder via ui-avatars)
    await setDoc(doc(db, 'users', user.uid), {
      photo: `https://ui-avatars.com/api/?background=E8520A&color=fff&size=150&bold=true&name=?`,
      bio: '',
      displayName: '',
      age: null,
      stravaUrl: '',
      lastActivity: '',
      updatedAt: serverTimestamp()
    })
    await fetchProfile(user.uid)
    return user
  }

  // ── Login ───────────────────────────────────────────────────────────────
  async function login(email, password) {
    const { user } = await signInWithEmailAndPassword(auth, email, password)
    await fetchProfile(user.uid)
    return user
  }

  // ── Logout ──────────────────────────────────────────────────────────────
  async function logout() {
    await signOut(auth)
    currentUser.value = null
    userProfile.value = null
    darkMode.value = false
    document.body.classList.remove('dark-theme')
  }

  // ── Aggiornamento profilo ───────────────────────────────────────────────
  async function updateProfile(data) {
    await updateDoc(doc(db, 'users', currentUser.value.uid), {
      ...data,
      updatedAt: serverTimestamp()
    })
    await fetchProfile(currentUser.value.uid)
  }

  // ── Toggle dark mode (persiste su Firestore) ────────────────────────────
  function toggleDarkMode() {
    darkMode.value = !darkMode.value
    document.body.classList.toggle('dark-theme', darkMode.value)
    if (currentUser.value) {
      updateDoc(doc(db, 'users', currentUser.value.uid), { darkMode: darkMode.value })
    }
  }

  return {
    currentUser, userProfile, loading, darkMode,
    isAuthenticated, needsOnboarding,
    initAuth, register, login, logout, updateProfile, toggleDarkMode
  }
})

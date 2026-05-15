// src/store/user.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore'
import { auth, db } from '../services/firebase'

export const useUserStore = defineStore('user', () => {
  const currentUser = ref(null)
  const userProfile = ref(null)
  const loading = ref(true)
  const darkMode = ref(false)

  const isAuthenticated = computed(() => !!currentUser.value)
  const needsOnboarding = computed(() => {
    if (!userProfile.value) return false
    return !userProfile.value.displayName || !userProfile.value.age
  })

  function initAuth() {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, async (user) => {
        currentUser.value = user
        if (user) {
          await fetchProfile(user.uid)
        } else {
          userProfile.value = null
        }
        loading.value = false
        resolve(user)
      })
    })
  }

  async function fetchProfile(uid) {
    const snap = await getDoc(doc(db, 'users', uid))
    if (snap.exists()) {
      userProfile.value = { id: snap.id, ...snap.data() }
      if (userProfile.value.darkMode) {
        darkMode.value = true
        document.body.classList.add('dark-theme')
      }
    } else {
      userProfile.value = {}
    }
  }

  async function register(email, password) {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    const uid = cred.user.uid
    const photo = `https://i.pravatar.cc/150?u=${uid}`
    await setDoc(doc(db, 'users', uid), {
      photo,
      bio: '',
      displayName: '',
      age: null,
      stravaUrl: '',
      lastActivity: '',
      updatedAt: serverTimestamp()
    })
    await fetchProfile(uid)
    return cred.user
  }

  async function login(email, password) {
    const cred = await signInWithEmailAndPassword(auth, email, password)
    await fetchProfile(cred.user.uid)
    return cred.user
  }

  async function logout() {
    await signOut(auth)
    currentUser.value = null
    userProfile.value = null
    darkMode.value = false
    document.body.classList.remove('dark-theme')
  }

  async function updateProfile(data) {
    const uid = currentUser.value.uid
    await updateDoc(doc(db, 'users', uid), {
      ...data,
      updatedAt: serverTimestamp()
    })
    await fetchProfile(uid)
  }

  function toggleDarkMode() {
    darkMode.value = !darkMode.value
    if (darkMode.value) {
      document.body.classList.add('dark-theme')
    } else {
      document.body.classList.remove('dark-theme')
    }
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

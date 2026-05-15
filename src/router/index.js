// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../store/user'

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: () => import('../views/LandingView.vue'),
    meta: { public: true }
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('../views/AuthView.vue'),
    meta: { public: true, redirectIfAuth: true }
  },
  {
    path: '/onboarding',
    name: 'Onboarding',
    component: () => import('../views/OnboardingView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/HomeView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/matches',
    name: 'Matches',
    component: () => import('../views/MatchesView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/SettingsView.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  if (userStore.loading) {
    await userStore.initAuth()
  }

  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    return next('/auth')
  }

  if (to.meta.redirectIfAuth && userStore.isAuthenticated) {
    if (userStore.needsOnboarding) return next('/onboarding')
    return next('/home')
  }

  if (to.meta.requiresAuth && userStore.isAuthenticated) {
    if (userStore.needsOnboarding && to.name !== 'Onboarding') {
      return next('/onboarding')
    }
  }

  next()
})

export default router

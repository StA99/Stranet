<template>
  <header class="stranet-top-nav" role="banner" translate="no">
    <!-- Logo -->
    <router-link to="/home" class="stranet-logo" aria-label="STRANET home">
      STRA<span>NET</span>
    </router-link>

    <!-- Nav links -->
    <nav class="top-nav-links" role="navigation" aria-label="Navigazione principale">
      <router-link to="/home" class="top-nav-item" :class="{ active: route.name === 'Home' }" aria-label="Scopri corridori">
        <span class="material-symbols-rounded nav-icon" aria-hidden="true" translate="no">explore</span>
        <span class="nav-label">Scopri</span>
      </router-link>
      <router-link to="/matches" class="top-nav-item" :class="{ active: route.name === 'Matches' }" aria-label="I tuoi match">
        <span class="material-symbols-rounded nav-icon" aria-hidden="true" translate="no">bolt</span>
        <span class="nav-label">Match</span>
      </router-link>
    </nav>

    <!-- Avatar → Settings oppure Accedi se non autenticato -->
    <router-link
      v-if="storeUtente.isAuthenticated"
      to="/settings"
      class="nav-avatar-link"
      :class="{ active: route.name === 'Settings' }"
      aria-label="Impostazioni profilo"
    >
      <img
        :src="urlFoto(storeUtente.userProfile)"
        :alt="`Foto di ${storeUtente.userProfile?.displayName || 'profilo'}`"
        class="nav-avatar-img"
        @error="gestisciErroreAvatar"
      />
    </router-link>

    <router-link v-else to="/auth" class="btn-accedi-nav" aria-label="Accedi a STRANET">
      Accedi
    </router-link>
  </header>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useUserStore } from '../store/user'
import { urlFoto, urlFallbackAvatar } from '../services/media'

const route = useRoute()
const storeUtente = useUserStore()

function gestisciErroreAvatar(evento) {
  if (storeUtente.userProfile) storeUtente.userProfile._avatarRotto = true
  evento.target.src = urlFallbackAvatar(storeUtente.userProfile?.displayName)
}
</script>

<style scoped>
.stranet-top-nav {
  background: var(--nav-bg);
  padding: 0 1.5rem;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  gap: 1rem;
}

.top-nav-links { display: flex; align-items: center; gap: 0.25rem; }

.top-nav-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: rgba(255,255,255,0.45);
  text-decoration: none;
  font-family: var(--font-display);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0.45rem 0.875rem;
  border-radius: 4px;
  transition: color 0.2s, background 0.2s;
  white-space: nowrap;
}

.top-nav-item:hover { color: rgba(255,255,255,0.85); background: rgba(255,255,255,0.06); }
.top-nav-item.active { color: var(--orange); background: rgba(232,82,10,0.1); }

.nav-icon {
  font-size: 1.15rem;
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

.top-nav-item.active .nav-icon { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }

.nav-label { line-height: 1; }

/* Avatar */
.nav-avatar-link {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  border-radius: 50%;
  transition: box-shadow 0.2s, opacity 0.2s;
  outline: none;
}

.nav-avatar-link:hover,
.nav-avatar-link.active { box-shadow: 0 0 0 2px var(--orange); }

.nav-avatar-img {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--orange);
  display: block;
  background: #333;
}

/* Pulsante Accedi (utenti non autenticati) */
.btn-accedi-nav {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background: var(--orange);
  color: #fff;
  border: none;
  border-radius: 2px;
  padding: 0.45rem 1rem;
  text-decoration: none;
  flex-shrink: 0;
  transition: background 0.2s;
}

.btn-accedi-nav:hover { background: var(--orange-dark); }

@media (max-width: 380px) {
  .nav-label { display: none; }
  .top-nav-item { padding: 0.45rem 0.6rem; }
}
</style>

<template>
  <div class="page-content" translate="no">
    <TopNav />

    <main role="main" class="matches-main">
      <div class="matches-header">
        <h1 class="display-font matches-title">I Tuoi Match</h1>
        <p class="matches-sub">Corridori che ti hanno messo mi piace</p>
      </div>

      <!-- Barra di ricerca — type="text" per evitare la X nativa del browser -->
      <div class="search-wrap mb-4" role="search">
        <span class="material-symbols-rounded search-icon" aria-hidden="true">search</span>
        <input
          v-model="queryRicerca"
          type="text"
          class="search-input"
          placeholder="Cerca tra i tuoi match..."
          aria-label="Cerca match per nome o bio"
          autocomplete="off"
          spellcheck="false"
        />
        <button
          v-if="queryRicerca"
          class="search-clear"
          @click="queryRicerca = ''"
          aria-label="Cancella ricerca"
        >
          <span class="material-symbols-rounded" aria-hidden="true">close</span>
        </button>
      </div>

      <!-- Caricamento -->
      <div v-if="caricamento" class="empty-state" aria-live="polite">
        <span class="material-symbols-rounded empty-icon" aria-hidden="true">hourglass_top</span>
        <div class="empty-state-title">Caricamento Match</div>
      </div>

      <!-- Nessun match -->
      <div v-else-if="listaMatch.length === 0" class="empty-state" role="status">
        <span class="material-symbols-rounded empty-icon" aria-hidden="true">directions_run</span>
        <div class="empty-state-title">Nessun Match Ancora</div>
        <div class="empty-state-text">Continua a fare swipe per trovare il tuo compagno di corsa!</div>
        <router-link to="/home" class="btn-stranet btn-stranet-primary mt-3 text-decoration-none d-inline-flex align-items-center gap-2">
          <span class="material-symbols-rounded" style="font-size:1rem;" aria-hidden="true">explore</span>
          Scopri Corridori
        </router-link>
      </div>

      <!-- Nessun risultato ricerca -->
      <div v-else-if="matchFiltrati.length === 0" class="empty-state" role="status" aria-live="polite">
        <span class="material-symbols-rounded empty-icon" aria-hidden="true">manage_search</span>
        <div class="empty-state-title">Nessun risultato</div>
        <div class="empty-state-text">Nessun match trovato per "{{ queryRicerca }}"</div>
      </div>

      <!-- Lista match -->
      <ul v-else class="matches-list fade-in" role="list" aria-label="I tuoi match">
        <li v-for="match in matchFiltrati" :key="match.id" role="listitem">
          <a
            :href="match.stravaUrl || '#'"
            :target="match.stravaUrl ? '_blank' : '_self'"
            rel="noopener noreferrer"
            class="match-item"
            :aria-label="`${match.displayName}, ${match.age} anni. ${match.stravaUrl ? 'Apri profilo Strava' : 'Nessun link Strava disponibile'}`"
          >
            <img
              :src="urlFoto(match)"
              :alt="`Foto profilo di ${match.displayName}`"
              class="match-avatar"
              @error="gestisciErroreFoto($event, match)"
            />
            <div class="match-info">
              <div class="match-name">{{ match.displayName }}</div>
              <div class="match-meta">
                <span class="material-symbols-rounded meta-icon" aria-hidden="true">cake</span>
                {{ match.age }} anni
              </div>
              <div class="match-bio" v-if="match.bio">{{ match.bio }}</div>
            </div>
            <div class="match-action">
              <span
                class="material-symbols-rounded strava-btn"
                :style="{ color: match.stravaUrl ? 'var(--orange)' : 'var(--gray-400)' }"
                aria-hidden="true"
              >{{ match.stravaUrl ? 'open_in_new' : 'link_off' }}</span>
            </div>
          </a>
        </li>
      </ul>

      <!-- Contatore risultati -->
      <p
        v-if="listaMatch.length > 0 && queryRicerca"
        class="results-count"
        aria-live="polite"
      >
        {{ matchFiltrati.length }} di {{ listaMatch.length }} match
      </p>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { collection, query, where, onSnapshot, getDoc, doc } from 'firebase/firestore'
import { db } from '../services/firebase'
import { urlFoto, urlFallbackAvatar } from '../services/media'
import { useUserStore } from '../store/user'
import TopNav from '../components/TopNav.vue'

const storeUtente = useUserStore()

const listaMatch = ref([])
const caricamento = ref(true)
const queryRicerca = ref('')
let annullaAscolto = null

// Gestisce errore foto: segna l'utente e usa fallback
function gestisciErroreFoto(evento, utente) {
  utente._fotoRotta = true
  evento.target.src = urlFallbackAvatar(utente.displayName)
}

const matchFiltrati = computed(() => {
  if (!queryRicerca.value.trim()) return listaMatch.value
  const q = queryRicerca.value.toLowerCase()
  return listaMatch.value.filter(m =>
    m.displayName?.toLowerCase().includes(q) ||
    m.bio?.toLowerCase().includes(q)
  )
})

onMounted(() => {
  const uid = storeUtente.currentUser.uid
  const q = query(collection(db, 'matches'), where('user_ids', 'array-contains', uid))
  annullaAscolto = onSnapshot(q, async (snap) => {
    const risultati = []
    for (const d of snap.docs) {
      const dati = d.data()
      const altroId = dati.user_ids.find(id => id !== uid)
      if (altroId) {
        try {
          const snapUtente = await getDoc(doc(db, 'users', altroId))
          if (snapUtente.exists()) {
            risultati.push({ id: snapUtente.id, matchId: d.id, _fotoRotta: false, ...snapUtente.data() })
          }
        } catch (e) { console.error('Errore caricamento utente match:', e) }
      }
    }
    listaMatch.value = risultati
    caricamento.value = false
  })
})

onUnmounted(() => { if (annullaAscolto) annullaAscolto() })
</script>

<style scoped>
.matches-main { padding: 1.5rem 1rem; max-width: 640px; margin: 0 auto; }

.matches-header { margin-bottom: 1.5rem; }

.matches-title { font-size: 2rem; color: var(--text-primary); }

.matches-sub { color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.25rem; }

/* Barra ricerca */
.search-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 0.875rem;
  color: var(--text-secondary);
  font-size: 1.2rem;
  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
  pointer-events: none;
}

.search-input {
  width: 100%;
  background: var(--gray-100);
  border: 2px solid var(--border-color);
  border-radius: 100px;
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 0.9rem;
  padding: 0.7rem 2.5rem 0.7rem 2.75rem;
  outline: none;
  transition: border-color 0.2s;
  /* Rimuove X nativa su alcuni browser */
  -webkit-appearance: none;
  appearance: none;
}

.search-input:focus { border-color: var(--orange); }
.search-input::placeholder { color: var(--text-secondary); }
/* Rimuove la X di IE/Edge */
.search-input::-ms-clear { display: none; }

.search-clear {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  padding: 0.2rem;
  border-radius: 50%;
  transition: color 0.2s, background 0.2s;
}

.search-clear:hover {
  color: var(--text-primary);
  background: var(--gray-200);
}

.search-clear .material-symbols-rounded { font-size: 1rem; }

/* Empty state */
.empty-icon {
  font-size: 3.5rem;
  color: var(--orange);
  font-variation-settings: 'FILL' 1, 'wght' 300, 'GRAD' 0, 'opsz' 48;
  margin-bottom: 0.75rem;
  display: block;
}

/* Lista */
.matches-list { list-style: none; padding: 0; margin: 0; }

.match-info { flex: 1; min-width: 0; }

.match-name {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 1.05rem;
  text-transform: uppercase;
  color: var(--text-primary);
  letter-spacing: 0.01em;
}

.match-meta {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--orange);
  font-size: 0.8rem;
  font-weight: 600;
  margin-top: 0.15rem;
}

.meta-icon {
  font-size: 0.85rem;
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20;
}

.match-bio {
  color: var(--text-secondary);
  font-size: 0.8rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 0.2rem;
}

.match-action { flex-shrink: 0; }

.strava-btn {
  font-size: 1.3rem;
  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
}

.results-count {
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.8rem;
  margin-top: 1rem;
}
</style>

<template>
  <div class="page-content" translate="no">
    <TopNav />

    <main role="main" class="home-main">
      <!-- Caricamento -->
      <div v-if="caricamento" class="empty-state" aria-live="polite">
        <span class="material-symbols-rounded empty-icon" aria-hidden="true" translate="no">hourglass_top</span>
        <div class="empty-state-title">Ricerca Corridori</div>
        <div class="empty-state-text">Stiamo cercando il tuo prossimo compagno di corsa...</div>
      </div>

      <!-- Nessun candidato -->
      <div v-else-if="candidati.length === 0" class="empty-state" role="status">
        <span class="material-symbols-rounded empty-icon" aria-hidden="true" translate="no">celebration</span>
        <div class="empty-state-title">Hai visto tutti!</div>
        <div class="empty-state-text">Torna più tardi per nuovi corridori nella tua zona.</div>
        <button class="btn-stranet btn-stranet-primary mt-3" @click="caricaCandidati">
          <span class="material-symbols-rounded" aria-hidden="true" translate="no"
            style="font-size:1rem;vertical-align:middle;margin-right:4px;">refresh</span>
          Ricarica
        </button>
      </div>

      <!-- Stack swipe -->
      <div v-else class="swipe-area">
        <div class="swipe-count" aria-live="polite">
          <span class="tag-badge">
            <span class="material-symbols-rounded" aria-hidden="true" translate="no"
              style="font-size:0.75rem;vertical-align:middle;margin-right:3px;">location_on</span>
            {{ candidati.length }} corridori vicini
          </span>
        </div>

        <!-- Wrapper stack fisso — i bottoni stanno FUORI -->
        <div class="swipe-stack-wrap">

          <!-- Card dietro (ghost) -->
          <div v-if="candidati.length > 1" class="runner-card card-dietro" aria-hidden="true">
            <img
              :src="urlAttivita(candidati[1])"
              alt=""
              class="card-activity-img"
              draggable="false"
              referrerpolicy="no-referrer"
            />
          </div>

          <!-- Card principale — draggable, no testo "Pass/Mi piace" dentro -->
          <div
            ref="cartaRef"
            class="runner-card card-principale"
            :class="{ 'animating': staAnimando }"
            :style="stileCarta"
            @mousedown="iniziaDrag"
            @touchstart.prevent="iniziaDragTouch"
            @mousemove="onDrag"
            @touchmove.prevent="onDragTouch"
            @mouseup="fineDrag"
            @touchend="fineDrag"
            @mouseleave="fineDrag"
            tabindex="0"
            @keydown.right.prevent="swipeAnimato('like')"
            @keydown.left.prevent="swipeAnimato('pass')"
            role="article"
            :aria-label="`${corrente?.displayName}, ${corrente?.age} anni`"
          >
            <!-- Overlay LIKE — solo icona, niente testo -->
            <div class="swipe-overlay overlay-like" :style="{ opacity: opacitaLike }" aria-hidden="true">
              <span class="material-symbols-rounded overlay-icon" translate="no"
                style="font-variation-settings:'FILL' 1,'wght' 700,'GRAD' 0,'opsz' 48;">favorite</span>
            </div>
            <!-- Overlay PASS — solo icona -->
            <div class="swipe-overlay overlay-pass" :style="{ opacity: opacitaPass }" aria-hidden="true">
              <span class="material-symbols-rounded overlay-icon" translate="no"
                style="font-variation-settings:'FILL' 1,'wght' 700,'GRAD' 0,'opsz' 48;">close</span>
            </div>

            <!-- Foto attività grande — draggable disabilitato -->
            <div class="card-activity-wrap">
              <img
                v-if="corrente"
                :key="corrente.id + '_att'"
                :src="urlAttivita(corrente)"
                :alt="`Ultima corsa di ${corrente.displayName}`"
                class="card-activity-img"
                draggable="false"
                @error="onErroreAttivita"
                referrerpolicy="no-referrer"
              />
              <div v-else class="card-activity-placeholder">
                <span class="material-symbols-rounded placeholder-icon" aria-hidden="true" translate="no">directions_run</span>
              </div>
            </div>

            <!-- Info overlay con avatar tondo piccolo -->
            <div class="card-info-overlay">
              <img
                :src="urlFoto(corrente)"
                :alt="`Foto di ${corrente?.displayName}`"
                class="card-avatar"
                draggable="false"
                @error="onErroreFoto"
              />
              <div class="card-info-testo">
                <div class="card-nome">{{ corrente?.displayName }}<span class="card-eta">, {{ corrente?.age }}</span></div>
                <div class="card-bio" v-if="corrente?.bio">{{ corrente.bio }}</div>
                <div class="card-bio no-bio" v-else>Nessuna bio</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottoni azione con label SOTTO — testo "Like" e "Passa" -->
        <div class="action-row" role="group" aria-label="Azioni swipe">
          <div class="action-col">
            <button
              class="action-btn btn-pass"
              @click="swipeAnimato('pass')"
              aria-label="Passa questo corridore"
            >
              <span class="material-symbols-rounded" aria-hidden="true" translate="no"
                style="font-size:2rem;font-variation-settings:'FILL' 0,'wght' 300,'GRAD' 0,'opsz' 48;">close</span>
            </button>
            <span class="action-label">Passa</span>
          </div>
          <div class="action-col">
            <button
              class="action-btn btn-like"
              @click="swipeAnimato('like')"
              aria-label="Like questo corridore"
            >
              <span class="material-symbols-rounded" aria-hidden="true" translate="no"
                style="font-size:2rem;font-variation-settings:'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 48;">favorite</span>
            </button>
            <span class="action-label action-label--like">Like</span>
          </div>
        </div>

      </div>
    </main>

    <!-- Modale Match -->
    <div v-if="mostraMatch" class="match-modal" role="dialog" aria-modal="true" aria-labelledby="match-titolo">
      <div class="match-modal-content">
        <span class="material-symbols-rounded match-star" aria-hidden="true" translate="no">star</span>
        <h2 id="match-titolo" class="display-font match-titolo">È un Match!</h2>
        <div class="match-avatars">
          <img :src="urlFoto(storeUtente.userProfile)" alt="La tua foto" class="match-avatar-img" />
          <span class="material-symbols-rounded match-bolt" aria-hidden="true" translate="no">bolt</span>
          <img :src="urlFoto(utenteMatchato)" :alt="`Foto di ${utenteMatchato?.displayName}`" class="match-avatar-img" />
        </div>
        <p class="match-desc">Tu e <strong>{{ utenteMatchato?.displayName }}</strong> volete correre insieme!</p>
        <div class="d-flex flex-column gap-2 w-100 mt-3">
          <a v-if="utenteMatchato?.stravaUrl"
            :href="utenteMatchato.stravaUrl" target="_blank" rel="noopener noreferrer"
            class="btn-stranet btn-stranet-primary text-center text-decoration-none d-flex align-items-center justify-content-center gap-2">
            <span class="material-symbols-rounded" aria-hidden="true" translate="no" style="font-size:1rem;">open_in_new</span>
            Vedi su Strava
          </a>
          <button class="btn-stranet btn-stranet-outline" @click="mostraMatch = false">Continua</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../services/firebase'
import { useUserStore } from '../store/user'
import TopNav from '../components/TopNav.vue'

const storeUtente = useUserStore()
const cartaRef = ref(null)

// ── Gestione URL foto e attività ───────────────────────────────────────────

/**
 * Converte URL Google Drive sharing → URL diretto visualizzabile.
 * Es. https://drive.google.com/file/d/FILE_ID/view
 *  → https://drive.google.com/thumbnail?id=FILE_ID&sz=w600
 *
 * Supporta anche /open?id=, formati brevi drive.google.com/...
 */
function convertiUrlDrive(url) {
  if (!url) return null
  // Formato: /file/d/FILE_ID/...
  const matchFile = url.match(/\/file\/d\/([^/?#]+)/)
  if (matchFile) return `https://drive.google.com/thumbnail?id=${matchFile[1]}&sz=w600`
  // Formato: ?id=FILE_ID o open?id=FILE_ID
  const matchId = url.match(/[?&]id=([^&]+)/)
  if (matchId) return `https://drive.google.com/thumbnail?id=${matchId[1]}&sz=w600`
  return url
}

function urlFoto(utente) {
  if (!utente) return urlFallbackAvatar('?')
  if (utente._avatarRotto) return urlFallbackAvatar(utente.displayName)
  if (!utente.photo) return urlFallbackAvatar(utente.displayName)
  return convertiUrlDrive(utente.photo) || urlFallbackAvatar(utente.displayName)
}

function urlFallbackAvatar(nome) {
  return `https://ui-avatars.com/api/?background=E8520A&color=fff&size=150&bold=true&name=${encodeURIComponent(nome || '?')}`
}

function urlAttivita(utente) {
  if (!utente?.lastActivity) return urlFallbackAttivita()
  return convertiUrlDrive(utente.lastActivity) || urlFallbackAttivita()
}

function urlFallbackAttivita() {
  return 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=600&q=80'
}

function onErroreFoto(evento) {
  if (corrente.value) corrente.value._avatarRotto = true
  evento.target.src = urlFallbackAvatar(corrente.value?.displayName)
}

function onErroreAttivita(evento) {
  evento.target.src = urlFallbackAttivita()
}

// ── Stato swipe ────────────────────────────────────────────────────────────

const candidati = ref([])
const caricamento = ref(true)
const mostraMatch = ref(false)
const utenteMatchato = ref(null)
const staAnimando = ref(false)

// Drag state
const dragging = ref(false)
const startX = ref(0)
const startY = ref(0)
const deltaX = ref(0)
const deltaY = ref(0)

const SOGLIA = 90  // px prima del rilascio automatico

const corrente = computed(() => candidati.value[0] || null)

const stileCarta = computed(() => {
  if (staAnimando.value) return {} // La classe .animating gestisce la transizione CSS
  if (!dragging.value) return {}
  const dx = deltaX.value
  const dy = deltaY.value * 0.3 // leggero effetto verticale
  const rotazione = dx * 0.05
  return {
    transform: `translateX(${dx}px) translateY(${dy}px) rotate(${rotazione}deg)`,
    transition: 'none',
  }
})

const opacitaLike = computed(() => Math.max(0, Math.min(1, deltaX.value / 60)))
const opacitaPass = computed(() => Math.max(0, Math.min(1, -deltaX.value / 60)))

// ── Drag handlers ──────────────────────────────────────────────────────────

function iniziaDrag(e) {
  if (staAnimando.value) return
  dragging.value = true
  startX.value = e.clientX
  startY.value = e.clientY
  deltaX.value = 0
  deltaY.value = 0
}

function iniziaDragTouch(e) {
  if (staAnimando.value) return
  dragging.value = true
  startX.value = e.touches[0].clientX
  startY.value = e.touches[0].clientY
  deltaX.value = 0
  deltaY.value = 0
}

function onDrag(e) {
  if (!dragging.value || staAnimando.value) return
  deltaX.value = e.clientX - startX.value
  deltaY.value = e.clientY - startY.value
}

function onDragTouch(e) {
  if (!dragging.value || staAnimando.value) return
  deltaX.value = e.touches[0].clientX - startX.value
  deltaY.value = e.touches[0].clientY - startY.value
}

function fineDrag() {
  if (!dragging.value) return
  dragging.value = false
  if (Math.abs(deltaX.value) >= SOGLIA) {
    swipeAnimato(deltaX.value > 0 ? 'like' : 'pass')
  } else {
    // Ritorna alla posizione originale con animazione spring
    deltaX.value = 0
    deltaY.value = 0
  }
}

// ── Swipe con animazione di uscita ─────────────────────────────────────────

/**
 * Anima la carta fuori dallo schermo, poi aggiunge il record Firebase.
 * Chiamato sia dal drag (fineDrag) che dai bottoni.
 */
async function swipeAnimato(tipo) {
  if (!corrente.value || staAnimando.value) return
  staAnimando.value = true
  dragging.value = false

  const carta = cartaRef.value
  if (carta) {
    const direzione = tipo === 'like' ? 1 : -1
    const vx = direzione * 120   // vx target per animazione
    const rot = direzione * 20

    // Imposta trasformazione finale tramite CSS custom property
    carta.style.transition = 'transform 0.35s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.35s ease'
    carta.style.transform = `translateX(${direzione * 120}vw) rotate(${rot}deg)`
    carta.style.opacity = '0'

    await attendi(360)

    // Reset stile prima di togliere la carta
    carta.style.transition = ''
    carta.style.transform = ''
    carta.style.opacity = ''
  }

  deltaX.value = 0
  deltaY.value = 0
  staAnimando.value = false

  await eseguiSwipe(tipo)
}

function attendi(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// ── Firebase ───────────────────────────────────────────────────────────────

async function caricaCandidati() {
  caricamento.value = true
  try {
    const uid = storeUtente.currentUser.uid
    const snapSwipe = await getDocs(query(collection(db, 'swipes'), where('fromId', '==', uid)))
    const idSwipati = new Set(snapSwipe.docs.map(d => d.data().toId))
    idSwipati.add(uid)
    const snapUtenti = await getDocs(collection(db, 'users'))
    candidati.value = snapUtenti.docs
      .filter(d => !idSwipati.has(d.id) && d.data().displayName)
      .map(d => ({ id: d.id, _avatarRotto: false, ...d.data() }))
      .sort(() => Math.random() - 0.5)
  } catch (e) { console.error('Errore caricamento candidati:', e) }
  finally { caricamento.value = false }
}

async function eseguiSwipe(tipo) {
  if (!candidati.value.length) return
  const obiettivo = candidati.value.shift()
  const uid = storeUtente.currentUser.uid
  try {
    await addDoc(collection(db, 'swipes'), {
      fromId: uid, toId: obiettivo.id, type: tipo, timestamp: serverTimestamp()
    })
    if (tipo === 'like') {
      const reverso = await getDocs(query(
        collection(db, 'swipes'),
        where('fromId', '==', obiettivo.id),
        where('toId', '==', uid),
        where('type', '==', 'like')
      ))
      if (!reverso.empty) {
        await addDoc(collection(db, 'matches'), {
          user_ids: [uid, obiettivo.id], matchedAt: serverTimestamp()
        })
        utenteMatchato.value = obiettivo
        mostraMatch.value = true
      }
    }
  } catch (e) { console.error('Errore swipe Firebase:', e) }
}

// Blocca mousemove/touchmove globale durante drag per evitare selezione testo
function bloccaSelezione(e) { e.preventDefault() }

onMounted(() => {
  caricaCandidati()
  document.addEventListener('selectstart', bloccaSelezione)
})
onUnmounted(() => {
  document.removeEventListener('selectstart', bloccaSelezione)
})
</script>

<style scoped>
.home-main {
  padding: 1.25rem 1rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: calc(100vh - 60px);
}

.empty-icon {
  font-size: 3.5rem;
  color: var(--orange);
  font-variation-settings: 'FILL' 1, 'wght' 300, 'GRAD' 0, 'opsz' 48;
  margin-bottom: 0.75rem;
  display: block;
}

/* ── Area swipe ── */
.swipe-area {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
}

.swipe-count { text-align: center; }

.swipe-stack-wrap {
  position: relative;
  width: 100%;
  max-width: 360px;
  height: 460px;
}

/* ── Cards ── */
.runner-card {
  border-radius: 16px;
  overflow: hidden;
  background: var(--card-bg);
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 460px;
  display: flex;
  flex-direction: column;
  /* Impedisce selezione testo durante drag */
  user-select: none;
  -webkit-user-select: none;
}

.card-dietro {
  top: 10px; left: 8px; right: 8px;
  height: 460px;
  opacity: 0.5;
  transform: scale(0.96);
  pointer-events: none;
  z-index: 0;
}

.card-principale {
  z-index: 1;
  cursor: grab;
  /* Transizione di ritorno al centro — override con transition:none durante drag */
  transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1);
  will-change: transform;
  touch-action: none;
}

.card-principale:active { cursor: grabbing; }

/* ── Immagine attività ── */
.card-activity-wrap {
  flex: 1;
  position: relative;
  overflow: hidden;
  background: var(--gray-200);
  min-height: 0;
}

.card-activity-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  /* Impedisce drag nativo dell'immagine */
  pointer-events: none;
  -webkit-user-drag: none;
  user-select: none;
}

.card-activity-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gray-100);
}

.placeholder-icon {
  font-size: 4rem;
  color: var(--gray-400);
  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 48;
}

/* ── Info overlay ── */
.card-info-overlay {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  padding: 4rem 1.25rem 1.1rem;
  background: linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.55) 65%, transparent 100%);
  display: flex;
  align-items: flex-end;
  gap: 0.75rem;
  pointer-events: none;
}

.card-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2.5px solid var(--orange);
  flex-shrink: 0;
  display: block;
  background: #333;
  pointer-events: none;
  -webkit-user-drag: none;
}

.card-info-testo { flex: 1; min-width: 0; }

.card-nome {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 1.4rem;
  text-transform: uppercase;
  color: #fff;
  line-height: 1.1;
  letter-spacing: 0.01em;
}

.card-eta { font-size: 1rem; color: rgba(255,255,255,0.7); }

.card-bio {
  font-size: 0.8rem;
  color: rgba(255,255,255,0.65);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 0.2rem;
}

.no-bio { font-style: italic; opacity: 0.6; }

/* ── Overlay LIKE / PASS (solo icona, niente testo) ── */
.swipe-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  pointer-events: none;
  z-index: 10;
}

.overlay-like { background: rgba(232,82,10,0.2); border: 4px solid var(--orange); }
.overlay-pass { background: rgba(0,0,0,0.2); border: 4px solid rgba(255,255,255,0.45); }

.overlay-icon {
  font-size: 5.5rem;
  color: #fff;
  filter: drop-shadow(0 2px 12px rgba(0,0,0,0.5));
}

/* ── Bottoni con label sotto ── */
.action-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3rem;
  position: relative;
  z-index: 2;
}

.action-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
}

.action-label {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-secondary);
}

.action-label--like { color: var(--orange); }

/* ── Modale match ── */
.match-modal {
  position: fixed; inset: 0; background: rgba(0,0,0,0.85);
  display: flex; align-items: center; justify-content: center; z-index: 200; padding: 1.5rem;
}

.match-modal-content {
  background: var(--card-bg); border-radius: 12px; padding: 2.5rem 2rem;
  max-width: 340px; width: 100%; text-align: center; animation: slideInCard 0.4s ease;
}

.match-star {
  font-size: 3.5rem; color: var(--orange);
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 48;
}

.match-titolo { font-size: 2.5rem; color: var(--orange); margin: 0.5rem 0 1rem; }

.match-avatars { display: flex; align-items: center; justify-content: center; gap: 1rem; margin-bottom: 1rem; }

.match-avatar-img { width: 72px; height: 72px; border-radius: 50%; object-fit: cover; border: 3px solid var(--orange); }

.match-bolt {
  font-size: 2.2rem; color: var(--orange);
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 48;
}

.match-desc { color: var(--text-secondary); font-size: 0.9rem; }
</style>

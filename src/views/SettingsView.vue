<template>
  <div class="page-content" translate="no">
    <TopNav />

    <main role="main" class="settings-main">

      <!-- Anteprima profilo con selettore avatar -->
      <div class="profile-hero stranet-card p-4 mb-4 fade-in">
        <div class="d-flex align-items-center gap-3">
          <!-- Avatar cliccabile per cambiarlo -->
          <div class="avatar-wrap">
            <img
              :src="avatarCorrente"
              alt="La tua foto profilo"
              class="profile-avatar-img"
            />
            <button
              type="button"
              class="btn-cambia-avatar-overlay"
              @click="cambiaAvatar"
              aria-label="Scegli un avatar diverso"
            >
              <span class="material-symbols-rounded" aria-hidden="true" translate="no"
                style="font-size:1.1rem;">shuffle</span>
            </button>
          </div>
          <div>
            <div class="display-font profile-hero-name">{{ form.displayName || 'Il Tuo Nome' }}</div>
            <div class="profile-hero-email">{{ storeUtente.currentUser?.email }}</div>
            <button type="button" class="btn-shuffle-hint" @click="cambiaAvatar">
              Cambia avatar
            </button>
          </div>
        </div>
      </div>

      <!-- Form modifica profilo -->
      <section aria-labelledby="edit-title" class="stranet-card p-4 mb-4 fade-in">
        <h2 id="edit-title" class="display-font section-h">
          <span class="material-symbols-rounded section-icon" aria-hidden="true" translate="no">edit</span>
          Modifica Profilo
        </h2>

        <div v-if="messaggioSuccesso" class="success-alert mb-3" role="status" aria-live="polite">
          <span class="material-symbols-rounded" aria-hidden="true" translate="no"
            style="font-size:1rem;vertical-align:middle;margin-right:6px;">check_circle</span>
          {{ messaggioSuccesso }}
        </div>
        <div v-if="errore" class="stranet-alert mb-3" role="alert" aria-live="polite">
          <span class="material-symbols-rounded" aria-hidden="true" translate="no"
            style="font-size:1rem;vertical-align:middle;margin-right:6px;">error</span>
          {{ errore }}
        </div>

        <div class="mb-3">
          <label for="s-displayName" class="stranet-label">Nome Visualizzato</label>
          <input id="s-displayName" v-model="form.displayName" type="text" class="stranet-input"
            placeholder="Il tuo nome" maxlength="40" aria-required="true" />
        </div>

        <div class="mb-3">
          <label for="s-age" class="stranet-label">Età</label>
          <input id="s-age" v-model.number="form.age" type="number" class="stranet-input" min="16" max="90" />
        </div>

        <div class="mb-3">
          <label for="s-bio" class="stranet-label">Bio</label>
          <textarea id="s-bio" v-model="form.bio" class="stranet-input" rows="3" maxlength="200"
            placeholder="Racconta agli altri corridori di te..." aria-describedby="s-bio-count"></textarea>
          <div id="s-bio-count" class="text-end" style="color:var(--text-secondary);font-size:0.75rem;">
            {{ form.bio.length }}/200
          </div>
        </div>

        <div class="mb-3">
          <label for="s-stravaUrl" class="stranet-label">URL Profilo Strava</label>
          <div class="input-icon-wrap">
            <span class="material-symbols-rounded input-icon" aria-hidden="true" translate="no">link</span>
            <input id="s-stravaUrl" v-model="form.stravaUrl" type="text" class="stranet-input input-with-icon"
              placeholder="https://www.strava.com/athletes/..." autocomplete="off" spellcheck="false" />
          </div>
        </div>

        <div class="mb-4">
          <label for="s-lastActivity" class="stranet-label">URL Foto Ultima Attività</label>
          <div class="input-icon-wrap">
            <span class="material-symbols-rounded input-icon" aria-hidden="true" translate="no">image</span>
            <input
              id="s-lastActivity"
              :value="form.lastActivity"
              @input="form.lastActivity = $event.target.value; anteprimaRotta = false"
              type="text"
              class="stranet-input input-with-icon"
              placeholder="https://example.com/my-run.jpg"
              autocomplete="off"
              spellcheck="false"
            />
          </div>
          <!-- Anteprima immagine attività -->
          <div v-if="form.lastActivity && !anteprimaRotta" class="activity-preview-wrap mt-2">
            <img :src="form.lastActivity" alt="Anteprima foto ultima attività"
              class="activity-preview-img"
              @error="anteprimaRotta = true"
              @load="anteprimaRotta = false"
              referrerpolicy="no-referrer" />
          </div>
          <p v-if="anteprimaRotta && form.lastActivity" class="preview-error">
            <span class="material-symbols-rounded" style="font-size:0.9rem;vertical-align:middle;" aria-hidden="true" translate="no">broken_image</span>
            Impossibile caricare l'anteprima — l'URL verrà comunque salvato.
          </p>
        </div>

        <button
          class="btn-stranet btn-stranet-primary w-100 d-flex align-items-center justify-content-center gap-2"
          @click="salvaProfile"
          :disabled="salvataggio"
          :aria-busy="salvataggio"
          aria-label="Salva modifiche profilo"
        >
          <span class="material-symbols-rounded" style="font-size:1rem;" aria-hidden="true" translate="no">
            {{ salvataggio ? 'sync' : 'save' }}
          </span>
          {{ salvataggio ? 'Salvataggio...' : 'Salva Modifiche' }}
        </button>
      </section>

      <!-- Preferenze -->
      <section aria-labelledby="prefs-title" class="stranet-card p-4 mb-4 fade-in">
        <h2 id="prefs-title" class="display-font section-h">
          <span class="material-symbols-rounded section-icon" aria-hidden="true" translate="no">tune</span>
          Preferenze
        </h2>

        <div class="pref-row" role="group" aria-labelledby="dark-mode-label">
          <div class="d-flex align-items-center gap-2">
            <span class="material-symbols-rounded pref-icon" aria-hidden="true" translate="no">
              {{ storeUtente.darkMode ? 'dark_mode' : 'light_mode' }}
            </span>
            <div>
              <div id="dark-mode-label" class="pref-label">Modalità Scura</div>
              <div class="pref-desc">Meno affaticante di notte</div>
            </div>
          </div>
          <label class="toggle-switch" aria-label="Attiva/disattiva modalità scura">
            <input type="checkbox" v-model="darkModeLocale"
              @change="storeUtente.toggleDarkMode()" role="switch"
              :aria-checked="darkModeLocale" />
            <span class="toggle-slider"></span>
          </label>
        </div>
      </section>

      <!-- Account / Logout -->
      <section aria-labelledby="danger-title" class="stranet-card p-4 mb-4 fade-in">
        <h2 id="danger-title" class="display-font section-h" style="color:#c0392b;">
          <span class="material-symbols-rounded section-icon" style="color:#c0392b;" aria-hidden="true" translate="no">logout</span>
          Account
        </h2>
        <button
          class="btn-stranet btn-stranet-outline w-100 d-flex align-items-center justify-content-center gap-2"
          style="border-color:#c0392b; color:#c0392b;"
          @click="gestisciLogout"
          aria-label="Esci dal tuo account STRANET"
        >
          <span class="material-symbols-rounded" style="font-size:1rem;" aria-hidden="true" translate="no">logout</span>
          Esci
        </button>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../store/user'
import { generaUrlAvatar, indiceCasuale } from '../services/media'
import TopNav from '../components/TopNav.vue'

const router = useRouter()
const storeUtente = useUserStore()

// ── Stato UI ───────────────────────────────────────────────────────────────
const salvataggio = ref(false)
const errore = ref('')
const messaggioSuccesso = ref('')
const darkModeLocale = ref(storeUtente.darkMode)
const anteprimaRotta = ref(false)

// ── Selettore avatar ───────────────────────────────────────────────────────
// Inizializzato con l'avatar attuale dell'utente oppure uno casuale
const indiceAvatar = ref(indiceCasuale())
const avatarCorrente = computed(() => {
  // Se l'utente ha già una foto Pravatar, mantienila; altrimenti usa l'indice locale
  const fotoAttuale = storeUtente.userProfile?.photo
  if (fotoAttuale && fotoAttuale.includes('pravatar.cc') && !avatarModificato.value) {
    return fotoAttuale
  }
  return generaUrlAvatar(indiceAvatar.value)
})
const avatarModificato = ref(false)

/** Genera un nuovo indice avatar diverso dall'attuale e marca il cambiamento */
function cambiaAvatar() {
  let nuovoIndice
  do { nuovoIndice = indiceCasuale() } while (nuovoIndice === indiceAvatar.value)
  indiceAvatar.value = nuovoIndice
  avatarModificato.value = true
}

// ── Dati del form ──────────────────────────────────────────────────────────
const form = ref({
  displayName: storeUtente.userProfile?.displayName || '',
  age: storeUtente.userProfile?.age || '',
  bio: storeUtente.userProfile?.bio || '',
  stravaUrl: storeUtente.userProfile?.stravaUrl || '',
  lastActivity: storeUtente.userProfile?.lastActivity || ''
})

watch(() => form.value.lastActivity, () => { anteprimaRotta.value = false })

// ── Salvataggio profilo ────────────────────────────────────────────────────
async function salvaProfile() {
  errore.value = ''
  messaggioSuccesso.value = ''
  if (!form.value.displayName.trim()) {
    errore.value = 'Il nome è obbligatorio.'
    return
  }
  salvataggio.value = true
  try {
    const datiAggiornati = {
      displayName: form.value.displayName.trim(),
      age: form.value.age,
      bio: form.value.bio.trim(),
      stravaUrl: form.value.stravaUrl.trim(),
      lastActivity: form.value.lastActivity.trim()
    }
    // Salva il nuovo avatar solo se l'utente lo ha modificato
    if (avatarModificato.value) {
      datiAggiornati.photo = generaUrlAvatar(indiceAvatar.value)
      avatarModificato.value = false
    }
    await storeUtente.updateProfile(datiAggiornati)
    messaggioSuccesso.value = 'Profilo aggiornato con successo!'
    setTimeout(() => { messaggioSuccesso.value = '' }, 3000)
  } catch (e) {
    errore.value = 'Salvataggio fallito. Riprova.'
    console.error('Errore salvataggio profilo:', e)
  } finally {
    salvataggio.value = false
  }
}

// ── Logout ─────────────────────────────────────────────────────────────────
async function gestisciLogout() {
  try {
    await storeUtente.logout()
    router.push('/')
  } catch (e) {
    errore.value = 'Errore durante il logout. Riprova.'
    console.error('Errore logout:', e)
  }
}
</script>

<style scoped>
.settings-main { padding: 1.5rem 1rem; max-width: 600px; margin: 0 auto; }

/* Avatar nel profilo hero */
.avatar-wrap { position: relative; flex-shrink: 0; }

.profile-avatar-img {
  width: 68px; height: 68px; border-radius: 50%;
  object-fit: cover; border: 3px solid var(--orange); display: block;
}

/* Bottone sovrapposto all'avatar */
.btn-cambia-avatar-overlay {
  position: absolute;
  bottom: -4px; right: -4px;
  width: 26px; height: 26px;
  background: var(--orange);
  border: 2px solid var(--card-bg);
  border-radius: 50%;
  color: #fff;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
  padding: 0;
}
.btn-cambia-avatar-overlay:hover { background: var(--orange-dark); transform: scale(1.1); }

.btn-shuffle-hint {
  background: none; border: none; cursor: pointer;
  color: var(--orange); font-size: 0.78rem; font-weight: 600;
  padding: 0; margin-top: 0.25rem; font-family: var(--font-body);
  text-decoration: underline; text-underline-offset: 2px;
}
.btn-shuffle-hint:hover { opacity: 0.8; }

.profile-hero-name { font-size: 1.4rem; color: var(--text-primary); }
.profile-hero-email { color: var(--text-secondary); font-size: 0.85rem; }

/* Sezioni */
.section-h {
  font-size: 1rem; color: var(--text-primary); margin-bottom: 1.25rem;
  display: flex; align-items: center; gap: 0.5rem;
}

.section-icon {
  font-size: 1.1rem;
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

/* Input con icona */
.input-icon-wrap { position: relative; }

.input-icon {
  position: absolute; left: 0.875rem; top: 50%; transform: translateY(-50%);
  font-size: 1.1rem; color: var(--text-secondary);
  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
  pointer-events: none; z-index: 1;
}

.input-with-icon { padding-left: 2.75rem; }

/* Preferenze */
.pref-row { display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0; }

.pref-icon {
  font-size: 1.2rem; color: var(--text-secondary);
  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
}

.pref-label { font-family: var(--font-body); font-weight: 600; color: var(--text-primary); }
.pref-desc { color: var(--text-secondary); font-size: 0.8rem; margin-top: 0.1rem; }

/* Anteprima attività */
.activity-preview-wrap { border-radius: 6px; overflow: hidden; height: 120px; }
.activity-preview-img { width: 100%; height: 100%; object-fit: cover; display: block; }

.preview-error {
  color: var(--text-secondary); font-size: 0.78rem; margin-top: 0.4rem;
  display: flex; align-items: center; gap: 0.25rem;
}

/* Feedback */
.success-alert {
  background: rgba(39,174,96,0.1); border: 1px solid rgba(39,174,96,0.3);
  border-radius: 4px; color: #27ae60; padding: 0.75rem 1rem; font-size: 0.875rem;
}

textarea.stranet-input { resize: vertical; }
</style>

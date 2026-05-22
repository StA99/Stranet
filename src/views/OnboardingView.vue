<template>
  <div class="onboarding-page" translate="no">
    <div class="onboarding-header">
      <span class="stranet-logo">STRA<span>NET</span></span>
    </div>

    <main class="onboarding-content" role="main">
      <div class="onboarding-wrap fade-in">

        <!-- Indicatore di progresso a step -->
        <div class="steps-indicator" role="progressbar"
          :aria-valuenow="step" aria-valuemin="1" aria-valuemax="3"
          :aria-valuetext="`Step ${step} di 3`">
          <div v-for="s in 3" :key="s" class="step-dot"
            :class="{ active: s === step, done: s < step }"></div>
        </div>

        <!-- ── Step 1: Dati personali e scelta avatar ── -->
        <div v-if="step === 1" class="step-panel">
          <h1 class="display-font step-title">Parlaci di Te</h1>
          <p class="step-desc">Fai sapere agli altri corridori chi sei.</p>

          <!-- Selettore avatar interattivo -->
          <div class="avatar-selector mt-4 mb-4">
            <div class="avatar-preview-wrap">
              <img :src="avatarCorrente" alt="La tua foto profilo" class="avatar-img" />
            </div>
            <button type="button" class="btn-cambia-avatar" @click="cambiaAvatar"
              aria-label="Scegli un avatar diverso">
              <span class="material-symbols-rounded" aria-hidden="true" translate="no"
                style="font-size:1rem;vertical-align:middle;margin-right:4px;">shuffle</span>
              Cambia avatar
            </button>
            <p class="avatar-hint">Clicca per scegliere un avatar diverso</p>
          </div>

          <div class="mb-3">
            <label for="displayName" class="stranet-label">Nome Visualizzato *</label>
            <input id="displayName" v-model="form.displayName" type="text" class="stranet-input"
              placeholder="es. Alex Runner" autocomplete="name" required aria-required="true" maxlength="40" />
          </div>

          <div class="mb-3">
            <label for="age" class="stranet-label">Età *</label>
            <input id="age" v-model.number="form.age" type="number" class="stranet-input"
              placeholder="es. 28" min="16" max="90" required aria-required="true" />
          </div>

          <div class="mb-4">
            <label for="bio" class="stranet-label">Bio</label>
            <textarea id="bio" v-model="form.bio" class="stranet-input" rows="3" maxlength="200"
              placeholder="Racconta di te, il tuo ritmo, la distanza preferita..."
              aria-describedby="bio-count"></textarea>
            <div id="bio-count" class="text-end" style="color:var(--text-secondary);font-size:0.75rem;">
              {{ form.bio.length }}/200
            </div>
          </div>
        </div>

        <!-- ── Step 2: Stile di corsa ── -->
        <div v-if="step === 2" class="step-panel">
          <h1 class="display-font step-title">Il Tuo Stile di Corsa</h1>
          <p class="step-desc">Aiutaci a trovare il tuo match perfetto.</p>

          <div class="mb-3 mt-4">
            <label for="pace" class="stranet-label">Ritmo Preferito</label>
            <select id="pace" v-model="form.pace" class="stranet-input">
              <option value="">Seleziona il tuo ritmo...</option>
              <option value="easy">Lento (6+ min/km)</option>
              <option value="moderate">Moderato (5-6 min/km)</option>
              <option value="fast">Veloce (4-5 min/km)</option>
              <option value="race">Race pace (&lt;4 min/km)</option>
            </select>
          </div>

          <div class="mb-3">
            <label class="stranet-label">Distanza Preferita</label>
            <div class="distance-options" role="group" aria-label="Distanza preferita">
              <button v-for="dist in distanze" :key="dist.valore" type="button"
                class="dist-btn" :class="{ active: form.distance === dist.valore }"
                @click="form.distance = dist.valore" :aria-pressed="form.distance === dist.valore">
                {{ dist.etichetta }}
              </button>
            </div>
          </div>

          <div class="mb-4">
            <label for="stravaUrl" class="stranet-label">URL Profilo Strava</label>
            <input id="stravaUrl" v-model="form.stravaUrl" type="text" class="stranet-input"
              placeholder="https://www.strava.com/athletes/..." autocomplete="off" spellcheck="false" />
          </div>
        </div>

        <!-- ── Step 3: Foto ultima attività ── -->
        <div v-if="step === 3" class="step-panel">
          <h1 class="display-font step-title">La Tua Ultima Attività</h1>
          <p class="step-desc">Condividi una foto della tua ultima corsa. Puoi farlo anche dopo.</p>

          <div class="activity-preview-wrap mt-4 mb-3">
            <img v-if="form.lastActivity" :src="form.lastActivity"
              alt="Anteprima foto ultima attività" class="activity-preview"
              @error="anteprimaAttivitaRotta = true" @load="anteprimaAttivitaRotta = false" />
            <div v-else class="activity-placeholder">
              <span class="material-symbols-rounded" aria-hidden="true" translate="no"
                style="font-size:3rem;color:var(--gray-400);">directions_run</span>
              <p>Nessuna foto ancora</p>
              <p style="font-size:0.75rem;opacity:0.6;">Verrà usata un'immagine di default</p>
            </div>
          </div>

          <div class="mb-3">
            <label for="lastActivity" class="stranet-label">URL Foto Attività</label>
            <input id="lastActivity"
              :value="form.lastActivity"
              @input="form.lastActivity = $event.target.value; anteprimaAttivitaRotta = false"
              type="text" class="stranet-input"
              placeholder="https://example.com/my-run-photo.jpg"
              autocomplete="off" spellcheck="false" />
            <p class="mt-1" style="color:var(--text-secondary);font-size:0.78rem;">
              Suggerimento: usa uno screenshot di Strava o qualsiasi URL immagine pubblico.
            </p>
          </div>

          <p v-if="anteprimaAttivitaRotta && form.lastActivity" class="preview-error">
            <span class="material-symbols-rounded" style="font-size:0.9rem;vertical-align:middle;" aria-hidden="true">broken_image</span>
            URL non valido — salveremo l'URL comunque.
          </p>

          <div v-if="errore" class="stranet-alert" role="alert">{{ errore }}</div>
        </div>

        <!-- Navigazione step -->
        <div class="step-nav">
          <button v-if="step > 1" class="btn-stranet btn-stranet-outline"
            @click="step--" aria-label="Torna allo step precedente">← Indietro</button>
          <div v-else></div>

          <button v-if="step < 3" class="btn-stranet btn-stranet-primary"
            @click="prossimoStep" :disabled="!puoContinuare">Continua →</button>

          <button v-else class="btn-stranet btn-stranet-primary"
            @click="salvaProfile" :disabled="salvataggio" :aria-busy="salvataggio">
            {{ salvataggio ? 'Salvataggio...' : 'Inizia a Correre!' }}
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../store/user'
import { generaUrlAvatar, indiceCasuale } from '../services/media'

const router = useRouter()
const storeUtente = useUserStore()

// ── Stato del form e navigazione ───────────────────────────────────────────
const step = ref(1)
const salvataggio = ref(false)
const errore = ref('')
const anteprimaAttivitaRotta = ref(false)

// ── Avatar: indice corrente e URL derivato ──────────────────────────────────
const indiceAvatar = ref(indiceCasuale())
const avatarCorrente = computed(() => generaUrlAvatar(indiceAvatar.value))

/** Cambia l'avatar scegliendo un indice Pravatar diverso da quello attuale */
function cambiaAvatar() {
  let nuovoIndice
  do { nuovoIndice = indiceCasuale() } while (nuovoIndice === indiceAvatar.value)
  indiceAvatar.value = nuovoIndice
}

// ── Dati del form ──────────────────────────────────────────────────────────
const form = ref({
  displayName: storeUtente.userProfile?.displayName || '',
  age: storeUtente.userProfile?.age || '',
  bio: storeUtente.userProfile?.bio || '',
  stravaUrl: storeUtente.userProfile?.stravaUrl || '',
  lastActivity: storeUtente.userProfile?.lastActivity || '',
  pace: '',
  distance: ''
})

const distanze = [
  { valore: '5k', etichetta: '5K' },
  { valore: '10k', etichetta: '10K' },
  { valore: 'half', etichetta: 'Mezza' },
  { valore: 'full', etichetta: 'Maratona' },
  { valore: 'ultra', etichetta: 'Ultra' }
]

const puoContinuare = computed(() => {
  if (step.value === 1) return form.value.displayName.trim() && form.value.age >= 16
  return true
})

function prossimoStep() {
  if (puoContinuare.value) step.value++
}

// ── Salvataggio profilo su Firestore ───────────────────────────────────────
async function salvaProfile() {
  errore.value = ''
  salvataggio.value = true
  try {
    await storeUtente.updateProfile({
      displayName: form.value.displayName.trim(),
      age: form.value.age,
      bio: form.value.bio.trim(),
      stravaUrl: form.value.stravaUrl.trim(),
      // lastActivity vuoto → stringa vuota (urlAttivita() userà il fallback Unsplash)
      lastActivity: form.value.lastActivity.trim(),
      // Salva l'avatar scelto dall'utente
      photo: avatarCorrente.value
    })
    router.push('/home')
  } catch (e) {
    errore.value = 'Salvataggio profilo fallito. Riprova.'
    console.error('Errore salvataggio onboarding:', e)
  } finally {
    salvataggio.value = false
  }
}
</script>

<style scoped>
.onboarding-page { min-height: 100vh; background: var(--body-bg); }

.onboarding-header { background: var(--black); padding: 1.25rem 1.5rem; text-align: center; }

.onboarding-content { display: flex; justify-content: center; padding: 2rem 1rem 4rem; }

.onboarding-wrap { width: 100%; max-width: 440px; }

/* Indicatore step */
.steps-indicator { display: flex; justify-content: center; gap: 0.5rem; margin-bottom: 2rem; }

.step-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--border-color); transition: all 0.3s; }
.step-dot.active { background: var(--orange); width: 24px; border-radius: 4px; }
.step-dot.done { background: var(--orange); opacity: 0.4; }

.step-title { font-size: 2rem; color: var(--text-primary); }
.step-desc { color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.25rem; }

/* Selettore avatar */
.avatar-selector { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; }

.avatar-preview-wrap {
  width: 100px; height: 100px;
  border-radius: 50%;
  border: 3px solid var(--orange);
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(232,82,10,0.25);
}

.avatar-img { width: 100%; height: 100%; object-fit: cover; display: block; }

.btn-cambia-avatar {
  background: var(--gray-100);
  border: 2px solid var(--border-color);
  color: var(--text-primary);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0.45rem 1rem;
  border-radius: 100px;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s, background 0.2s;
  display: inline-flex;
  align-items: center;
}

.btn-cambia-avatar:hover { border-color: var(--orange); color: var(--orange); background: rgba(232,82,10,0.06); }

.avatar-hint { color: var(--text-secondary); font-size: 0.75rem; margin: 0; }

/* Distanze */
.distance-options { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem; }

.dist-btn {
  background: var(--gray-100); border: 2px solid var(--border-color);
  color: var(--text-primary); font-family: var(--font-display); font-weight: 700;
  font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.06em;
  padding: 0.5rem 1rem; border-radius: 2px; cursor: pointer; transition: all 0.2s;
}
.dist-btn.active { background: var(--orange); color: white; border-color: var(--orange); }

/* Anteprima attività */
.activity-preview-wrap {
  width: 100%; height: 180px;
  border-radius: 8px; overflow: hidden;
  border: 2px dashed var(--border-color);
}

.activity-preview { width: 100%; height: 100%; object-fit: cover; }

.activity-placeholder {
  width: 100%; height: 100%;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 0.5rem; color: var(--text-secondary); font-size: 0.875rem;
}

.preview-error {
  color: var(--text-secondary); font-size: 0.78rem; margin-top: 0.4rem;
  display: flex; align-items: center; gap: 0.25rem;
}

/* Navigazione */
.step-nav { display: flex; justify-content: space-between; align-items: center; margin-top: 2rem; gap: 1rem; }

textarea.stranet-input { resize: vertical; }
select.stranet-input { cursor: pointer; }
</style>

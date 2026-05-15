<template>
  <div class="onboarding-page" translate="no">
    <div class="onboarding-header">
      <span class="stranet-logo">STRA<span>NET</span></span>
    </div>

    <main class="onboarding-content" role="main">
      <div class="onboarding-wrap fade-in">
        <!-- Step indicator -->
        <div class="steps-indicator" role="progressbar" :aria-valuenow="step" aria-valuemin="1" aria-valuemax="3" :aria-valuetext="`Step ${step} of 3`">
          <div
            v-for="s in 3"
            :key="s"
            class="step-dot"
            :class="{ active: s === step, done: s < step }"
            :aria-label="`Step ${s}`"
          ></div>
        </div>

        <!-- Step 1: Basic Info -->
        <div v-if="step === 1" class="step-panel">
          <h1 class="display-font step-title">Parlaci di Te</h1>
          <p class="step-desc">Fai sapere agli altri corridori chi sei.</p>

          <div class="mb-4 mt-4">
            <div class="avatar-preview mx-auto">
              <img :src="avatarUrl" alt="Your profile avatar" class="avatar-img">
            </div>
            <p class="text-center mt-2" style="color:var(--text-secondary); font-size:0.8rem;">
              Il tuo avatar viene generato automaticamente
            </p>
          </div>

          <div class="mb-3">
            <label for="displayName" class="stranet-label">Nome Visualizzato *</label>
            <input
              id="displayName"
              v-model="form.displayName"
              type="text"
              class="stranet-input"
              placeholder="es. Alex Runner"
              autocomplete="name"
              required
              aria-required="true"
              maxlength="40"
            />
          </div>

          <div class="mb-3">
            <label for="age" class="stranet-label">Age *</label>
            <input
              id="age"
              v-model.number="form.age"
              type="number"
              class="stranet-input"
              placeholder="es. 28"
              min="16"
              max="90"
              required
              aria-required="true"
            />
          </div>

          <div class="mb-4">
            <label for="bio" class="stranet-label">Bio</label>
            <textarea
              id="bio"
              v-model="form.bio"
              class="stranet-input"
              placeholder="Racconta di te, il tuo ritmo, la distanza preferita..."
              rows="3"
              maxlength="200"
              aria-describedby="bio-count"
            ></textarea>
            <div id="bio-count" class="text-end" style="color:var(--text-secondary); font-size:0.75rem;">
              {{ form.bio.length }}/200
            </div>
          </div>
        </div>

        <!-- Step 2: Running Details -->
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
            <div class="distance-options" role="group" aria-label="Preferred running distance">
              <button
                v-for="dist in distances"
                :key="dist.value"
                type="button"
                class="dist-btn"
                :class="{ active: form.distance === dist.value }"
                @click="form.distance = dist.value"
                :aria-pressed="form.distance === dist.value"
              >{{ dist.label }}</button>
            </div>
          </div>

          <div class="mb-4">
            <label for="stravaUrl" class="stranet-label">URL Profilo Strava</label>
            <input
              id="stravaUrl"
              v-model="form.stravaUrl"
              type="url"
              class="stranet-input"
              placeholder="https://www.strava.com/athletes/..."
              autocomplete="url"
            />
          </div>
        </div>

        <!-- Step 3: Activity Photo -->
        <div v-if="step === 3" class="step-panel">
          <h1 class="display-font step-title">La Tua Ultima Attività</h1>
          <p class="step-desc">Condividi una foto della tua ultima corsa.</p>

          <div class="activity-preview-wrap mt-4 mb-3">
            <img
              v-if="form.lastActivity"
              :src="form.lastActivity"
              alt="Preview of your last running activity"
              class="activity-preview"
            />
            <div v-else class="activity-placeholder" aria-hidden="true">
              <span>🏃</span>
              <p>Nessuna foto ancora</p>
            </div>
          </div>

          <div class="mb-4">
            <label for="lastActivity" class="stranet-label">URL Foto Attività</label>
            <input
              id="lastActivity"
              v-model="form.lastActivity"
              type="url"
              class="stranet-input"
              placeholder="https://example.com/my-run-photo.jpg"
            />
            <p class="mt-2" style="color:var(--text-secondary); font-size:0.8rem;">
              Suggerimento: usa uno screenshot di Strava o qualsiasi URL immagine pubblico.
            </p>
          </div>

          <div v-if="error" class="stranet-alert" role="alert">{{ error }}</div>
        </div>

        <!-- Navigation -->
        <div class="step-nav">
          <button
            v-if="step > 1"
            class="btn-stranet btn-stranet-outline"
            @click="step--"
            aria-label="Go to previous step"
          >← Indietro</button>
          <div v-else></div>

          <button
            v-if="step < 3"
            class="btn-stranet btn-stranet-primary"
            @click="nextStep"
            :disabled="!canProceed"
            :aria-label="`Continue to step ${step + 1}`"
          >Continua →</button>

          <button
            v-else
            class="btn-stranet btn-stranet-primary"
            @click="saveProfile"
            :disabled="saving"
            :aria-busy="saving"
          >
            {{ saving ? 'Saving...' : 'Inizia a Correre!' }}
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

const router = useRouter()
const userStore = useUserStore()

const step = ref(1)
const saving = ref(false)
const error = ref('')

const form = ref({
  displayName: userStore.userProfile?.displayName || '',
  age: userStore.userProfile?.age || '',
  bio: userStore.userProfile?.bio || '',
  stravaUrl: userStore.userProfile?.stravaUrl || '',
  lastActivity: userStore.userProfile?.lastActivity || '',
  pace: '',
  distance: ''
})

const distances = [
  { value: '5k', label: '5K' },
  { value: '10k', label: '10K' },
  { value: 'half', label: 'Half' },
  { value: 'full', label: 'Full Marathon' },
  { value: 'ultra', label: 'Ultra' }
]

const avatarUrl = computed(() => {
  const uid = userStore.currentUser?.uid || 'default'
  return `https://i.pravatar.cc/150?u=${uid}`
})

const canProceed = computed(() => {
  if (step.value === 1) return form.value.displayName.trim() && form.value.age >= 16
  if (step.value === 2) return true
  return true
})

function nextStep() {
  if (canProceed.value) step.value++
}

async function saveProfile() {
  error.value = ''
  saving.value = true
  try {
    await userStore.updateProfile({
      displayName: form.value.displayName.trim(),
      age: form.value.age,
      bio: form.value.bio.trim(),
      stravaUrl: form.value.stravaUrl.trim(),
      lastActivity: form.value.lastActivity.trim() || `https://i.pravatar.cc/600?u=${userStore.currentUser.uid}_activity`,
      photo: avatarUrl.value
    })
    router.push('/home')
  } catch (e) {
    error.value = 'Salvataggio profilo fallito. Riprova.'
    console.error(e)
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.onboarding-page {
  min-height: 100vh;
  background: var(--body-bg);
}

.onboarding-header {
  background: var(--black);
  padding: 1.25rem 1.5rem;
  text-align: center;
}

.onboarding-content {
  display: flex;
  justify-content: center;
  padding: 2rem 1rem 4rem;
}

.onboarding-wrap {
  width: 100%;
  max-width: 440px;
}

.steps-indicator {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.step-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--border-color);
  transition: all 0.3s;
}

.step-dot.active {
  background: var(--orange);
  width: 24px;
  border-radius: 4px;
}

.step-dot.done { background: var(--orange); opacity: 0.4; }

.step-title {
  font-size: 2rem;
  color: var(--text-primary);
}

.step-desc {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-top: 0.25rem;
}

.avatar-preview {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 3px solid var(--orange);
  overflow: hidden;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.distance-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.dist-btn {
  background: var(--gray-100);
  border: 2px solid var(--border-color);
  color: var(--text-primary);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.5rem 1rem;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.2s;
}

.dist-btn.active {
  background: var(--orange);
  color: white;
  border-color: var(--orange);
}

.activity-preview-wrap {
  width: 100%;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px dashed var(--border-color);
}

.activity-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.activity-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.activity-placeholder span { font-size: 2.5rem; }

.step-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  gap: 1rem;
}

textarea.stranet-input { resize: vertical; }
select.stranet-input { cursor: pointer; }
</style>

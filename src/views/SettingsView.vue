<template>
  <div class="page-content" translate="no">
    <TopNav />

    <main role="main" class="settings-main">
      <!-- Profile preview -->
      <div class="profile-hero stranet-card p-4 mb-4 fade-in">
        <div class="d-flex align-items-center gap-3">
          <img
            :src="userStore.userProfile?.photo || defaultAvatar"
            alt="La tua foto profilo"
            class="profile-avatar-img"
          />
          <div>
            <div class="display-font profile-hero-name">{{ form.displayName || 'Il Tuo Nome' }}</div>
            <div class="profile-hero-email">{{ userStore.currentUser?.email }}</div>
          </div>
        </div>
      </div>

      <!-- Edit form -->
      <section aria-labelledby="edit-title" class="stranet-card p-4 mb-4 fade-in">
        <h2 id="edit-title" class="display-font section-h">
          <span class="material-symbols-rounded section-icon" aria-hidden="true">edit</span>
          Modifica Profilo
        </h2>

        <div v-if="successMsg" class="success-alert mb-3" role="status" aria-live="polite">
          <span class="material-symbols-rounded" style="font-size:1rem;vertical-align:middle;margin-right:6px;" aria-hidden="true">check_circle</span>
          {{ successMsg }}
        </div>
        <div v-if="error" class="stranet-alert mb-3" role="alert" aria-live="polite">
          <span class="material-symbols-rounded" style="font-size:1rem;vertical-align:middle;margin-right:6px;" aria-hidden="true">error</span>
          {{ error }}
        </div>

        <div class="mb-3">
          <label for="s-displayName" class="stranet-label">Nome Visualizzato</label>
          <input id="s-displayName" v-model="form.displayName" type="text" class="stranet-input"
            placeholder="Your name" maxlength="40" aria-required="true" />
        </div>

        <div class="mb-3">
          <label for="s-age" class="stranet-label">Age</label>
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
            <span class="material-symbols-rounded input-icon" aria-hidden="true">link</span>
            <input id="s-stravaUrl" v-model="form.stravaUrl" type="text" class="stranet-input input-with-icon"
              placeholder="https://www.strava.com/athletes/..." autocomplete="off" />
          </div>
        </div>

        <div class="mb-4">
          <label for="s-lastActivity" class="stranet-label">URL Foto Ultima Attività</label>
          <div class="input-icon-wrap">
            <span class="material-symbols-rounded input-icon" aria-hidden="true">image</span>
            <input
              id="s-lastActivity"
              :value="form.lastActivity"
              @input="form.lastActivity = $event.target.value"
              type="text"
              class="stranet-input input-with-icon"
              placeholder="https://example.com/my-run.jpg"
              autocomplete="off"
              spellcheck="false"
            />
          </div>
          <div v-if="form.lastActivity && !activityPreviewError" class="activity-preview-wrap mt-2">
            <img
              :src="form.lastActivity"
              alt="Anteprima foto ultima attività"
              class="activity-preview-img"
              @error="activityPreviewError = true"
              @load="activityPreviewError = false"
              referrerpolicy="no-referrer"
            />
          </div>
          <p v-if="activityPreviewError && form.lastActivity" class="preview-error">
            <span class="material-symbols-rounded" style="font-size:0.9rem;vertical-align:middle;" aria-hidden="true">broken_image</span>
            Impossibile caricare anteprima — l'URL verrà comunque salvato.
          </p>
        </div>

        <button
          class="btn-stranet btn-stranet-primary w-100 d-flex align-items-center justify-content-center gap-2"
          @click="saveProfile"
          :disabled="saving"
          :aria-busy="saving"
          aria-label="Salva modifiche profilo"
        >
          <span class="material-symbols-rounded" style="font-size:1rem;" aria-hidden="true">{{ saving ? 'sync' : 'save' }}</span>
          {{ saving ? 'Salvataggio...' : 'Salva Modifiche' }}
        </button>
      </section>

      <!-- Preferenze -->
      <section aria-labelledby="prefs-title" class="stranet-card p-4 mb-4 fade-in">
        <h2 id="prefs-title" class="display-font section-h">
          <span class="material-symbols-rounded section-icon" aria-hidden="true">tune</span>
          Preferenze
        </h2>

        <div class="pref-row" role="group" aria-labelledby="dark-mode-label">
          <div class="d-flex align-items-center gap-2">
            <span class="material-symbols-rounded pref-icon" aria-hidden="true">{{ userStore.darkMode ? 'dark_mode' : 'light_mode' }}</span>
            <div>
              <div id="dark-mode-label" class="pref-label">Modalità Scura</div>
              <div class="pref-desc">Meno affaticante di notte</div>
            </div>
          </div>
          <label class="toggle-switch" aria-label="Attiva/disattiva modalità scura">
            <input
              type="checkbox"
              v-model="darkModeLocal"
              @change="userStore.toggleDarkMode()"
              role="switch"
              :aria-checked="darkModeLocal"
            />
            <span class="toggle-slider"></span>
          </label>
        </div>
      </section>

      <!-- Danger zone -->
      <section aria-labelledby="danger-title" class="stranet-card p-4 mb-4 fade-in">
        <h2 id="danger-title" class="display-font section-h" style="color:#c0392b;">
          <span class="material-symbols-rounded section-icon" style="color:#c0392b;" aria-hidden="true">logout</span>
          Account
        </h2>
        <button
          class="btn-stranet btn-stranet-outline w-100 d-flex align-items-center justify-content-center gap-2"
          style="border-color:#c0392b; color:#c0392b;"
          @click="handleLogout"
          aria-label="Esci dal tuo account STRANET"
        >
          <span class="material-symbols-rounded" style="font-size:1rem;" aria-hidden="true">logout</span>
          Esci
        </button>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../store/user'
import TopNav from '../components/TopNav.vue'

const router = useRouter()
const userStore = useUserStore()
const defaultAvatar = 'https://i.pravatar.cc/150?img=1'

const saving = ref(false)
const error = ref('')
const successMsg = ref('')
const darkModeLocal = ref(userStore.darkMode)
const activityPreviewError = ref(false)

const form = ref({
  displayName: userStore.userProfile?.displayName || '',
  age: userStore.userProfile?.age || '',
  bio: userStore.userProfile?.bio || '',
  stravaUrl: userStore.userProfile?.stravaUrl || '',
  lastActivity: userStore.userProfile?.lastActivity || ''
})

// Reset preview error when URL changes
watch(() => form.value.lastActivity, () => { activityPreviewError.value = false })

async function saveProfile() {
  error.value = ''
  successMsg.value = ''
  if (!form.value.displayName.trim()) {
    error.value = 'Il nome è obbligatorio.'
    return
  }
  saving.value = true
  try {
    await userStore.updateProfile({
      displayName: form.value.displayName.trim(),
      age: form.value.age,
      bio: form.value.bio.trim(),
      stravaUrl: form.value.stravaUrl.trim(),
      lastActivity: form.value.lastActivity.trim()
    })
    successMsg.value = 'Profilo aggiornato con successo!'
    setTimeout(() => { successMsg.value = '' }, 3000)
  } catch (e) {
    error.value = 'Salvataggio fallito. Riprova.'
  } finally {
    saving.value = false
  }
}

async function handleLogout() {
  await userStore.logout()
  router.push('/')
}
</script>

<style scoped>
.settings-main { padding: 1.5rem 1rem; max-width: 600px; margin: 0 auto; }

.profile-avatar-img {
  width: 64px; height: 64px; border-radius: 50%;
  object-fit: cover; border: 3px solid var(--orange); flex-shrink: 0;
}

.profile-hero-name { font-size: 1.4rem; color: var(--text-primary); }
.profile-hero-email { color: var(--text-secondary); font-size: 0.85rem; }

.section-h {
  font-size: 1rem; color: var(--text-primary); margin-bottom: 1.25rem;
  display: flex; align-items: center; gap: 0.5rem;
}

.section-icon {
  font-size: 1.1rem;
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

/* Input with icon */
.input-icon-wrap { position: relative; }

.input-icon {
  position: absolute;
  left: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.1rem;
  color: var(--text-secondary);
  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
  pointer-events: none;
  z-index: 1;
}

.input-with-icon { padding-left: 2.75rem; }

/* Preferenze */
.pref-row {
  display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0;
}

.pref-icon {
  font-size: 1.2rem; color: var(--text-secondary);
  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
}

.pref-label { font-family: var(--font-body); font-weight: 600; color: var(--text-primary); }
.pref-desc { color: var(--text-secondary); font-size: 0.8rem; margin-top: 0.1rem; }

/* Activity preview */
.activity-preview-wrap { border-radius: 6px; overflow: hidden; height: 120px; }
.activity-preview-img { width: 100%; height: 100%; object-fit: cover; display: block; }

.preview-error {
  color: var(--text-secondary);
  font-size: 0.78rem;
  margin-top: 0.4rem;
}

/* Alerts */
.success-alert {
  background: rgba(39,174,96,0.1);
  border: 1px solid rgba(39,174,96,0.3);
  border-radius: 4px;
  color: #27ae60;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
}

textarea.stranet-input { resize: vertical; }
</style>

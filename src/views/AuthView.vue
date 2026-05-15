<template>
  <div class="pagina-auth" translate="no">
    <!-- Pannello sinistro decorativo -->
    <div class="auth-sinistra" aria-hidden="true">
      <div class="auth-sinistra-contenuto">
        <div class="auth-logo display-font">STRA<span>NET</span></div>
        <blockquote class="auth-citazione display-font">
          "Ogni chilometro<br>inizia con il<br>primo passo"
        </blockquote>
        <div class="auth-deco">
          <span class="material-symbols-rounded deco-icon" aria-hidden="true" translate="no"
            style="font-variation-settings:'FILL' 0,'wght' 200,'GRAD' 0,'opsz' 48;">directions_run</span>
          <span class="material-symbols-rounded deco-icon deco-icon--mid" aria-hidden="true" translate="no"
            style="font-variation-settings:'FILL' 0,'wght' 200,'GRAD' 0,'opsz' 48;">directions_run</span>
          <span class="material-symbols-rounded deco-icon deco-icon--small" aria-hidden="true" translate="no"
            style="font-variation-settings:'FILL' 0,'wght' 200,'GRAD' 0,'opsz' 48;">directions_run</span>
        </div>
      </div>
    </div>

    <!-- Pannello destro form -->
    <main class="auth-destra" role="main">
      <div class="auth-form-wrap">
        <router-link to="/" class="auth-indietro" aria-label="Torna alla home">
          <span class="material-symbols-rounded" aria-hidden="true" translate="no"
            style="font-size:1rem;vertical-align:middle;">arrow_back</span>
          Indietro
        </router-link>

        <!-- Tab Accedi / Registrati -->
        <div class="auth-tabs" role="tablist" aria-label="Accedi o registrati">
          <button class="auth-tab" :class="{ active: modalita === 'login' }"
            @click="cambiaModalita('login')" role="tab" :aria-selected="modalita === 'login'">Accedi</button>
          <button class="auth-tab" :class="{ active: modalita === 'registra' }"
            @click="cambiaModalita('registra')" role="tab" :aria-selected="modalita === 'registra'">Registrati</button>
        </div>

        <div role="tabpanel">
          <h1 class="auth-titolo display-font">
            {{ modalita === 'login' ? 'Bentornato' : 'Unisciti a STRANET' }}
          </h1>
          <p class="auth-sottotitolo">
            {{ modalita === 'login'
              ? 'Il tuo prossimo compagno di corsa ti aspetta.'
              : 'Inizia a trovare il tuo compagno di corsa ideale.' }}
          </p>

          <div v-if="errore" class="stranet-alert mt-3" role="alert" aria-live="polite">{{ errore }}</div>

          <form @submit.prevent="gestisciSubmit" novalidate>
            <!-- Email -->
            <div class="mb-3 mt-4">
              <label for="email" class="stranet-label">Indirizzo Email</label>
              <input id="email" v-model="email" type="email" class="stranet-input"
                placeholder="tu@esempio.com" autocomplete="email" required aria-required="true" />
            </div>

            <!-- Password con occhio -->
            <div class="mb-3">
              <label for="password" class="stranet-label">Password</label>
              <div class="input-pw-wrap">
                <input id="password" v-model="password"
                  :type="mostraPassword ? 'text' : 'password'"
                  class="stranet-input input-pw"
                  placeholder="Min. 6 caratteri"
                  autocomplete="current-password"
                  required aria-required="true" minlength="6" />
                <button type="button" class="btn-occhio"
                  @click="mostraPassword = !mostraPassword"
                  :aria-label="mostraPassword ? 'Nascondi password' : 'Mostra password'">
                  <span class="material-symbols-rounded" aria-hidden="true" translate="no"
                    style="font-variation-settings:'FILL' 0,'wght' 300,'GRAD' 0,'opsz' 24;">
                    {{ mostraPassword ? 'visibility_off' : 'visibility' }}
                  </span>
                </button>
              </div>
            </div>

            <!-- Conferma password — solo in registrazione -->
            <div v-if="modalita === 'registra'" class="mb-4">
              <label for="conferma-pw" class="stranet-label">Conferma Password</label>
              <div class="input-pw-wrap">
                <input id="conferma-pw" v-model="confermaPassword"
                  :type="mostraConferma ? 'text' : 'password'"
                  class="stranet-input input-pw"
                  :class="{ 'input-errore': confermaPassword && password !== confermaPassword }"
                  placeholder="Ripeti la password"
                  required aria-required="true" minlength="6" />
                <button type="button" class="btn-occhio"
                  @click="mostraConferma = !mostraConferma"
                  :aria-label="mostraConferma ? 'Nascondi conferma password' : 'Mostra conferma password'">
                  <span class="material-symbols-rounded" aria-hidden="true" translate="no"
                    style="font-variation-settings:'FILL' 0,'wght' 300,'GRAD' 0,'opsz' 24;">
                    {{ mostraConferma ? 'visibility_off' : 'visibility' }}
                  </span>
                </button>
              </div>
              <p v-if="confermaPassword && password !== confermaPassword" class="msg-validazione msg-errore" role="alert">
                <span class="material-symbols-rounded" aria-hidden="true" translate="no" style="font-size:0.9rem;vertical-align:middle;">error</span>
                Le password non coincidono
              </p>
              <p v-else-if="confermaPassword && password === confermaPassword" class="msg-validazione msg-successo">
                <span class="material-symbols-rounded" aria-hidden="true" translate="no" style="font-size:0.9rem;vertical-align:middle;">check_circle</span>
                Le password coincidono
              </p>
            </div>

            <div v-else class="mb-4"></div>

            <button type="submit" class="btn-stranet btn-stranet-primary w-100"
              :disabled="caricamento || (modalita === 'registra' && (!confermaPassword || password !== confermaPassword))"
              :aria-busy="caricamento">
              <span v-if="caricamento">Caricamento...</span>
              <span v-else>{{ modalita === 'login' ? 'Accedi' : 'Crea Account' }}</span>
            </button>
          </form>

          <p class="auth-switch mt-3 text-center">
            <span v-if="modalita === 'login'">
              Non hai un account?
              <button class="auth-link" @click="cambiaModalita('registra')">Registrati gratis</button>
            </span>
            <span v-else>
              Hai già un account?
              <button class="auth-link" @click="cambiaModalita('login')">Accedi</button>
            </span>
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../store/user'

const router = useRouter()
const storeUtente = useUserStore()

const modalita = ref('login')
const email = ref('')
const password = ref('')
const confermaPassword = ref('')
const mostraPassword = ref(false)
const mostraConferma = ref(false)
const errore = ref('')
const caricamento = ref(false)

function cambiaModalita(nuovaModalita) {
  modalita.value = nuovaModalita
  errore.value = ''
  password.value = ''
  confermaPassword.value = ''
  mostraPassword.value = false
  mostraConferma.value = false
}

async function gestisciSubmit() {
  errore.value = ''
  if (!email.value || !password.value) { errore.value = 'Compila tutti i campi.'; return }
  if (modalita.value === 'registra' && password.value !== confermaPassword.value) {
    errore.value = 'Le password non coincidono.'; return
  }
  caricamento.value = true
  try {
    if (modalita.value === 'login') {
      await storeUtente.login(email.value, password.value)
    } else {
      await storeUtente.register(email.value, password.value)
    }
    router.push(storeUtente.needsOnboarding ? '/onboarding' : '/home')
  } catch (e) {
    const messaggi = {
      'auth/user-not-found': 'Nessun account con questa email.',
      'auth/wrong-password': 'Password errata.',
      'auth/email-already-in-use': 'Email già registrata.',
      'auth/weak-password': 'La password deve avere almeno 6 caratteri.',
      'auth/invalid-email': 'Indirizzo email non valido.',
      'auth/invalid-credential': 'Email o password non validi.',
    }
    errore.value = messaggi[e.code] || 'Qualcosa è andato storto. Riprova.'
  } finally {
    caricamento.value = false
  }
}
</script>

<style scoped>
.pagina-auth { display: flex; min-height: 100vh; }

.auth-sinistra {
  flex: 1;
  background: var(--black);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.auth-sinistra::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 30% 70%, rgba(232,82,10,0.15) 0%, transparent 60%);
}

.auth-sinistra-contenuto { position: relative; z-index: 1; padding: 2rem; }

.auth-logo { font-size: 3rem; color: var(--white); letter-spacing: 0.1em; margin-bottom: 3rem; }
.auth-logo span { color: var(--orange); }

.auth-citazione { font-size: 2.5rem; color: var(--white); line-height: 1.1; border: none; font-style: normal; margin: 0; }

.auth-deco { display: flex; align-items: flex-end; gap: 0.25rem; margin-top: 2.5rem; opacity: 0.25; }
.deco-icon { font-size: 2.5rem; color: var(--orange); }
.deco-icon--mid { font-size: 2rem; }
.deco-icon--small { font-size: 1.5rem; }

.auth-destra {
  width: 440px;
  background: var(--body-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.auth-form-wrap { width: 100%; max-width: 370px; }

.auth-indietro {
  color: var(--text-secondary);
  font-size: 0.8rem;
  text-decoration: none;
  font-family: var(--font-display);
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  transition: color 0.2s;
}
.auth-indietro:hover { color: var(--orange); }

.auth-tabs { display: flex; border-bottom: 2px solid var(--border-color); margin-top: 2rem; }

.auth-tab {
  background: none; border: none;
  padding: 0.5rem 1.25rem 0.75rem;
  font-family: var(--font-display); font-weight: 700; font-size: 0.85rem;
  text-transform: uppercase; letter-spacing: 0.08em;
  color: var(--text-secondary); cursor: pointer;
  border-bottom: 2px solid transparent; margin-bottom: -2px;
  transition: color 0.2s, border-color 0.2s;
}
.auth-tab.active { color: var(--orange); border-bottom-color: var(--orange); }

.auth-titolo { font-size: 2rem; margin-top: 1.5rem; color: var(--text-primary); }
.auth-sottotitolo { color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.25rem; }

/* Campo password con bottone occhio */
.input-pw-wrap { position: relative; }
.input-pw { padding-right: 3rem !important; }

.btn-occhio {
  position: absolute;
  right: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  padding: 0.2rem;
  border-radius: 4px;
  transition: color 0.2s;
  line-height: 1;
}
.btn-occhio:hover { color: var(--orange); }
.btn-occhio .material-symbols-rounded { font-size: 1.2rem; display: block; }

/* Validazione */
.input-errore { border-color: #c0392b !important; }

.msg-validazione {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.78rem;
  margin-top: 0.35rem;
}
.msg-errore { color: #c0392b; }
.msg-successo { color: #27ae60; }

.auth-switch { color: var(--text-secondary); font-size: 0.875rem; }

.auth-link {
  background: none; border: none; color: var(--orange);
  font-family: var(--font-body); font-size: inherit; font-weight: 600;
  cursor: pointer; padding: 0;
}
.auth-link:hover { text-decoration: underline; }

@media (max-width: 768px) {
  .auth-sinistra { display: none; }
  .auth-destra { width: 100%; }
}
</style>

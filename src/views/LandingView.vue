<template>
  <div class="landing" translate="no">
    <!-- Hero -->
    <header class="landing-hero">
      <div class="hero-bg-pattern" aria-hidden="true"></div>
      <div class="container position-relative">
        <nav class="d-flex align-items-center justify-content-between py-4" role="navigation" aria-label="Navigazione sito">
          <span class="stranet-logo" aria-label="STRANET">STRA<span>NET</span></span>
          <router-link to="/auth" class="btn-stranet btn-stranet-primary" aria-label="Accedi a STRANET">Accedi</router-link>
        </nav>

        <div class="hero-content fade-in">
          <div class="hero-tag tag-badge mb-3">Per Corridori, Dai Corridori</div>
          <h1 class="hero-title display-font">
            Trova il tuo<br>
            <span class="hero-accent">Perfetto</span><br>
            Compagno di Corsa
          </h1>
          <p class="hero-desc">
            Connettiti con corridori che condividono il tuo ritmo, la tua distanza e la tua passione.
            Swipe, match e via di corsa insieme.
          </p>
          <div class="d-flex gap-3 flex-wrap mt-4">
            <router-link to="/auth" class="btn-stranet btn-stranet-primary" aria-label="Inizia a fare match con i corridori">
              Inizia a Correre Insieme
            </router-link>
            <a href="#come-funziona" class="btn-stranet btn-stranet-outline" aria-label="Scopri come funziona STRANET">
              Come Funziona
            </a>
          </div>

        </div>

        <!-- Card mockup Sarah K -->
        <div class="hero-mockup" aria-hidden="true">
          <div class="mock-card mock-card-back"></div>
          <div class="mock-card mock-card-front">
            <div class="mock-activity-wrap">
              <img src="https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=400&q=80" alt="" class="mock-card-img">
              <div class="mock-info-overlay">
                <img src="https://i.pravatar.cc/80?img=47" alt="" class="mock-avatar">
                <div>
                  <div class="mock-name">Sarah K.<span class="mock-age">, 28</span></div>
                  <div class="mock-bio">5K ogni mattina alle 6</div>
                </div>
              </div>
            </div>
            <div class="mock-actions">
              <button class="action-btn btn-pass" tabindex="-1" aria-hidden="true">
                <span class="material-symbols-rounded" style="font-size:1.4rem;">close</span>
              </button>
              <button class="action-btn btn-like" tabindex="-1" aria-hidden="true">
                <span class="material-symbols-rounded" style="font-size:1.4rem;font-variation-settings:'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24;">favorite</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Come Funziona -->
    <section id="come-funziona" class="how-section" aria-labelledby="how-title">
      <div class="container">
        <h2 id="how-title" class="display-font section-title">Come Funziona</h2>
        <div class="row g-4 mt-2">
          <div class="col-md-4" v-for="passo in passi" :key="passo.numero">
            <article class="step-card stranet-card p-4">
              <div class="step-num display-font">{{ passo.numero }}</div>
              <span class="material-symbols-rounded step-icon" aria-hidden="true">{{ passo.icona }}</span>
              <h3 class="step-title display-font">{{ passo.titolo }}</h3>
              <p class="step-desc">{{ passo.descrizione }}</p>
            </article>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-section" aria-labelledby="cta-title">
      <div class="container text-center">
        <h2 id="cta-title" class="display-font cta-title">Pronto a Correre?</h2>
        <p class="cta-desc">Unisciti a migliaia di corridori che si connettono su STRANET.</p>
        <router-link to="/auth" class="btn-stranet btn-stranet-primary mt-3" aria-label="Crea il tuo account gratuito su STRANET">
          Crea Account Gratuito
        </router-link>
      </div>
    </section>

    <!-- Footer -->
    <footer class="landing-footer" role="contentinfo">
      <div class="container d-flex justify-content-between align-items-center">
        <span class="stranet-logo" style="font-size:1.2rem">STRA<span>NET</span></span>
        <span style="color:var(--gray-400); font-size:0.8rem;">© 2026 STRANET</span>
      </div>
    </footer>
  </div>
</template>

<script setup>
const passi = [
  {
    numero: '01',
    icona: 'person_add',
    titolo: 'Crea il Profilo',
    descrizione: 'Registrati e collega il tuo account Strava. Fai sapere agli altri corridori il tuo ritmo, la distanza preferita e il tuo stile di corsa.'
  },
  {
    numero: '02',
    icona: 'swipe',
    titolo: 'Scopri e Swipe',
    descrizione: 'Sfoglia i profili dei corridori nella tua zona. Scorri a destra per mettere mi piace, a sinistra per passare. Semplice.'
  },
  {
    numero: '03',
    icona: 'bolt',
    titolo: 'Match e Connetti',
    descrizione: 'Quando due corridori si mettono mi piace a vicenda, è un match! Connettiti via Strava e pianificate la prima corsa insieme.'
  }
]
</script>

<style scoped>
.landing {
  background: var(--body-bg);
  overflow-x: hidden;
}

/* Hero */
.landing-hero {
  background: var(--black);
  position: relative;
  min-height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  padding-bottom: 4rem;
  overflow: hidden;
}

.hero-bg-pattern {
  position: absolute;
  top: 0; right: 0; bottom: 0;
  width: 55%;
  background: linear-gradient(135deg, transparent 30%, rgba(232,82,10,0.06) 100%);
  clip-path: polygon(15% 0, 100% 0, 100% 100%, 0% 100%);
}

.hero-bg-pattern::after {
  content: '';
  position: absolute;
  bottom: -80px; right: -80px;
  width: 400px; height: 400px;
  border-radius: 50%;
  border: 1px solid rgba(232,82,10,0.12);
}

.hero-content {
  max-width: 520px;
  padding-top: 3rem;
}

.hero-title {
  font-size: clamp(3.5rem, 8vw, 5.5rem);
  color: var(--white);
  line-height: 0.95;
  letter-spacing: -0.03em;
}

.hero-accent { color: var(--orange); }

.hero-desc {
  color: rgba(255,255,255,0.6);
  font-size: 1rem;
  line-height: 1.6;
  max-width: 380px;
  margin-top: 1.25rem;
}

/* Mockup card */
.hero-mockup {
  position: absolute;
  right: 0; top: 0; bottom: 0;
  width: 42%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mock-card {
  border-radius: 16px;
  overflow: hidden;
  position: absolute;
}

.mock-card-back {
  width: 240px; height: 380px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  transform: rotate(-4deg) translateX(16px);
}

.mock-card-front {
  width: 230px;
  background: #1a1a1a;
  position: relative;
  box-shadow: 0 24px 64px rgba(0,0,0,0.5);
  transform: rotate(2deg);
}

.mock-activity-wrap { position: relative; width: 100%; }

.mock-card-img {
  width: 100%; height: 260px;
  object-fit: cover; display: block;
}

.mock-info-overlay {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  padding: 2.5rem 0.875rem 0.75rem;
  background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 60%, transparent 100%);
  display: flex; align-items: flex-end; gap: 0.6rem;
}

.mock-avatar {
  width: 36px; height: 36px;
  border-radius: 50%; object-fit: cover;
  border: 2px solid var(--orange); flex-shrink: 0;
}

.mock-name {
  font-family: var(--font-display); font-weight: 400;
  font-size: 1rem; text-transform: uppercase; color: #fff; line-height: 1.1;
}

.mock-age { font-size: 0.85rem; color: rgba(255,255,255,0.65); }

.mock-bio { font-size: 0.72rem; color: rgba(255,255,255,0.6); margin-top: 0.1rem; }

.mock-actions {
  display: flex; justify-content: center; gap: 1.25rem;
  padding: 0.75rem 1rem; background: #1a1a1a;
}

/* Fix visibilità pulsante "Come Funziona" su hero scuro (Brave, Safari, Firefox) */
/* Il --text-primary su sfondo nero è quasi invisibile: forziamo bianco nell'hero */
.landing-hero .btn-stranet-outline {
  color: rgba(255, 255, 255, 0.9);
  border-color: rgba(255, 255, 255, 0.6);
}

.landing-hero .btn-stranet-outline:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
  border-color: #ffffff;
}

/* Come funziona */
.how-section { padding: 6rem 0; background: var(--body-bg); }

.section-title { font-size: clamp(2rem, 5vw, 3rem); color: var(--text-primary); }

.step-card { height: 100%; }

.step-num { font-size: 4rem; color: var(--orange); opacity: 0.3; line-height: 1; }

.step-icon {
  font-size: 2rem; display: block; margin: 0.5rem 0;
  color: var(--orange);
  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 48;
}

.step-title { font-size: 1.2rem; color: var(--text-primary); margin: 0.5rem 0; }

.step-desc { color: var(--text-secondary); font-size: 0.9rem; line-height: 1.6; }

/* CTA */
.cta-section { background: var(--orange); padding: 5rem 0; }

.cta-title { font-size: clamp(2.5rem, 6vw, 4rem); color: var(--white); }

.cta-desc { color: rgba(255,255,255,0.8); }

.cta-section .btn-stranet-primary { background: var(--white); color: var(--orange); }
.cta-section .btn-stranet-primary:hover { background: rgba(255,255,255,0.9); }

/* Footer */
.landing-footer { background: var(--black); padding: 1.5rem 0; }

@media (max-width: 768px) {
  .hero-mockup { display: none; }
  .hero-bg-pattern { width: 100%; }
  .hero-content { padding-top: 1.5rem; }
}
</style>

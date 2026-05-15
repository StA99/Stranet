<template>
  <nav class="bottom-nav" role="navigation" aria-label="Main navigation">
    <router-link to="/home" class="bottom-nav-item" :class="{ active: route.name === 'Home' }" aria-label="Discover runners">
      <span class="bottom-nav-icon" aria-hidden="true">🔥</span>
      <span>Discover</span>
    </router-link>
    <router-link to="/matches" class="bottom-nav-item" :class="{ active: route.name === 'Matches' }" aria-label="Your matches">
      <span class="bottom-nav-icon" aria-hidden="true">⚡</span>
      <span>Matches</span>
    </router-link>
    <router-link to="/settings" class="bottom-nav-item" :class="{ active: route.name === 'Settings' }" aria-label="Profile settings">
      <span class="bottom-nav-icon" aria-hidden="true">👤</span>
      <span>Profile</span>
    </router-link>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

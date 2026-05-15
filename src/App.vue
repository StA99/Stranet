<template>
  <div>
    <div v-if="userStore.loading" class="d-flex align-items-center justify-content-center" style="min-height:100vh;">
      <div class="text-center">
        <div class="display-font" style="font-size:3rem; color:var(--orange);">STRANET</div>
        <div class="mt-2" style="color:var(--text-secondary); font-size:0.85rem;">Loading...</div>
      </div>
    </div>
    <router-view v-else />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useUserStore } from './store/user'

const userStore = useUserStore()

onMounted(async () => {
  await userStore.initAuth()
})
</script>

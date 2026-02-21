<script setup>
import { RouterView } from 'vue-router'
import Sidebar from '@/components/layout/Sidebar.vue'
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <div class="app-layout">
    <Sidebar v-if="authStore.isAuthenticated" />
    <main :class="{ 'main-content': authStore.isAuthenticated }">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
  </div>
</template>

<style>
body {
  color: #2c3e50;
}

* {
  box-sizing: border-box;
}

.main-content {
  margin-left: 250px; /* Matches sidebar width */
}
</style>

<script setup>
// TODO Add the Sidebar and Product List here later
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="dashboard">
    <h1>Dashboard Overview</h1>
    <p>Hello, {{ authStore.user?.name }}</p>
    <button @click="handleLogout">Logout</button>
    <p>Welcome to your admin panel.</p>
    <div class="stats-grid">
      <!-- Placeholders for stats -->
      <div style="background: white; padding: 20px;">Total Sales: $0</div>
      <div style="background: white; padding: 20px;">Total Users: 0</div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 20px;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}
</style>

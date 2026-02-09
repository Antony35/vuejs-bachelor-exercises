<script setup>
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <aside class="sidebar">
    <div class="logo">AdminPanel</div>

    <nav class="menu">
      <RouterLink to="/" active-class="active">Dashboard</RouterLink>
      <RouterLink to="/products" active-class="active">Products</RouterLink>
    </nav>

    <div class="user-info">
      <p>User: {{ authStore.user?.name }}</p>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 250px;
  background: #2c3e50;
  color: white;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  padding: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 5px rgba(0,0,0,0.1);
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 40px;
  color: #42b883;
  text-align: center;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

a {
  color: #ecf0f1;
  text-decoration: none;
  padding: 12px;
  border-radius: 6px;
  transition: background 0.2s;
}

a:hover {
  background: #34495e;
}

a.active {
  background: #42b883;
  color: white;
  font-weight: bold;
}

.user-info {
  border-top: 1px solid #34495e;
  padding-top: 20px;
  font-size: 0.9rem;
  color: #bdc3c7;
  text-align: center;
}
</style>

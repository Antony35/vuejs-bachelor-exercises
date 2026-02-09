<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useProductsStore } from '../stores/products'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const productsStore = useProductsStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

// Fetch data automatically when the component is mounted
onMounted(() => {
  productsStore.fetchProducts()
})
</script>

<template>
  <div class="dashboard">
    <header class="header">
      <h1>Dashboard Overview</h1>
      <div class="user-actions">
        <span>Hello, <strong>{{ authStore.user?.name }}</strong></span>
        <button @click="handleLogout" class="logout-btn">Logout</button>
      </div>
    </header>

    <div class="stats-grid">
      <div class="stat-card">
        <h3>Total Products</h3>
        <p class="stat-value">{{ productsStore.totalProducts }}</p>
      </div>
      <div class="stat-card">
        <h3>Total Sales</h3>
        <p class="stat-value">$0</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.logout-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 15px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: #42b883;
  margin: 10px 0 0 0;
}
</style>

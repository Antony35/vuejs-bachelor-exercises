<script setup>
import { onMounted } from 'vue'
import { useProductsStore } from '../stores/products'

const productsStore = useProductsStore()

onMounted(() => {
  productsStore.fetchProducts()
})
</script>

<template>
  <div class="products-page">
    <h1>Product Management</h1>

    <!-- Loading State -->
    <div v-if="productsStore.loading" class="loading">Loading data...</div>

    <!-- Error State -->
    <div v-else-if="productsStore.error" class="error">{{ productsStore.error }}</div>

    <!-- Data Grid -->
    <div v-else class="products-grid">
      <div v-for="product in productsStore.products" :key="product.id" class="product-card">
        <div class="image-container">
          <img :src="product.image" :alt="product.title" />
        </div>
        <h4>{{ product.title }}</h4>
        <p class="price">${{ product.price }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.products-page {
  padding: 20px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.product-card {
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  transition: transform 0.2s;
}

.product-card:hover {
  transform: translateY(-5px);
}

.image-container {
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

.product-card img {
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
}

.product-card h4 {
  margin: 0 0 10px 0;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.price {
  font-weight: bold;
  color: #2c3e50;
  margin: 0;
}
</style>

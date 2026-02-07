<template>
  <div class="app-layout">
    <aside class="sidebar">
      <h2>Global Settings</h2>

      <div class="control-group">
        <label>Card Background</label>
        <input v-model="backgroundColor" type="color" value="#ffffff" />
      </div>

      <div class="control-group">
        <label>Text Color</label>
        <input v-model="textColor" type="color" value="#000000" />
      </div>

      <div class="control-group">
        <label>Base Font Size: {{ fontSize }}px</label>
        <input v-model="fontSize" type="range" min="12" max="24" />
      </div>
    </aside>

    <main class="product-grid">
      <Product
        v-for="product in products"
        :key="product.name"
        :product="product"
        class="product-card"
        :style="{
          backgroundColor: backgroundColor,
          fontSize: fontSize + 'px',
          color: textColor,
          borderWidth: product.quantity + 'px',
        }"
        :class="{ 'in-stock': product.inStock, 'out-of-stock': !product.inStock }"
      >
      </Product>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { products as InitData } from '@/data.js'
import Product from '@/Product.vue'
const products = reactive(InitData)
const fontSize = ref(14)
const backgroundColor = ref('#ffffff')

const textColor = ref('#333333')
</script>

<style scoped>
/* Layout */
.app-layout {
  display: flex;
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f7fa;
}

/* Sidebar */
.sidebar {
  width: 250px;
  background: white;
  padding: 20px;
  border-right: 1px solid #ddd;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}

.control-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Product Grid */
.product-grid {
  flex: 1;
  padding: 40px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  align-content: start;
}

/* Card Styling */
.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  /* Border width is bound dynamically in template */
  border-style: solid;
  border-color: transparent;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.15);
}

.in-stock {
  border-color: #4caf50 !important; /* Overrides dynamic border color for demo */
}
.out-of-stock {
  border-color: #f44336 !important;
  opacity: 0.8;
}
</style>

<script setup>
import {reactive, ref } from 'vue'
import { images as InitImage, products} from '@/data.js'
const thumbnailImage = ref('')
const isChecked = ref(false)
const images = reactive(InitImage)
defineProps({
  product: products
})
</script>

<template>
  <div class="card-content">

  <div class="control-group">
    <label>Global Gallery Preview</label>
    <div class="mini-gallery">
      <img
          v-for="image in images"
          :key="image"
          :src="image"
          @click="thumbnailImage = image"
          class="mini-thumb"
      />
    </div>
  </div>
  <div>
    <div class="card-image">
      <img
        :src="thumbnailImage || product.imageUrl"
        :alt="product.name"
        :title="product.description"
      />
    </div>

      <h1>{{ product.name }}</h1>

      <div class="price-container">
        <span
          class="original-price"
          :class="{ 'low-price': product.price < 50, 'high-price': product.price >= 50 }"
        >
          ${{ product.price }}
        </span>
        <span class="discount-badge" v-if="product.discount > 0">-{{ product.discount }}%</span>
      </div>

      <p class="final-price">
        Final: <strong>${{ (product.price * (1 - product.discount / 100)).toFixed(2) }}</strong>
      </p>

      <p class="description">{{ product.description }}</p>

      <div class="controls">
        <div class="control-row">
          <label>Qty:</label>
          <input type="number" v-model="product.quantity" min="0" class="input-qty" />
        </div>

        <div class="control-row">
          <label :class="{ selected: isChecked }" class="btn-inStock">
            <input v-model="isChecked" type="checkbox" :checked="product.inStock" />
            {{ product.inStock ? 'In Stock' : 'Out of Stock' }}
          </label>
        </div>

        <div class="control-row">
          <input
            v-model="product.imageUrl"
            type="text"
            placeholder="Update Image URL"
            class="input-url"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.mini-gallery {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  margin-top: 10px;
}

.mini-thumb {
  width: 40px;
  height: 40px;
  object-fit: cover;
  cursor: pointer;
  border-radius: 4px;
  border: 2px solid transparent;
}
.mini-thumb:hover {
  border-color: #3498db;
}

.card-image {
  height: 200px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

/* Price & Badges */
.price-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.original-price {
  text-decoration: line-through;
  color: #999;
  font-size: 0.9em;
}

.low-price {
  color: #27ae60;
  text-decoration: none;
  font-weight: bold;
}
.high-price {
  color: #c0392b;
  text-decoration: none;
  font-weight: bold;
}

.discount-badge {
  background: #e74c3c;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.8em;
  font-weight: bold;
}

.final-price {
  font-size: 1.2em;
  margin: 0;
}

/* Controls */
.controls {
  margin-top: auto;
  padding-top: 15px;
  border-top: 1px solid #eee;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.control-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.input-qty {
  width: 60px;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.input-url {
  width: 100%;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.8em;
}

.btn-inStock {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 16px;
  background: #f0f0f0;
  border-radius: 6px;
  width: 100%;
  justify-content: center;
  transition: background 0.2s;
}

.btn-inStock.selected {
  background-color: #3498db;
  color: white;
}
</style>

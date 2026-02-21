<script setup>
import { onMounted, ref, computed } from 'vue'
import { useProductsStore } from '@/stores/products'

const productsStore = useProductsStore()

//Form State
const showForm = ref(false)
const newProduct = ref({
  title: '',
  price: '',
  description: '',
  image: '/no_image.jpg',
  category: 'electronic'
})

// Search State
const searchQuery = ref('')

const filteredProducts = computed(() => {
  return productsStore.products.filter(product => 
    product.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

onMounted(() => {
  // Only fetch if we don't have data yet
  if (productsStore.products.length === 0)  {
    productsStore.fetchProducts()
  }
})

const handleSubmit = async () => {
  if(!newProduct.value.title || !newProduct.value.price || !newProduct.value.description) {
    return alert('All field are required')
  }
  await productsStore.addProduct(newProduct.value)

  // Reset form
  newProduct.value = {
    title: '',
    price: '',
    description: '',
    image: '/no_image.jpg',
    category: 'electronic'
  }
  showForm.value = false
}

const handleDelete = (id) => {
  if(confirm('Are you sure you want to delete this product?')) {
    productsStore.deleteProduct(id)
  }
}

</script>

<template>
  <div class="products-page">
    <div class="page-header">
      <h1>Product Management</h1>
      <button @click="showForm = !showForm" class="add-btn">
        {{ showForm ? 'Cancel' : 'Add Product' }}
      </button>
    </div>
    
    <div class="search-bar">
      <input v-model="searchQuery" placeholder="Search products..." class="search-input" />
    </div>

    <!-- Add Product Form -->
    <div v-if="showForm" class="add-form">
      <h3>Add New Product</h3>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <input v-model="newProduct.title" placeholder="Product Title" required>
        </div>
        <div class="form-group">
          <input v-model="newProduct.price" placeholder="Product Price" type="number" required>
        </div>
        <div class="form-group">
          <input v-model="newProduct.description" placeholder="Product Description" required>
        </div>
        <button type="submit" class="submit-btn">Save Product</button>
      </form>
    </div>

    <!-- Loading State -->
    <div v-if="productsStore.loading" class="loading">Loading data...</div>

    <!-- Error State -->
    <div v-else-if="productsStore.error" class="error">{{ productsStore.error }}</div>

    <!-- Data Grid -->
    <div v-else class="products-grid">
      <div v-for="product in filteredProducts" :key="product.id" class="product-card">
        <div class="image-container">
          <img :src="product.image" :alt="product.title" />
        </div>
        <h4>{{ product.title }}</h4>
        <p class="price">${{ product.price }}</p>
        <button @click="handleDelete(product.id)" class="delete-btn">Delete</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.products-page {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-bar {
  margin-bottom: 20px;
}

/* Buttons */
.add-btn {
  background-color: #42b883;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.delete-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
  width: 100%;
}

/* Form Styling */
.add-form {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.01);
}

.form-group {
  margin-bottom: 10px;
}

input, textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.submit-btn {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
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

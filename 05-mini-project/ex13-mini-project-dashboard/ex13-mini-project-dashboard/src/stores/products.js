import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useProductsStore = defineStore('products', () => {
  const products = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Computed property to count products automatically
  const totalProducts = computed(() => products.value.length)

  async function fetchProducts() {
    loading.value = true
    error.value = null
    try {
      const response = await fetch('https://fakestoreapi.com/products')
      if (!response.ok) throw new Error('Failed to fetch products')
      products.value = await response.json()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function addProduct(productData) {
    try {
      const response = await fetch('https://fakestoreapi.com/products', {
        method: 'POST',
        body: JSON.stringify(productData)
      })
      const newProduct = await response.json()

      // FakeStoreAPI always returns ID 21. Generate a real unique ID for our UI.
      newProduct.id = Date.now()
      newProduct.title = productData.title
      newProduct.price = productData.price
      newProduct.description = productData.description
      newProduct.image = productData.image
      newProduct.category = productData.category

      // Add to the beginning of the list
      products.value.unshift(newProduct)
    } catch (err) {
      error.value = 'Failed to add product'
    }
  }

  async function deleteProduct(id) {
    try {
      await fetch(`https://fakestoreapi.com/products/${id}`, {
        method: 'DELETE'
      })
      // Remove from local list
      products.value = products.value.filter(p => p.id !== id)
    } catch (err) {
      error.value = 'Failed to delete product'
    }
  }

  return {
    products,
    loading,
    error,
    totalProducts,
    fetchProducts,
    addProduct,
    deleteProduct
  }
})

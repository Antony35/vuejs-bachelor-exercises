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
      // Fetching real data from the API
      const response = await fetch('https://fakestoreapi.com/products')
      if (!response.ok) throw new Error('Failed to fetch products')
      products.value = await response.json()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return { products, loading, error, totalProducts, fetchProducts }
})

import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUsersStore = defineStore('users', () => {
  const users = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchUsers() {
    loading.value = true
    error.value = null
    try {
      const response = await fetch('https://fakestoreapi.com/users')
      users.value = await response.json()
    } catch (err) {
      error.value = 'Failed to fetch users'
    } finally {
      loading.value = false
    }
  }

  return { users, loading, error, fetchUsers }
})

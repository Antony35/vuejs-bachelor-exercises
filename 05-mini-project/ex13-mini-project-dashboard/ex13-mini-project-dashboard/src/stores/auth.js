import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = ref(false)

  function login(username, password) {
    // Fake logic: Accept any non-empty username/password
    if (username && password) {
      user.value = { name: username }
      isAuthenticated.value = true
      return true
    }
    return false
  }

  function logout() {
    user.value = null
    isAuthenticated.value = false
  }

  return { user, isAuthenticated, login, logout }
})

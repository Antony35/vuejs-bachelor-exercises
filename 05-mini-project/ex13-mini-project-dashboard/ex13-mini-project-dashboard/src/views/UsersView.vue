<script setup>
import { onMounted } from 'vue'
import { useUsersStore } from '@/stores/users'

const usersStore = useUsersStore()

onMounted(() => {
  if (usersStore.users.length === 0) {
    usersStore.fetchUsers()
  }
})
</script>

<template>
  <div class="users-page">
    <h1>User Management</h1>

    <div v-if="usersStore.loading" class="loading">Loading users...</div>
    <div v-else-if="usersStore.error" class="error">{{ usersStore.error }}</div>

    <div v-else class="users-grid">
      <div v-for="user in usersStore.users" :key="user.id" class="user-card">
        <div class="user-avatar">
          {{ user.name.firstname[0] }}{{ user.name.lastname[0] }}
        </div>
        <h3>{{ user.name.firstname }} {{ user.name.lastname }}</h3>
        <p class="email">{{ user.email }}</p>
        <p class="role">Role: Customer</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.users-page { padding: 20px; }
.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}
.user-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  text-align: center;
}
.user-avatar {
  width: 60px;
  height: 60px;
  background: #34495e;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 auto 15px;
  text-transform: uppercase;
}
.email { color: #7f8c8d; }
.role { font-weight: bold; color: #42b883; margin-top: 10px; }
</style>

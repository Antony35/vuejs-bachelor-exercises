# Exercise 11: API with Fetch

**Difficulty**: ⭐⭐⭐ Intermediate to Advanced  
**Time**: 3-4 hours  
**Concepts**: Fetch API, REST APIs, HTTP methods, loading states, error handling, API integration

## 🎯 Learning Objectives

- Fetch data from external APIs
- Handle HTTP GET, POST, PUT, DELETE requests
- Manage loading and error states
- Display API data reactively
- Handle API errors gracefully
- Work with real REST APIs
- Implement pagination

## 📋 Exercise Description

Create a blog application that fetches posts from a real API ([JSONPlaceholder](https://jsonplaceholder.typicode.com/)). Implement CRUD operations (Create, Read, Update, Delete) and handle various API states.

## 🛠️ Setup

```bash
npm create vue@latest ex11-api-fetch
cd ex11-api-fetch
npm install
npm run dev
```

Configuration: Include Pinia for state management (recommended)

## 📝 Step-by-Step Instructions

### Step 1: Understand the API

Explore JSONPlaceholder API:
- GET `https://jsonplaceholder.typicode.com/posts` - Get all posts
- GET `https://jsonplaceholder.typicode.com/posts/1` - Get single post
- POST `https://jsonplaceholder.typicode.com/posts` - Create post
- PUT `https://jsonplaceholder.typicode.com/posts/1` - Update post
- DELETE `https://jsonplaceholder.typicode.com/posts/1` - Delete post

### Step 2: Create API Service

Create `src/services/api.js`:
- Base URL configuration
- Helper functions for GET, POST, PUT, DELETE
- Error handling wrapper
- Generic fetch function

### Step 3: Create Posts Store

Create `src/stores/posts.js`:
- State: posts array, loading, error
- Actions: fetchPosts, fetchPost, createPost, updatePost, deletePost
- Use the API service

### Step 4: Display Posts List

Create `PostsList.vue`:
- Fetch posts on component mount
- Show loading spinner while fetching
- Display posts in cards/list
- Handle errors with error message

### Step 5: Create Post Detail View

Create `PostDetail.vue`:
- Fetch single post by ID
- Display full post content
- Add comments section (fetch from `/posts/{id}/comments`)
- Show author information

### Step 6: Implement Create Post

Create `CreatePost.vue`:
- Form for title and body
- POST request to create new post
- Show success/error messages
- Redirect after successful creation

### Step 7: Implement Update Post

Create `EditPost.vue`:
- Load existing post data
- Pre-fill form with current values
- PUT request to update
- Handle validation

### Step 8: Implement Delete Post

Add delete functionality:
- Confirmation dialog before delete
- DELETE request
- Remove from UI on success
- Handle errors

### Step 9: Add Pagination

Implement pagination for posts list:
- Limit posts per page
- Page navigation controls
- Track current page in state

### Step 10: Add Search and Filter

Implement search:
- Search posts by title
- Filter by user ID
- Use query parameters

## 💻 Code Structure

### services/api.js
```javascript
const BASE_URL = 'https://jsonplaceholder.typicode.com'

class APIError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'APIError'
    this.status = status
  }
}

async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new APIError(
      error.message || `HTTP Error: ${response.status}`,
      response.status
    )
  }
  
  // Handle 204 No Content
  if (response.status === 204) {
    return null
  }
  
  return response.json()
}

export const api = {
  async get(endpoint) {
    const response = await fetch(`${BASE_URL}${endpoint}`)
    return handleResponse(response)
  },

  async post(endpoint, data) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    return handleResponse(response)
  },

  async put(endpoint, data) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    return handleResponse(response)
  },

  async delete(endpoint) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE'
    })
    return handleResponse(response)
  }
}
```

### stores/posts.js
```javascript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '../services/api'

export const usePostsStore = defineStore('posts', () => {
  // State
  const posts = ref([])
  const currentPost = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  // Pagination
  const currentPage = ref(1)
  const postsPerPage = ref(10)

  // Getters
  const totalPages = computed(() => {
    return Math.ceil(posts.value.length / postsPerPage.value)
  })

  const paginatedPosts = computed(() => {
    const start = (currentPage.value - 1) * postsPerPage.value
    const end = start + postsPerPage.value
    return posts.value.slice(start, end)
  })

  // Actions
  async function fetchPosts() {
    isLoading.value = true
    error.value = null
    try {
      posts.value = await api.get('/posts')
    } catch (e) {
      error.value = e.message
      console.error('Failed to fetch posts:', e)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchPost(id) {
    isLoading.value = true
    error.value = null
    try {
      currentPost.value = await api.get(`/posts/${id}`)
    } catch (e) {
      error.value = e.message
      console.error('Failed to fetch post:', e)
    } finally {
      isLoading.value = false
    }
  }

  async function createPost(postData) {
    isLoading.value = true
    error.value = null
    try {
      const newPost = await api.post('/posts', postData)
      // Add to beginning of posts array
      posts.value.unshift(newPost)
      return { success: true, post: newPost }
    } catch (e) {
      error.value = e.message
      console.error('Failed to create post:', e)
      return { success: false, error: e.message }
    } finally {
      isLoading.value = false
    }
  }

  async function updatePost(id, postData) {
    isLoading.value = true
    error.value = null
    try {
      const updatedPost = await api.put(`/posts/${id}`, postData)
      
      // Update in array
      const index = posts.value.findIndex(p => p.id === id)
      if (index !== -1) {
        posts.value[index] = updatedPost
      }
      
      return { success: true, post: updatedPost }
    } catch (e) {
      error.value = e.message
      console.error('Failed to update post:', e)
      return { success: false, error: e.message }
    } finally {
      isLoading.value = false
    }
  }

  async function deletePost(id) {
    isLoading.value = true
    error.value = null
    try {
      await api.delete(`/posts/${id}`)
      
      // Remove from array
      posts.value = posts.value.filter(p => p.id !== id)
      
      return { success: true }
    } catch (e) {
      error.value = e.message
      console.error('Failed to delete post:', e)
      return { success: false, error: e.message }
    } finally {
      isLoading.value = false
    }
  }

  function setPage(page) {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  function nextPage() {
    if (currentPage.value < totalPages.value) {
      currentPage.value++
    }
  }

  function previousPage() {
    if (currentPage.value > 1) {
      currentPage.value--
    }
  }

  return {
    // State
    posts,
    currentPost,
    isLoading,
    error,
    currentPage,
    postsPerPage,
    // Getters
    totalPages,
    paginatedPosts,
    // Actions
    fetchPosts,
    fetchPost,
    createPost,
    updatePost,
    deletePost,
    setPage,
    nextPage,
    previousPage
  }
})
```

### views/PostsList.vue
```vue
<template>
  <div class="posts-list">
    <div class="header">
      <h1>Blog Posts</h1>
      <RouterLink to="/posts/new" class="create-btn">
        Create Post
      </RouterLink>
    </div>

    <!-- Loading State -->
    <div v-if="postsStore.isLoading" class="loading">
      <div class="spinner"></div>
      <p>Loading posts...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="postsStore.error" class="error">
      <p>Error: {{ postsStore.error }}</p>
      <button @click="postsStore.fetchPosts()">Retry</button>
    </div>

    <!-- Posts List -->
    <div v-else>
      <div class="posts-grid">
        <div
          v-for="post in postsStore.paginatedPosts"
          :key="post.id"
          class="post-card"
        >
          <h2>{{ post.title }}</h2>
          <p class="excerpt">{{ post.body.substring(0, 100) }}...</p>
          <div class="actions">
            <RouterLink :to="`/posts/${post.id}`" class="view-btn">
              View
            </RouterLink>
            <RouterLink :to="`/posts/${post.id}/edit`" class="edit-btn">
              Edit
            </RouterLink>
            <button @click="handleDelete(post.id)" class="delete-btn">
              Delete
            </button>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="pagination">
        <button
          @click="postsStore.previousPage()"
          :disabled="postsStore.currentPage === 1"
        >
          Previous
        </button>
        <span>
          Page {{ postsStore.currentPage }} of {{ postsStore.totalPages }}
        </span>
        <button
          @click="postsStore.nextPage()"
          :disabled="postsStore.currentPage === postsStore.totalPages"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { usePostsStore } from '../stores/posts'

const postsStore = usePostsStore()

onMounted(() => {
  if (postsStore.posts.length === 0) {
    postsStore.fetchPosts()
  }
})

async function handleDelete(id) {
  if (!confirm('Are you sure you want to delete this post?')) {
    return
  }

  const result = await postsStore.deletePost(id)
  if (result.success) {
    alert('Post deleted successfully!')
  } else {
    alert(`Failed to delete post: ${result.error}`)
  }
}
</script>

<style scoped>
.posts-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.create-btn {
  padding: 10px 20px;
  background: #42b883;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}

.loading {
  text-align: center;
  padding: 50px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #42b883;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
  text-align: center;
  padding: 50px;
  color: #ff6b6b;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.post-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  transition: box-shadow 0.3s;
}

.post-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.actions button,
.actions a {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  font-size: 14px;
}

.view-btn {
  background: #42b883;
  color: white;
}

.edit-btn {
  background: #ffa500;
  color: white;
}

.delete-btn {
  background: #ff6b6b;
  color: white;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 20px;
}

.pagination button {
  padding: 8px 16px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.pagination button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>
```

### views/CreatePost.vue
```vue
<template>
  <div class="create-post">
    <h1>Create New Post</h1>

    <form @submit.prevent="handleSubmit" class="post-form">
      <div class="form-group">
        <label for="title">Title</label>
        <input
          id="title"
          v-model="formData.title"
          type="text"
          required
          placeholder="Enter post title"
        >
      </div>

      <div class="form-group">
        <label for="body">Body</label>
        <textarea
          id="body"
          v-model="formData.body"
          required
          rows="10"
          placeholder="Enter post content"
        ></textarea>
      </div>

      <div class="form-actions">
        <button type="submit" :disabled="postsStore.isLoading" class="submit-btn">
          {{ postsStore.isLoading ? 'Creating...' : 'Create Post' }}
        </button>
        <RouterLink to="/posts" class="cancel-btn">Cancel</RouterLink>
      </div>

      <div v-if="postsStore.error" class="error-message">
        {{ postsStore.error }}
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePostsStore } from '../stores/posts'

const router = useRouter()
const postsStore = usePostsStore()

const formData = ref({
  title: '',
  body: '',
  userId: 1 // Default user ID
})

async function handleSubmit() {
  const result = await postsStore.createPost(formData.value)
  
  if (result.success) {
    alert('Post created successfully!')
    router.push('/posts')
  } else {
    alert(`Failed to create post: ${result.error}`)
  }
}
</script>

<style scoped>
.create-post {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.post-form {
  background: #f9f9f9;
  padding: 30px;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.form-actions {
  display: flex;
  gap: 10px;
}

.submit-btn {
  padding: 12px 24px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.cancel-btn {
  padding: 12px 24px;
  background: #999;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}

.error-message {
  margin-top: 15px;
  padding: 10px;
  background: #ffebee;
  color: #c62828;
  border-radius: 4px;
}
</style>
```

## ✅ Expected Outcome

Your application should:

1. **Fetch and display posts** from JSONPlaceholder API
2. **Show loading spinner** while fetching
3. **Display error messages** when requests fail
4. **Create new posts** via POST request
5. **Update existing posts** via PUT request
6. **Delete posts** via DELETE request
7. **Paginate posts** list
8. **Handle all error states** gracefully
9. **Show success messages** after operations
10. **Navigate programmatically** after CRUD operations

## 🧪 Testing Checklist

- [ ] Posts load on page mount
- [ ] Loading spinner appears during fetch
- [ ] Posts display correctly
- [ ] Create new post and verify it appears
- [ ] Edit a post and verify update
- [ ] Delete a post with confirmation
- [ ] Pagination works correctly
- [ ] Error handling displays messages
- [ ] Navigate between pages
- [ ] Verify all API calls in Network tab

## 🎓 Key Concepts

### Fetch API Basics
```javascript
// GET request
const response = await fetch('https://api.example.com/data')
const data = await response.json()

// POST request
const response = await fetch('https://api.example.com/data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ key: 'value' })
})
```

### Error Handling
```javascript
try {
  const data = await api.get('/posts')
} catch (error) {
  console.error('API Error:', error)
  errorMessage.value = error.message
}
```

### Loading States
```javascript
isLoading.value = true
try {
  const data = await fetchData()
} finally {
  isLoading.value = false
}
```

## 🚀 Bonus Challenges

1. **Caching**: Cache API responses to reduce requests
2. **Debounce Search**: Debounce search input
3. **Infinite Scroll**: Replace pagination with infinite scroll
4. **Optimistic Updates**: Update UI before API confirms
5. **Request Cancellation**: Cancel pending requests on navigation
6. **Retry Logic**: Auto-retry failed requests
7. **Rate Limiting**: Handle API rate limits

## 📚 Resources

- [Fetch API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [JSONPlaceholder](https://jsonplaceholder.typicode.com/)
- [REST API Best Practices](https://restfulapi.net/)
- [HTTP Status Codes](https://httpstatuses.com/)

## 🤔 Reflection Questions

1. Why separate API logic from components?
2. How do you handle async errors in Vue?
3. What's the difference between POST and PUT?
4. Why use loading states?
5. How would you implement request cancellation?

## 💡 Common Mistakes

- Not handling errors properly
- Forgetting to show loading states
- Not parsing JSON responses
- Hardcoding API URLs everywhere
- Not validating responses
- Forgetting async/await syntax

## 🎯 Success Criteria

✅ All CRUD operations working  
✅ Loading states implemented  
✅ Error handling in place  
✅ Pagination functional  
✅ API service abstraction created  
✅ Pinia store manages API state  
✅ UI updates reactively

---

**Previous**: [Exercise 10: Pinia State](../../03-routing-state/ex10-pinia-state/)  
**Next**: [Exercise 12: Async/Await](../ex12-async-await/)

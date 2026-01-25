# Exercise 09: Vue Router

**Difficulty**: ⭐⭐⭐ Intermediate to Advanced  
**Time**: 3-4 hours  
**Concepts**: Vue Router, routing, navigation, route parameters, nested routes, navigation guards

## 🎯 Learning Objectives

- Set up Vue Router in a Vue application
- Create multiple pages/views with routing
- Navigate between pages programmatically and with router-link
- Use dynamic route parameters
- Implement nested routes
- Use navigation guards for route protection
- Handle 404 pages

## 📋 Exercise Description

Build a multi-page blog application with Vue Router. Create pages for home, blog listing, individual blog posts, about, and user profile. Implement navigation, dynamic routing, and route guards.

## 🛠️ Setup

```bash
npm create vue@latest ex09-vue-router
```

**Important**: When prompted, select **YES** for Vue Router!

```bash
cd ex09-vue-router
npm install
npm run dev
```

## 📝 Step-by-Step Instructions

### Step 1: Explore Router Setup

1. Open `src/router/index.js` to see the router configuration
2. Look at `src/App.vue` to see `<RouterView>` and `<RouterLink>`
3. Examine existing views in `src/views/`

### Step 2: Create Views/Pages

Create the following view components in `src/views/`:
- `HomeView.vue` (usually already exists)
- `BlogListView.vue`: Display list of blog posts
- `BlogPostView.vue`: Individual blog post page
- `AboutView.vue`: About page
- `ProfileView.vue`: User profile page
- `NotFoundView.vue`: 404 error page

### Step 3: Configure Routes

In `src/router/index.js`, define routes for:
- `/` - Home page
- `/blog` - Blog list
- `/blog/:id` - Individual blog post (dynamic parameter)
- `/about` - About page
- `/profile/:username` - User profile (dynamic parameter)
- `/:pathMatch(.*)` - 404 page (catch-all route)

### Step 4: Create Navigation Component

Create `src/components/Navigation.vue`:
- Use `<RouterLink>` for navigation links
- Add active class styling
- Make it responsive

### Step 5: Implement Dynamic Routes

In `BlogPostView.vue`:
- Access route parameter using `useRoute()`
- Fetch and display post based on `:id` parameter
- Handle invalid IDs

### Step 6: Add Nested Routes

Create a dashboard section with nested routes:
- `/dashboard` - Dashboard layout
- `/dashboard/overview` - Overview page
- `/dashboard/settings` - Settings page
- Use `<RouterView>` in dashboard layout for nested views

### Step 7: Programmatic Navigation

Implement navigation using `useRouter()`:
- Navigate after form submission
- Back/forward navigation
- Navigate with parameters

### Step 8: Navigation Guards

Implement route guards:
- Global `beforeEach` guard to log navigation
- Per-route `beforeEnter` guard to protect dashboard
- Component guard `beforeRouteEnter` in ProfileView

## 💻 Code Structure

### router/index.js
```javascript
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BlogListView from '../views/BlogListView.vue'
import BlogPostView from '../views/BlogPostView.vue'
import AboutView from '../views/AboutView.vue'
import ProfileView from '../views/ProfileView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import DashboardLayout from '../views/dashboard/DashboardLayout.vue'
import DashboardOverview from '../views/dashboard/DashboardOverview.vue'
import DashboardSettings from '../views/dashboard/DashboardSettings.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/blog',
      name: 'blog',
      component: BlogListView
    },
    {
      path: '/blog/:id',
      name: 'blog-post',
      component: BlogPostView,
      props: true // Pass route params as props
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    },
    {
      path: '/profile/:username',
      name: 'profile',
      component: ProfileView,
      props: true
    },
    {
      path: '/dashboard',
      component: DashboardLayout,
      beforeEnter: (to, from) => {
        // Check authentication
        const isAuthenticated = localStorage.getItem('isAuthenticated')
        if (!isAuthenticated) {
          alert('Please login to access dashboard')
          return { name: 'home' }
        }
      },
      children: [
        {
          path: '',
          redirect: '/dashboard/overview'
        },
        {
          path: 'overview',
          name: 'dashboard-overview',
          component: DashboardOverview
        },
        {
          path: 'settings',
          name: 'dashboard-settings',
          component: DashboardSettings
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Global navigation guard
router.beforeEach((to, from) => {
  console.log(`Navigating from ${from.path} to ${to.path}`)
  // You can add global checks here
})

export default router
```

### views/BlogPostView.vue
```vue
<template>
  <div class="blog-post-view">
    <button @click="goBack" class="back-btn">← Back to Blog</button>
    
    <article v-if="post" class="post">
      <h1>{{ post.title }}</h1>
      <div class="meta">
        <span>By {{ post.author }}</span>
        <span>{{ post.date }}</span>
      </div>
      <img :src="post.image" :alt="post.title" />
      <div class="content">
        {{ post.content }}
      </div>
      <div class="tags">
        <span v-for="tag in post.tags" :key="tag" class="tag">
          {{ tag }}
        </span>
      </div>
    </article>
    
    <div v-else class="error">
      <p>Post not found</p>
      <button @click="goToBlog">View All Posts</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const post = ref(null)

// Mock data - in real app, fetch from API
const posts = [
  {
    id: 1,
    title: 'Getting Started with Vue Router',
    author: 'John Doe',
    date: '2026-01-20',
    image: 'https://picsum.photos/800/400?random=1',
    content: 'Vue Router is the official router for Vue.js...',
    tags: ['Vue', 'Router', 'Tutorial']
  },
  {
    id: 2,
    title: 'Advanced Routing Techniques',
    author: 'Jane Smith',
    date: '2026-01-22',
    image: 'https://picsum.photos/800/400?random=2',
    content: 'Learn advanced routing patterns...',
    tags: ['Vue', 'Advanced', 'Routing']
  }
]

onMounted(() => {
  const postId = parseInt(route.params.id)
  post.value = posts.find(p => p.id === postId)
})

function goBack() {
  router.back()
}

function goToBlog() {
  router.push({ name: 'blog' })
}
</script>

<style scoped>
.blog-post-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.back-btn {
  margin-bottom: 20px;
  padding: 8px 16px;
  background: #f0f0f0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.post img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 20px 0;
}
</style>
```

### views/BlogListView.vue
```vue
<template>
  <div class="blog-list-view">
    <h1>Blog Posts</h1>
    
    <div class="posts-grid">
      <div
        v-for="post in posts"
        :key="post.id"
        class="post-card"
        @click="goToPost(post.id)"
      >
        <img :src="post.image" :alt="post.title" />
        <h2>{{ post.title }}</h2>
        <p class="excerpt">{{ post.excerpt }}</p>
        <div class="meta">
          <span>{{ post.author }}</span>
          <span>{{ post.date }}</span>
        </div>
        <RouterLink :to="{ name: 'blog-post', params: { id: post.id } }" class="read-more">
          Read More →
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const posts = ref([
  {
    id: 1,
    title: 'Getting Started with Vue Router',
    excerpt: 'Learn the basics of routing in Vue.js applications...',
    author: 'John Doe',
    date: '2026-01-20',
    image: 'https://picsum.photos/400/300?random=1'
  },
  {
    id: 2,
    title: 'Advanced Routing Techniques',
    excerpt: 'Explore advanced patterns and techniques...',
    author: 'Jane Smith',
    date: '2026-01-22',
    image: 'https://picsum.photos/400/300?random=2'
  },
  {
    id: 3,
    title: 'Navigation Guards Explained',
    excerpt: 'Understanding and implementing navigation guards...',
    author: 'Bob Johnson',
    date: '2026-01-24',
    image: 'https://picsum.photos/400/300?random=3'
  }
])

function goToPost(id) {
  router.push({ name: 'blog-post', params: { id } })
}
</script>

<style scoped>
.blog-list-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

.post-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;
}

.post-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.post-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.read-more {
  display: inline-block;
  padding: 8px 16px;
  margin: 10px 15px 15px;
  background: #42b883;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}
</style>
```

### components/Navigation.vue
```vue
<template>
  <nav class="navigation">
    <div class="logo">MyBlog</div>
    <ul class="nav-links">
      <li>
        <RouterLink to="/">Home</RouterLink>
      </li>
      <li>
        <RouterLink to="/blog">Blog</RouterLink>
      </li>
      <li>
        <RouterLink to="/about">About</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ name: 'profile', params: { username: 'johndoe' } }">
          Profile
        </RouterLink>
      </li>
      <li>
        <RouterLink to="/dashboard">Dashboard</RouterLink>
      </li>
    </ul>
    <button @click="toggleAuth" class="auth-btn">
      {{ isAuthenticated ? 'Logout' : 'Login' }}
    </button>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isAuthenticated = ref(false)

onMounted(() => {
  isAuthenticated.value = localStorage.getItem('isAuthenticated') === 'true'
})

function toggleAuth() {
  isAuthenticated.value = !isAuthenticated.value
  localStorage.setItem('isAuthenticated', isAuthenticated.value)
}
</script>

<style scoped>
.navigation {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 15px 30px;
  background: #2c3e50;
  color: white;
}

.logo {
  font-size: 24px;
  font-weight: bold;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 20px;
  margin: 0;
  padding: 0;
  flex: 1;
}

.nav-links a {
  color: white;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background 0.3s;
}

.nav-links a:hover {
  background: rgba(255, 255, 255, 0.1);
}

.nav-links a.router-link-active {
  background: #42b883;
}

.auth-btn {
  padding: 8px 16px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
```

### views/NotFoundView.vue
```vue
<template>
  <div class="not-found">
    <h1>404</h1>
    <h2>Page Not Found</h2>
    <p>The page you're looking for doesn't exist.</p>
    <RouterLink to="/" class="home-btn">Go Home</RouterLink>
  </div>
</template>

<style scoped>
.not-found {
  text-align: center;
  padding: 100px 20px;
}

.not-found h1 {
  font-size: 120px;
  margin: 0;
  color: #42b883;
}

.home-btn {
  display: inline-block;
  margin-top: 20px;
  padding: 12px 24px;
  background: #42b883;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}
</style>
```

## ✅ Expected Outcome

Your application should:

1. **Navigate between pages** without page reload
2. **Display blog posts** with routing
3. **Show individual posts** using dynamic routes
4. **Handle 404 errors** for invalid URLs
5. **Protect dashboard** with navigation guard
6. **Highlight active links** in navigation
7. **Support back/forward** browser navigation
8. **Scroll to top** on route change
9. **Use programmatic navigation** in some places
10. **Work with nested routes** in dashboard

## 🧪 Testing Checklist

- [ ] Navigate between all pages
- [ ] Click on blog post to see detail page
- [ ] Try invalid blog post ID (should show error)
- [ ] Test dashboard access without login
- [ ] Login and access dashboard
- [ ] Check nested dashboard routes work
- [ ] Visit invalid URL (should show 404)
- [ ] Use browser back/forward buttons
- [ ] Check active link highlighting
- [ ] Test programmatic navigation

## 🎓 Key Concepts

### Router Setup
```javascript
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [...]
})
```

### Dynamic Routes
```javascript
{
  path: '/post/:id',
  component: PostView,
  props: true
}
```

### Programmatic Navigation
```javascript
import { useRouter } from 'vue-router'

const router = useRouter()

router.push('/path')
router.push({ name: 'route-name' })
router.push({ path: '/path', query: { key: 'value' } })
router.back()
router.forward()
```

### Navigation Guards
```javascript
// Global
router.beforeEach((to, from) => {
  // ...
})

// Per-route
{
  path: '/admin',
  beforeEnter: (to, from) => {
    // ...
  }
}
```

## 🚀 Bonus Challenges

1. **Breadcrumbs**: Add breadcrumb navigation
2. **Route Transitions**: Animate route changes
3. **Query Parameters**: Filter blog posts with query params
4. **Lazy Loading**: Lazy load route components
5. **Route Meta**: Add page titles with meta fields
6. **History Mode**: Try hash mode vs history mode
7. **Route Aliases**: Add route aliases

## 📚 Resources

- [Vue Router Documentation](https://router.vuejs.org/)
- [Navigation Guards](https://router.vuejs.org/guide/advanced/navigation-guards.html)
- [Dynamic Routing](https://router.vuejs.org/guide/essentials/dynamic-matching.html)
- [Nested Routes](https://router.vuejs.org/guide/essentials/nested-routes.html)

## 🤔 Reflection Questions

1. What's the difference between `router.push()` and `<RouterLink>`?
2. When would you use navigation guards?
3. Why use named routes instead of paths?
4. What's the purpose of `props: true` in route config?
5. How does Vue Router handle browser history?

## 💡 Common Mistakes

- Forgetting to import and use router in main.js
- Not using `:to` for dynamic RouterLinks
- Mutating route params directly
- Not handling invalid route parameters
- Forgetting `<RouterView>` for nested routes

## 🎯 Success Criteria

✅ Multiple pages accessible via routes  
✅ Dynamic routing works for blog posts  
✅ Navigation guards protect routes  
✅ 404 page for invalid routes  
✅ Nested routes in dashboard  
✅ Programmatic navigation implemented  
✅ Active link styling works

---

**Previous**: [Exercise 08: Slots](../../02-components/ex08-slots/)  
**Next**: [Exercise 10: Pinia State Management](../ex10-pinia-state/)

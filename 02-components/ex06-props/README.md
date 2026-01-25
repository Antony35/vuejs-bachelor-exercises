# Exercise 06: Props

**Difficulty**: ⭐⭐ Intermediate  
**Time**: 2-3 hours  
**Concepts**: Props, prop validation, prop types, one-way data flow

## 🎯 Learning Objectives

- Pass data from parent to child components using props
- Validate props with types and requirements
- Understand one-way data flow
- Use default prop values
- Work with different prop types (String, Number, Object, Array, Boolean)

## 📋 Exercise Description

Enhance the blog application from Exercise 05 by using props to pass data to the `BlogPost` component instead of hardcoding values. Create dynamic, reusable components with proper prop validation.

## 🛠️ Setup

You can continue from Exercise 05 or create a new project:

```bash
npm create vue@latest ex06-props
cd ex06-props
npm install
npm run dev
```

## 📝 Step-by-Step Instructions

### Step 1: Define Props in BlogPost Component

In `BlogPost.vue`:
1. Define props for: title, author, date, excerpt, category
2. Add prop types for validation
3. Remove hardcoded data from the component

### Step 2: Pass Props from Parent

In `App.vue`:
1. Create an array of blog post data objects
2. Use `v-for` to loop through posts
3. Pass data as props to each `BlogPost` instance

### Step 3: Add Prop Validation

For `BlogPost.vue` props, add:
- Type validation (String, Number, etc.)
- Required validation
- Default values where appropriate
- Custom validators (e.g., category must be from a list)

### Step 4: Create a UserCard Component

Create a new component `UserCard.vue` with props:
- `user` (Object): Contains name, email, avatar, bio
- `showBio` (Boolean): Whether to show biography
- `size` (String): 'small', 'medium', or 'large'

Add validation to ensure:
- `user` is required and must be an Object
- `size` must be one of: 'small', 'medium', or 'large'
- `showBio` defaults to true

### Step 5: Work with Object and Array Props

In `BlogPost.vue`, add:
- `tags` prop (Array of strings)
- `author` prop (Object with name, avatar, bio)
- Display tags as badges
- Show author info with avatar

### Step 6: Add Computed Properties Based on Props

Create computed properties that derive values from props:
- `formattedDate`: Format the date prop nicely
- `readingTime`: Calculate based on excerpt length
- `authorInitials`: Get first letter of first and last name

### Step 7: Create a Card Component with Slots Preview

Create a reusable `Card.vue` component with props:
- `title` (String)
- `padding` (String) - default '20px'
- `shadow` (Boolean) - default true
- Use this card to wrap blog posts

### Step 8: Handle Missing Props Gracefully

- Add default values for optional props
- Show placeholder content when props are missing
- Add prop validation warnings

## 💻 Code Structure

### BlogPost.vue
```vue
<template>
  <article class="blog-post">
    <span class="category-badge">{{ category }}</span>
    <h2>{{ title }}</h2>
    
    <div class="author-info">
      <img :src="author.avatar" :alt="author.name" class="avatar">
      <div>
        <p class="author-name">{{ author.name }}</p>
        <p class="post-date">{{ formattedDate }}</p>
      </div>
    </div>
    
    <p class="excerpt">{{ excerpt }}</p>
    
    <div class="tags">
      <span v-for="tag in tags" :key="tag" class="tag">
        {{ tag }}
      </span>
    </div>
    
    <div class="meta">
      <span>{{ readingTime }} min read</span>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  author: {
    type: Object,
    required: true,
    validator: (value) => {
      return value.name && value.avatar
    }
  },
  date: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    default: 'No excerpt available'
  },
  category: {
    type: String,
    required: true,
    validator: (value) => {
      return ['Technology', 'Science', 'Arts', 'Business'].includes(value)
    }
  },
  tags: {
    type: Array,
    default: () => []
  }
})

const formattedDate = computed(() => {
  // Format the date prop
  return new Date(props.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const readingTime = computed(() => {
  // Calculate reading time based on excerpt length
  const wordsPerMinute = 200
  const words = props.excerpt.split(' ').length
  return Math.ceil(words / wordsPerMinute)
})
</script>

<style scoped>
/* Styles */
</style>
```

### App.vue
```vue
<template>
  <div class="app">
    <Header />
    
    <main class="blog-container">
      <BlogPost
        v-for="post in blogPosts"
        :key="post.id"
        :title="post.title"
        :author="post.author"
        :date="post.date"
        :excerpt="post.excerpt"
        :category="post.category"
        :tags="post.tags"
      />
    </main>
    
    <aside class="sidebar">
      <h3>Authors</h3>
      <UserCard
        v-for="user in authors"
        :key="user.id"
        :user="user"
        :show-bio="true"
        size="small"
      />
    </aside>
    
    <Footer />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Header from './components/layout/Header.vue'
import Footer from './components/layout/Footer.vue'
import BlogPost from './components/blog/BlogPost.vue'
import UserCard from './components/UserCard.vue'

const blogPosts = ref([
  {
    id: 1,
    title: 'Getting Started with Vue.js',
    author: {
      name: 'Jane Doe',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    date: '2026-01-20',
    excerpt: 'Learn the basics of Vue.js and build your first application...',
    category: 'Technology',
    tags: ['Vue.js', 'JavaScript', 'Tutorial']
  },
  {
    id: 2,
    title: 'Understanding Component Props',
    author: {
      name: 'John Smith',
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    date: '2026-01-22',
    excerpt: 'Deep dive into Vue component props and how to use them effectively...',
    category: 'Technology',
    tags: ['Vue.js', 'Components', 'Props']
  }
  // Add more posts...
])

const authors = ref([
  {
    id: 1,
    name: 'Jane Doe',
    email: 'jane@example.com',
    avatar: 'https://i.pravatar.cc/150?img=1',
    bio: 'Vue.js enthusiast and developer'
  },
  {
    id: 2,
    name: 'John Smith',
    email: 'john@example.com',
    avatar: 'https://i.pravatar.cc/150?img=2',
    bio: 'Frontend developer specializing in Vue'
  }
])
</script>

<style scoped>
.blog-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin: 20px;
}
</style>
```

### UserCard.vue
```vue
<template>
  <div class="user-card" :class="`size-${size}`">
    <img :src="user.avatar" :alt="user.name" class="avatar">
    <div class="user-info">
      <h4>{{ user.name }}</h4>
      <p class="email">{{ user.email }}</p>
      <p v-if="showBio" class="bio">{{ user.bio }}</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  user: {
    type: Object,
    required: true,
    validator: (value) => {
      return value.name && value.email && value.avatar
    }
  },
  showBio: {
    type: Boolean,
    default: true
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => {
      return ['small', 'medium', 'large'].includes(value)
    }
  }
})
</script>

<style scoped>
/* Size-specific styles */
</style>
```

## ✅ Expected Outcome

Your application should:

1. **Display blog posts** using data passed via props
2. **Validate all props** with types and requirements
3. **Show different post data** for each card
4. **Display user cards** with varying sizes
5. **Handle optional props** with defaults
6. **Format dates** using computed properties
7. **Show warnings** in console for invalid props (test this!)
8. **Render tags** dynamically from array prop

## 🧪 Testing Checklist

- [ ] All blog posts display correctly with passed data
- [ ] Try passing invalid prop types (check console warnings)
- [ ] Remove a required prop (check console error)
- [ ] Pass invalid category (check validator warning)
- [ ] Test UserCard with different sizes
- [ ] Toggle `showBio` prop
- [ ] Verify default prop values work
- [ ] Check that avatar images load

## 🎓 Key Concepts

### Defining Props
```javascript
// Basic
const props = defineProps(['title', 'content'])

// With types
const props = defineProps({
  title: String,
  count: Number
})

// With validation
const props = defineProps({
  title: {
    type: String,
    required: true,
    default: 'Default Title'
  },
  status: {
    type: String,
    validator: (value) => {
      return ['draft', 'published'].includes(value)
    }
  }
})
```

### Using Props in Template
```vue
<template>
  <h1>{{ title }}</h1>
  <p>{{ content }}</p>
</template>
```

### Passing Props
```vue
<!-- Static -->
<BlogPost title="Hello" />

<!-- Dynamic -->
<BlogPost :title="postTitle" />

<!-- Multiple props -->
<BlogPost
  :title="post.title"
  :author="post.author"
  :date="post.date"
/>
```

## 🚀 Bonus Challenges

1. **Spread Operator**: Use `v-bind` to pass all props at once
2. **Prop Mutation Warning**: Try to mutate a prop and observe the warning
3. **Complex Validation**: Create a prop with complex validation logic
4. **Props Interface**: Create a TypeScript-like interface comment for props
5. **Fallback Content**: Show placeholder when optional props are missing
6. **Prop Drilling**: Pass props through multiple component layers

## 📚 Resources

- [Props](https://vuejs.org/guide/components/props.html)
- [Prop Validation](https://vuejs.org/guide/components/props.html#prop-validation)
- [One-Way Data Flow](https://vuejs.org/guide/components/props.html#one-way-data-flow)

## 🤔 Reflection Questions

1. Why can't we mutate props directly in the child component?
2. What's the difference between `:title="value"` and `title="value"`?
3. When should you use prop validation?
4. What happens if you pass a wrong type to a prop?
5. Why use default values for props?

## 💡 Common Mistakes to Avoid

- Mutating props directly (use events or computed instead)
- Forgetting the colon `:` for dynamic props
- Not validating props when type safety is important
- Using complex objects without deep validation
- Forgetting to make arrays/objects default as functions: `default: () => []`

## 🎯 Success Criteria

You've successfully completed this exercise when:
- ✅ All components receive data via props
- ✅ Props are properly typed and validated
- ✅ No hardcoded data in child components
- ✅ Console shows validation warnings for invalid props
- ✅ Default values work correctly
- ✅ Complex props (objects, arrays) are handled properly

---

**Previous**: [Exercise 05: Component Basics](../ex05-components-basics/)  
**Next**: [Exercise 07: Emit Events](../ex07-emit-events/)

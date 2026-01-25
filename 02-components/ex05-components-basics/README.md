# Exercise 05: Component Basics

**Difficulty**: ⭐⭐ Intermediate  
**Time**: 2-3 hours  
**Concepts**: Component creation, single file components, component registration, component composition

## 🎯 Learning Objectives

- Create reusable Vue components
- Understand Single File Components (SFC) structure
- Organize components in a project
- Compose components to build UI
- Pass static data to components

## 📋 Exercise Description

Build a blog post listing page using multiple components. You'll create a `BlogPost` component and use it multiple times to display different posts, demonstrating component reusability.

## 🛠️ Setup

```bash
npm create vue@latest ex05-components-basics
cd ex05-components-basics
npm install
npm run dev
```

## 📝 Step-by-Step Instructions

### Step 1: Plan Your Components

Identify the components you'll need:
- `App.vue` - Main application container
- `BlogPost.vue` - Individual blog post card
- `Header.vue` - Page header
- `Footer.vue` - Page footer

### Step 2: Create Header Component

In `src/components/Header.vue`:
1. Create a header with site title
2. Add a tagline or subtitle
3. Style it appropriately

### Step 3: Create BlogPost Component

In `src/components/BlogPost.vue`:
1. Define the template structure:
   - Post title
   - Author name
   - Publication date
   - Post excerpt/content
   - Read more button
2. Add styles to make it look like a card
3. Don't worry about props yet - use hardcoded data

### Step 4: Create Footer Component

In `src/components/Footer.vue`:
1. Add copyright information
2. Add social media links (icons or text)
3. Style it

### Step 5: Compose Components in App.vue

In `src/App.vue`:
1. Import all three components
2. Use the components in the template
3. Create multiple instances of `BlogPost` with different content (hardcoded for now)

### Step 6: Create a Components Folder Structure

Organize your components:
```
src/
  components/
    layout/
      Header.vue
      Footer.vue
    blog/
      BlogPost.vue
```

Update imports accordingly.

### Step 7: Add Multiple Blog Posts

Create at least 5 different blog post instances in `App.vue`, each with unique content.

### Step 8: Style Your Application

- Add global styles in `App.vue`
- Use scoped styles in each component
- Make it responsive with CSS Grid or Flexbox
- Add hover effects on blog post cards

## 💻 Code Structure

### BlogPost.vue
```vue
<template>
  <article class="blog-post">
    <h2 class="post-title">{{ title }}</h2>
    <div class="post-meta">
      <span class="author">{{ author }}</span>
      <span class="date">{{ date }}</span>
    </div>
    <p class="post-excerpt">{{ excerpt }}</p>
    <button class="read-more">Read More</button>
  </article>
</template>

<script setup>
// For now, define data here (we'll use props in the next exercise)
const title = "My First Blog Post"
const author = "John Doe"
const date = "January 25, 2026"
const excerpt = "This is a short excerpt of my blog post..."
</script>

<style scoped>
.blog-post {
  /* Your card styles */
}
</style>
```

### App.vue
```vue
<template>
  <div class="app">
    <Header />
    
    <main class="blog-container">
      <BlogPost />
      <BlogPost />
      <BlogPost />
      <!-- More blog posts -->
    </main>
    
    <Footer />
  </div>
</template>

<script setup>
import Header from './components/layout/Header.vue'
import Footer from './components/layout/Footer.vue'
import BlogPost from './components/blog/BlogPost.vue'
</script>

<style scoped>
/* Layout styles */
</style>
```

## ✅ Expected Outcome

Your application should:

1. **Display a header** at the top with site branding
2. **Show 5 blog post cards** in a grid or column layout
3. **Have a footer** at the bottom
4. **Use 3 different component files** (Header, BlogPost, Footer)
5. **Apply scoped styles** to each component
6. **Be visually appealing** with proper spacing and colors
7. **Be responsive** on different screen sizes

## 🧪 Testing Checklist

- [ ] All components render correctly
- [ ] Each BlogPost looks like a distinct card
- [ ] Hover effects work on cards
- [ ] Header and Footer appear correctly
- [ ] Page is responsive (try resizing browser)
- [ ] No console errors
- [ ] All imports work correctly

## 🎓 Key Concepts

### Single File Component Structure
```vue
<template>
  <!-- HTML template -->
</template>

<script setup>
// JavaScript logic
</script>

<style scoped>
/* Component-specific styles */
</style>
```

### Component Registration
```vue
<script setup>
// Import the component
import MyComponent from './components/MyComponent.vue'

// It's automatically available in the template
</script>

<template>
  <MyComponent />
</template>
```

### Scoped Styles
- `<style scoped>` makes styles apply only to this component
- Prevents style conflicts between components
- Each component can have its own styling

## 🚀 Bonus Challenges

1. **Card Badge**: Add a "Featured" badge to some posts
2. **Categories**: Add category tags to each post
3. **Image**: Add a thumbnail image to each blog post
4. **Reading Time**: Calculate and display estimated reading time
5. **Sidebar Component**: Create a sidebar with categories or popular posts
6. **Loading State**: Create a loading skeleton component
7. **Empty State**: Create a component for when there are no posts

## 📚 Resources

- [Component Basics](https://vuejs.org/guide/essentials/component-basics.html)
- [Single File Components](https://vuejs.org/guide/scaling-up/sfc.html)
- [Component Registration](https://vuejs.org/guide/components/registration.html)

## 🤔 Reflection Questions

1. What are the benefits of breaking UI into components?
2. Why use Single File Components instead of separate HTML/JS/CSS files?
3. What does `scoped` do in `<style scoped>`?
4. Why do we need to import components in the script section?
5. How does component reusability improve development speed?

## 💡 Common Mistakes to Avoid

- Forgetting to import components before using them
- Using wrong file paths in imports
- Not using `scoped` on styles (causing style conflicts)
- Creating components that are too large (should be focused)
- Inconsistent component naming (use PascalCase for components)

## 🎯 Success Criteria

You've successfully completed this exercise when:
- ✅ You have at least 3 separate component files
- ✅ Components are properly imported and used
- ✅ Each component has its own scoped styles
- ✅ The page layout looks organized and professional
- ✅ Components are reusable (BlogPost used multiple times)
- ✅ Code is organized in a logical folder structure

---

**Previous**: [Exercise 04: Computed & Watch](../../01-vue-basics/ex04-computed-watch/)  
**Next**: [Exercise 06: Props](../ex06-props/)

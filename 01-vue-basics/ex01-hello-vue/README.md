# Exercise 01: Hello Vue

**Difficulty**: ⭐ Beginner  
**Time**: 1-2 hours  
**Concepts**: Vue app initialization, template syntax, reactive data

## 🎯 Learning Objectives

- Create your first Vue 3 application
- Understand the basic structure of a Vue app
- Use template syntax to display data
- Understand Vue's reactivity system

## 📋 Exercise Description

Create a simple Vue application that displays a personalized greeting message and allows the user to change their name.

## 🛠️ Setup

1. Create a new Vue project using Vite:
   ```bash
   npm create vue@latest
   ```

2. When prompted, configure:
   - Project name: `ex01-hello-vue`
   - TypeScript: No
   - JSX: No
   - Vue Router: No
   - Pinia: No
   - Vitest: No
   - ESLint: Yes (recommended)

3. Navigate into the project and install dependencies:
   ```bash
   cd ex01-hello-vue
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 📝 Step-by-Step Instructions

### Step 1: Clean Up the Default Project

1. Open `src/App.vue`
2. Remove all the default content
3. Start with a clean template

### Step 2: Create the Template

In `src/App.vue`, create a template that includes:
- A heading with "Hello Vue!"
- A paragraph that displays: "Welcome, [name]!"
- An input field to change the name
- The current date and time

### Step 3: Add Reactive Data

In the `<script setup>` section:
1. Import `ref` from Vue
2. Create a reactive variable `name` with an initial value (your name)
3. Create a reactive variable `currentDate` with the current date

### Step 4: Bind Data to Template

1. Use double curly braces `{{ }}` to display the `name` variable
2. Use `v-model` to bind the input field to the `name` variable
3. Display the formatted date

### Step 5: Add Basic Styling

Add CSS to make your app look presentable:
- Center the content
- Add padding and margins
- Style the input field
- Add colors and fonts

## 💻 Expected Code Structure

```vue
<template>
  <!-- Your template here -->
</template>

<script setup>
// Import necessary Vue functions
// Define reactive data
</script>

<style scoped>
/* Your styles here */
</style>
```

## ✅ Expected Outcome

When complete, your application should:
1. Display "Hello Vue!" as a heading
2. Show "Welcome, [your name]!" with your initial name
3. Have an input field that updates the welcome message in real-time as you type
4. Display the current date
5. Look clean and centered on the page

## 🧪 Testing Your Solution

1. Open the app in your browser (usually `http://localhost:5173`)
2. Verify the initial greeting displays your name
3. Type in the input field and verify the greeting updates immediately
4. Check that the date is displayed correctly

## 🎓 Key Concepts

### Template Syntax
- `{{ variable }}`: Interpolation - displays data
- `v-model`: Two-way data binding for form inputs

### Reactivity
- `ref()`: Creates a reactive variable
- Changes to reactive variables automatically update the DOM

### Script Setup
- `<script setup>`: Simplified syntax for Composition API
- Variables and functions are automatically available in the template

## 🚀 Bonus Challenges

If you finish early, try these:

1. **Add a Reset Button**: Create a button that resets the name to the original value
2. **Character Counter**: Display how many characters are in the name
3. **Multiple Greetings**: Show different greetings based on the time of day (morning, afternoon, evening)
4. **Favorite Color**: Add another input for favorite color and display it in the message

## 📚 Resources

- [Vue Template Syntax](https://vuejs.org/guide/essentials/template-syntax.html)
- [Reactivity Fundamentals](https://vuejs.org/guide/essentials/reactivity-fundamentals.html)
- [Form Input Bindings](https://vuejs.org/guide/essentials/forms.html)

## 🤔 Reflection Questions

1. What happens when you type in the input field? Why?
2. What's the difference between `ref()` and a regular JavaScript variable?
3. Why do we use `v-model` instead of just `value` and `onChange`?

---

**Next Exercise**: [Exercise 02: Data Binding](../ex02-data-binding/)

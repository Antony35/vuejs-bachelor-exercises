# Exercise 03: Methods & Events

**Difficulty**: ⭐⭐ Beginner to Intermediate  
**Time**: 2-3 hours  
**Concepts**: Methods, event handling, event modifiers, v-on directive

## 🎯 Learning Objectives

- Create and use methods in Vue components
- Handle various user events (click, input, submit, etc.)
- Use event modifiers effectively
- Pass parameters to event handlers
- Understand event object and prevent default behavior

## 📋 Exercise Description

Build an interactive counter application with multiple features that demonstrate event handling and methods. The app will include buttons, keyboard controls, and form submissions.

## 🛠️ Setup

```bash
npm create vue@latest ex03-methods-events
cd ex03-methods-events
npm install
npm run dev
```

Configuration: Same as previous exercises (No TypeScript, Router, Pinia, etc.)

## 📝 Step-by-Step Instructions

### Step 1: Create Basic Counter

1. Create a reactive `count` variable starting at 0
2. Create three buttons:
   - Increment (+1)
   - Decrement (-1)
   - Reset (back to 0)

### Step 2: Implement Methods

Create methods for:
- `increment()`: Adds 1 to count
- `decrement()`: Subtracts 1 from count
- `reset()`: Sets count to 0
- `incrementBy(amount)`: Adds a custom amount to count

### Step 3: Add Event Listeners

Attach event listeners using `v-on` (or `@`):
- Click events on buttons
- Double-click to increment by 10
- Right-click to decrement by 5 (prevent context menu)

### Step 4: Create a Custom Amount Input

Add a form with:
- Number input for custom amount
- "Add" button that adds the custom amount to counter
- Form submission handling with `.prevent` modifier

### Step 5: Add Keyboard Controls

Implement keyboard events:
- Arrow Up: increment
- Arrow Down: decrement
- Space: reset
- Use event modifiers where appropriate

### Step 6: Add Event Modifiers Demo

Create examples showing:
- `.prevent`: Prevent form submission from reloading page
- `.stop`: Stop event propagation
- `.once`: Listen to event only once
- `.key modifiers`: Specific key listeners (enter, esc, etc.)

### Step 7: Create a Click History

- Track all button clicks in an array
- Display a list showing: "Incremented by 1 at [time]"
- Add a "Clear History" button

### Step 8: Add Validation

- Prevent count from going below 0
- Prevent count from going above 100
- Show warning message when limits are reached

## 💻 Code Structure

```vue
<template>
  <div class="counter-app">
    <h1>Interactive Counter</h1>
    
    <!-- Display current count -->
    <div class="counter-display">
      <h2>Count: {{ count }}</h2>
    </div>
    
    <!-- Basic controls -->
    <div class="controls">
      <button @click="increment">+1</button>
      <button @click="decrement">-1</button>
      <button @click="reset">Reset</button>
    </div>
    
    <!-- Custom amount form -->
    <form @submit.prevent="addCustomAmount">
      <input v-model.number="customAmount" type="number">
      <button type="submit">Add</button>
    </form>
    
    <!-- Advanced controls -->
    <div class="advanced-controls">
      <button @dblclick="incrementBy(10)">Double-click: +10</button>
      <button @click.right.prevent="decrementBy(5)">Right-click: -5</button>
    </div>
    
    <!-- History -->
    <div class="history">
      <!-- Display click history -->
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const count = ref(0)
const customAmount = ref(1)
const history = ref([])

// Implement all methods here

</script>

<style scoped>
/* Your styles */
</style>
```

## ✅ Expected Outcome

Your application should:

1. **Display current count** with large, clear text
2. **Increment/decrement** with button clicks
3. **Reset** count to 0
4. **Accept custom amounts** via form input
5. **Handle keyboard events** (arrow keys, space)
6. **Track history** of all counter changes
7. **Validate limits** (0-100 range)
8. **Prevent default behaviors** (form submission, context menu)
9. **Show timestamps** for each action in history
10. **Provide clear visual feedback** for all actions

## 🧪 Testing Checklist

- [ ] Click increment/decrement buttons
- [ ] Double-click the special button
- [ ] Right-click the right-click button
- [ ] Submit form with Enter key
- [ ] Use keyboard arrow keys
- [ ] Press Space to reset
- [ ] Try to go below 0 (should prevent)
- [ ] Try to go above 100 (should prevent)
- [ ] Verify history updates correctly
- [ ] Check that timestamps are accurate

## 🎓 Key Concepts

### Event Handling Syntax
```vue
<!-- Full syntax -->
<button v-on:click="increment">Click me</button>

<!-- Shorthand (preferred) -->
<button @click="increment">Click me</button>

<!-- With parameters -->
<button @click="incrementBy(5)">+5</button>

<!-- Inline expressions -->
<button @click="count++">+1</button>
```

### Event Modifiers
```vue
<!-- Prevent default -->
<form @submit.prevent="handleSubmit">

<!-- Stop propagation -->
<div @click.stop="handleClick">

<!-- Modifiers can be chained -->
<button @click.stop.prevent="doThis">

<!-- Key modifiers -->
<input @keyup.enter="submit">
<input @keyup.esc="cancel">
```

### Accessing Event Object
```javascript
function handleClick(event) {
  console.log(event.target)
  console.log(event.clientX)
}
```

## 🚀 Bonus Challenges

1. **Undo/Redo**: Implement undo and redo functionality
2. **Animation**: Add transitions when count changes
3. **Sound Effects**: Play sounds on button clicks (use Web Audio API)
4. **Goal Setting**: Let users set a target and show progress
5. **Multiple Counters**: Create several independent counters
6. **Local Storage**: Save count and history to localStorage

## 📚 Resources

- [Event Handling](https://vuejs.org/guide/essentials/event-handling.html)
- [Event Modifiers](https://vuejs.org/guide/essentials/event-handling.html#event-modifiers)
- [Key Modifiers](https://vuejs.org/guide/essentials/event-handling.html#key-modifiers)
- [MDN: Event Reference](https://developer.mozilla.org/en-US/docs/Web/Events)

## 🤔 Reflection Questions

1. What's the difference between `@click="method"` and `@click="method()"`?
2. When would you use event modifiers vs handling in the method?
3. Why is `.prevent` useful for forms?
4. How do you pass both a parameter AND the event object to a method?

## 💡 Common Mistakes to Avoid

- Calling the method with `()` when you don't need to pass parameters
- Forgetting `.prevent` on forms (causes page reload)
- Not validating input from number fields
- Using wrong key names for keyboard modifiers

---

**Previous**: [Exercise 02: Data Binding](../ex02-data-binding/)  
**Next**: [Exercise 04: Computed Properties & Watchers](../ex04-computed-watch/)

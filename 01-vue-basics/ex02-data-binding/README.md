# Exercise 02: Data Binding

**Difficulty**: ⭐⭐ Beginner  
**Time**: 1-2 hours  
**Concepts**: v-bind, v-model, class binding, style binding

## 🎯 Learning Objectives

- Master different types of data binding in Vue
- Use `v-bind` for attribute binding
- Apply dynamic classes and styles
- Understand the difference between one-way and two-way binding

## 📋 Exercise Description

Create a product card that demonstrates various data binding techniques. The card should display product information and allow users to customize its appearance dynamically.

## 🛠️ Setup

1. Create a new Vue project:
   ```bash
   npm create vue@latest ex02-data-binding
   ```

2. Use the same configuration as Exercise 01

3. Install and run:
   ```bash
   cd ex02-data-binding
   npm install
   npm run dev
   ```

## 📝 Step-by-Step Instructions

### Step 1: Define Product Data

Create reactive data for a product:
- Product name (string)
- Product price (number)
- Product image URL (string)
- Product description (string)
- In stock status (boolean)
- Quantity (number)
- Product color (string for styling)

### Step 2: Create the Product Card Template

Build a card that displays:
- Product image (use `v-bind:src` or `:src`)
- Product name as a heading
- Product price
- Description
- Stock status (show "In Stock" or "Out of Stock")
- A quantity selector (input with v-model)

### Step 3: Implement Attribute Binding

1. Bind the image `src` attribute to the product image URL
2. Bind the image `alt` attribute to the product name
3. Bind a `title` attribute to show the full description on hover

### Step 4: Implement Class Binding

Add dynamic classes based on data:
- Add class `in-stock` or `out-of-stock` based on availability
- Add class `low-price` if price is below 50
- Add class `selected` when a checkbox is checked

### Step 5: Implement Style Binding

Add dynamic inline styles:
- Bind background color based on the product color variable
- Bind font size based on a size selector
- Bind border width based on quantity

### Step 6: Create Interactive Controls

Add form controls to change:
- Product color (color picker or select dropdown)
- Font size (range slider)
- In stock status (checkbox)
- Quantity (number input)

### Step 7: Add Styling

Style your product card to look professional with CSS.

## 💻 Code Structure

```vue
<template>
  <div class="container">
    <div class="product-card" :style="{ borderColor: productColor }">
      <!-- Product image with bound attributes -->
      <!-- Product information -->
      <!-- Interactive controls -->
    </div>
    
    <div class="controls">
      <!-- Color picker -->
      <!-- Size slider -->
      <!-- Stock checkbox -->
      <!-- Quantity input -->
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Define all reactive variables here
</script>

<style scoped>
/* Your styles here */
</style>
```

## ✅ Expected Outcome

Your application should:

1. **Display a product card** with image, name, price, and description
2. **Show stock status** with different styling for in-stock vs out-of-stock
3. **Update image dynamically** using attribute binding
4. **Apply dynamic classes** based on conditions (price, stock status)
5. **Apply dynamic styles** (border color, background) based on user input
6. **Provide interactive controls** that immediately affect the card's appearance
7. **Use v-model** for two-way binding with quantity input

## 🧪 Testing Your Solution

Test the following:

1. Change the product color - the border or background should update
2. Toggle the stock status - classes and display should change
3. Adjust the quantity - check that v-model works bidirectionally
4. Hover over elements - verify title attributes work
5. Check responsive behavior

## 🎓 Key Concepts

### Attribute Binding
```vue
<!-- Full syntax -->
<img v-bind:src="imageUrl" v-bind:alt="productName">

<!-- Shorthand -->
<img :src="imageUrl" :alt="productName">
```

### Class Binding
```vue
<!-- Object syntax -->
<div :class="{ active: isActive, 'text-danger': hasError }">

<!-- Array syntax -->
<div :class="[activeClass, errorClass]">
```

### Style Binding
```vue
<!-- Object syntax -->
<div :style="{ color: activeColor, fontSize: fontSize + 'px' }">

<!-- Array syntax -->
<div :style="[baseStyles, overridingStyles]">
```

## 🚀 Bonus Challenges

1. **Multiple Products**: Create an array of products and display multiple cards
2. **Image Gallery**: Add multiple images and create a thumbnail selector
3. **Discount Calculator**: Add a discount percentage and show the final price
4. **Theme Switcher**: Add dark/light theme toggle that changes the entire card style
5. **Accessibility**: Add ARIA attributes dynamically based on state

## 📚 Resources

- [Class and Style Bindings](https://vuejs.org/guide/essentials/class-and-style.html)
- [Template Syntax - Attributes](https://vuejs.org/guide/essentials/template-syntax.html#attributes)
- [Form Input Bindings](https://vuejs.org/guide/essentials/forms.html)

## 🤔 Reflection Questions

1. What's the difference between `v-bind:class` and regular `class`?
2. When would you use `:style` vs CSS classes?
3. Why is `v-model` considered two-way binding?
4. What's the shorthand for `v-bind:`?

## 💡 Common Mistakes to Avoid

- Forgetting the colon `:` before attribute names when binding
- Using wrong syntax for class objects (remember the curly braces!)
- Forgetting quotes around CSS property names with dashes (use camelCase or quotes)

---

**Previous**: [Exercise 01: Hello Vue](../ex01-hello-vue/)  
**Next**: [Exercise 03: Methods & Events](../ex03-methods-events/)

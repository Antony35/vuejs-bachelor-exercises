# Exercise 04: Computed Properties & Watchers

**Difficulty**: ⭐⭐⭐ Intermediate  
**Time**: 2-3 hours  
**Concepts**: Computed properties, watchers, reactive dependencies, performance optimization

## 🎯 Learning Objectives

- Understand computed properties and when to use them
- Implement watchers to react to data changes
- Distinguish between methods, computed, and watch
- Optimize performance with computed properties
- Use watchers for side effects and async operations

## 📋 Exercise Description

Create a shopping cart application that calculates totals, applies discounts, and demonstrates the power of computed properties and watchers. The app will automatically recalculate prices and track changes.

## 🛠️ Setup

```bash
npm create vue@latest ex04-computed-watch
cd ex04-computed-watch
npm install
npm run dev
```

## 📝 Step-by-Step Instructions

### Step 1: Create Product Data

Define reactive data for:
- Array of cart items (each with: name, price, quantity)
- Tax rate (percentage)
- Discount code (string)
- Shipping cost (number)
- Valid discount codes with their percentage off

### Step 2: Implement Basic Computed Properties

Create computed properties for:
- `subtotal`: Sum of all items (price × quantity)
- `tax`: Calculated based on subtotal and tax rate
- `total`: Subtotal + tax + shipping - discount
- `itemCount`: Total number of items in cart

### Step 3: Implement Advanced Computed Properties

Create computed properties for:
- `discountAmount`: Calculate discount based on code
- `isDiscountValid`: Check if entered code is valid
- `averageItemPrice`: Calculate average price per item
- `formattedTotal`: Format total as currency (e.g., "$123.45")

### Step 4: Add Items Management

Create methods to:
- Add item to cart
- Remove item from cart
- Update item quantity
- Clear entire cart

### Step 5: Implement Watchers

Create watchers for:
- Watch `subtotal`: Log whenever subtotal changes
- Watch `discountCode`: Validate and show message
- Watch cart items deeply: Track any changes to cart
- Watch `total`: Show alert if total exceeds a threshold (e.g., $500)

### Step 6: Create Search/Filter Feature

Add:
- Search input field
- Computed property `filteredItems` that filters items based on search
- Display filtered items count

### Step 7: Add Statistics Dashboard

Create computed properties to display:
- Most expensive item
- Cheapest item
- Average item price
- Total savings from discount

### Step 8: Implement Form Validation

Use computed properties for:
- Check if cart is empty
- Validate discount code format
- Determine if checkout button should be enabled
- Calculate estimated delivery date (based on total weight)

## 💻 Code Structure

```vue
<template>
  <div class="shopping-cart">
    <h1>Shopping Cart</h1>
    
    <!-- Cart Items Display -->
    <div class="cart-items">
      <!-- Loop through cart items -->
    </div>
    
    <!-- Add Item Form -->
    <div class="add-item">
      <!-- Form to add new items -->
    </div>
    
    <!-- Discount Code Input -->
    <div class="discount-section">
      <input v-model="discountCode" placeholder="Enter discount code">
      <p v-if="isDiscountValid" class="success">Valid code!</p>
      <p v-else-if="discountCode" class="error">Invalid code</p>
    </div>
    
    <!-- Cart Summary -->
    <div class="cart-summary">
      <p>Subtotal: {{ formattedSubtotal }}</p>
      <p>Tax ({{ taxRate }}%): {{ formattedTax }}</p>
      <p>Shipping: {{ formattedShipping }}</p>
      <p v-if="discountAmount > 0" class="discount">
        Discount: -{{ formattedDiscount }}
      </p>
      <h2>Total: {{ formattedTotal }}</h2>
    </div>
    
    <!-- Statistics -->
    <div class="statistics">
      <h3>Cart Statistics</h3>
      <!-- Display computed statistics -->
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

// Reactive data
const cartItems = ref([
  { id: 1, name: 'Laptop', price: 999, quantity: 1 },
  { id: 2, name: 'Mouse', price: 25, quantity: 2 },
  { id: 3, name: 'Keyboard', price: 75, quantity: 1 }
])

const taxRate = ref(10) // 10%
const discountCode = ref('')
const shippingCost = ref(15)

const validDiscountCodes = {
  'SAVE10': 10,
  'SAVE20': 20,
  'WELCOME': 5
}

// Computed properties
const subtotal = computed(() => {
  // Calculate sum of all items
})

const isDiscountValid = computed(() => {
  // Check if code is valid
})

// ... more computed properties

// Watchers
watch(subtotal, (newValue, oldValue) => {
  console.log(`Subtotal changed from $${oldValue} to $${newValue}`)
})

// ... more watchers

// Methods
function addItem(item) {
  // Implementation
}

</script>

<style scoped>
/* Your styles */
</style>
```

## ✅ Expected Outcome

Your application should:

1. **Display all cart items** with name, price, quantity
2. **Calculate subtotal** automatically when items/quantities change
3. **Apply tax** to the subtotal
4. **Validate discount codes** and apply discounts
5. **Show formatted prices** (currency format)
6. **Update totals in real-time** as you make changes
7. **Track changes with watchers** (console logs)
8. **Display statistics** (most expensive item, averages, etc.)
9. **Enable/disable checkout** based on cart state
10. **Show item count** in cart

## 🧪 Testing Checklist

- [ ] Add/remove items and verify totals update
- [ ] Change quantities and see automatic recalculation
- [ ] Enter valid discount code (e.g., "SAVE10")
- [ ] Enter invalid discount code
- [ ] Check console logs when totals change
- [ ] Verify tax calculation is correct
- [ ] Test that computed properties don't recalculate unnecessarily
- [ ] Change tax rate and see total update
- [ ] Clear cart and verify all totals reset

## 🎓 Key Concepts

### Computed Properties
```javascript
// Computed property
const total = computed(() => {
  return subtotal.value + tax.value
})

// Accessing computed value
console.log(total.value)
```

### Watchers
```javascript
// Simple watch
watch(count, (newValue, oldValue) => {
  console.log(`Changed from ${oldValue} to ${newValue}`)
})

// Deep watch for objects/arrays
watch(cartItems, (newValue) => {
  console.log('Cart updated:', newValue)
}, { deep: true })

// Immediate execution
watch(source, callback, { immediate: true })
```

### Computed vs Methods
- **Computed**: Cached, only re-runs when dependencies change
- **Methods**: Runs every time it's called

### When to Use What?

| Feature | Use Case |
|---------|----------|
| **Computed** | Derive value from existing data, need caching |
| **Watch** | Perform side effects (API calls, logging) |
| **Methods** | Event handlers, actions, non-reactive logic |

## 🚀 Bonus Challenges

1. **Wishlist**: Add items to a wishlist and move them to cart
2. **Price History**: Track price changes with watchers and show trends
3. **Auto-save**: Use watchers to save cart to localStorage
4. **Coupon Timer**: Add expiring coupons with countdown
5. **Bulk Discounts**: Apply discounts when buying multiple of same item
6. **Currency Converter**: Add computed property to show prices in different currencies

## 📚 Resources

- [Computed Properties](https://vuejs.org/guide/essentials/computed.html)
- [Watchers](https://vuejs.org/guide/essentials/watchers.html)
- [Reactivity Fundamentals](https://vuejs.org/guide/essentials/reactivity-fundamentals.html)
- [Computed vs Methods](https://vuejs.org/guide/essentials/computed.html#computed-caching-vs-methods)

## 🤔 Reflection Questions

1. Why are computed properties cached?
2. When would you use a watcher instead of a computed property?
3. What's the performance benefit of computed properties over methods?
4. Why do we need `{ deep: true }` when watching objects/arrays?
5. Can a computed property have side effects? Should it?

## 💡 Common Mistakes to Avoid

- Using methods in templates when computed would be better (performance)
- Trying to mutate data inside computed properties (they should be pure)
- Not using `deep: true` when watching nested objects
- Forgetting `.value` when accessing reactive refs in script
- Creating unnecessary watchers when computed would work

## 🎯 Success Criteria

You've successfully completed this exercise when:
- ✅ All totals calculate correctly and automatically
- ✅ Computed properties update only when dependencies change
- ✅ Watchers log changes to the console
- ✅ Discount codes validate and apply correctly
- ✅ Cart statistics display accurate information
- ✅ Performance is optimal (no unnecessary recalculations)

---

**Previous**: [Exercise 03: Methods & Events](../ex03-methods-events/)  
**Next**: [Exercise 05: Component Basics](../../02-components/ex05-components-basics/)

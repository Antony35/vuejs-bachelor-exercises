# Exercise 10: Pinia State Management

**Difficulty**: ⭐⭐⭐ Intermediate to Advanced  
**Time**: 3-4 hours  
**Concepts**: Pinia, state management, stores, actions, getters, composition API stores

## 🎯 Learning Objectives

- Understand why state management is needed
- Set up Pinia in a Vue application
- Create stores with state, getters, and actions
- Share state across components
- Persist state to localStorage
- Use multiple stores together
- Handle async operations in stores

## 📋 Exercise Description

Build a shopping cart application with global state management using Pinia. Create stores for products, cart, and user authentication. Demonstrate how components can access and modify shared state.

## 🛠️ Setup

```bash
npm create vue@latest ex10-pinia-state
```

**Important**: When prompted, select **YES** for Pinia!

```bash
cd ex10-pinia-state
npm install
npm run dev
```

## 📝 Step-by-Step Instructions

### Step 1: Explore Pinia Setup

1. Check `src/main.js` - Pinia should be configured
2. Look at `src/stores/` folder
3. Examine the counter store example

### Step 2: Create Products Store

Create `src/stores/products.js`:
- State: Array of products
- Getters: Filter by category, sort by price, search
- Actions: Load products, add product, update product

### Step 3: Create Cart Store

Create `src/stores/cart.js`:
- State: Array of cart items
- Getters: Total price, item count, cart summary
- Actions: Add to cart, remove from cart, update quantity, clear cart

### Step 4: Create User Store

Create `src/stores/user.js`:
- State: User info, authentication status
- Getters: Is authenticated, user full name
- Actions: Login, logout, update profile

### Step 5: Use Stores in Components

Create components that use the stores:
- `ProductList.vue`: Display products from store
- `ProductCard.vue`: Show individual product, add to cart
- `Cart.vue`: Display cart items and total
- `UserProfile.vue`: Show and edit user information

### Step 6: Implement Store Actions

In cart store, implement:
- Add items to cart (increment quantity if already exists)
- Remove items from cart
- Update item quantity
- Calculate totals using getters

### Step 7: Add Persistence

Use localStorage to:
- Save cart state when it changes
- Load cart state on app initialization
- Save user authentication status

### Step 8: Create Store Composables

Create advanced features:
- Watchers on store state
- Combine multiple stores
- Handle loading and error states

## 💻 Code Structure

### stores/products.js
```javascript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useProductsStore = defineStore('products', () => {
  // State
  const products = ref([
    {
      id: 1,
      name: 'Laptop',
      price: 999,
      category: 'Electronics',
      image: 'https://picsum.photos/200/200?random=1',
      description: 'High-performance laptop',
      stock: 10
    },
    {
      id: 2,
      name: 'Headphones',
      price: 199,
      category: 'Electronics',
      image: 'https://picsum.photos/200/200?random=2',
      description: 'Noise-cancelling headphones',
      stock: 25
    },
    {
      id: 3,
      name: 'Coffee Maker',
      price: 79,
      category: 'Home',
      image: 'https://picsum.photos/200/200?random=3',
      description: 'Automatic coffee maker',
      stock: 15
    },
    {
      id: 4,
      name: 'Desk Chair',
      price: 299,
      category: 'Furniture',
      image: 'https://picsum.photos/200/200?random=4',
      description: 'Ergonomic office chair',
      stock: 8
    }
  ])

  const isLoading = ref(false)
  const error = ref(null)

  // Getters
  const productsByCategory = computed(() => {
    return (category) => {
      if (!category) return products.value
      return products.value.filter(p => p.category === category)
    }
  })

  const categories = computed(() => {
    return [...new Set(products.value.map(p => p.category))]
  })

  const searchProducts = computed(() => {
    return (query) => {
      if (!query) return products.value
      return products.value.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
      )
    }
  })

  const getProductById = computed(() => {
    return (id) => products.value.find(p => p.id === id)
  })

  // Actions
  async function loadProducts() {
    isLoading.value = true
    error.value = null
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      // In real app: products.value = await api.getProducts()
    } catch (e) {
      error.value = 'Failed to load products'
    } finally {
      isLoading.value = false
    }
  }

  function updateStock(productId, quantity) {
    const product = products.value.find(p => p.id === productId)
    if (product) {
      product.stock -= quantity
    }
  }

  return {
    // State
    products,
    isLoading,
    error,
    // Getters
    productsByCategory,
    categories,
    searchProducts,
    getProductById,
    // Actions
    loadProducts,
    updateStock
  }
})
```

### stores/cart.js
```javascript
import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useProductsStore } from './products'

export const useCartStore = defineStore('cart', () => {
  const productsStore = useProductsStore()

  // State
  const items = ref([])
  
  // Load from localStorage
  const savedCart = localStorage.getItem('cart')
  if (savedCart) {
    items.value = JSON.parse(savedCart)
  }

  // Getters
  const itemCount = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0)
  })

  const subtotal = computed(() => {
    return items.value.reduce((total, item) => {
      const product = productsStore.getProductById(item.productId)
      return total + (product ? product.price * item.quantity : 0)
    }, 0)
  })

  const tax = computed(() => {
    return subtotal.value * 0.1 // 10% tax
  })

  const total = computed(() => {
    return subtotal.value + tax.value
  })

  const cartItems = computed(() => {
    return items.value.map(item => {
      const product = productsStore.getProductById(item.productId)
      return {
        ...item,
        product,
        itemTotal: product ? product.price * item.quantity : 0
      }
    })
  })

  const isEmpty = computed(() => items.value.length === 0)

  // Actions
  function addToCart(productId, quantity = 1) {
    const existingItem = items.value.find(item => item.productId === productId)
    
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      items.value.push({
        productId,
        quantity,
        addedAt: new Date().toISOString()
      })
    }
  }

  function removeFromCart(productId) {
    const index = items.value.findIndex(item => item.productId === productId)
    if (index > -1) {
      items.value.splice(index, 1)
    }
  }

  function updateQuantity(productId, quantity) {
    const item = items.value.find(item => item.productId === productId)
    if (item) {
      if (quantity <= 0) {
        removeFromCart(productId)
      } else {
        item.quantity = quantity
      }
    }
  }

  function clearCart() {
    items.value = []
  }

  function checkout() {
    // Update product stock
    items.value.forEach(item => {
      productsStore.updateStock(item.productId, item.quantity)
    })
    
    // Clear cart
    clearCart()
    
    return {
      success: true,
      message: 'Order placed successfully!'
    }
  }

  // Persist to localStorage
  watch(items, (newItems) => {
    localStorage.setItem('cart', JSON.stringify(newItems))
  }, { deep: true })

  return {
    // State
    items,
    // Getters
    itemCount,
    subtotal,
    tax,
    total,
    cartItems,
    isEmpty,
    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    checkout
  }
})
```

### stores/user.js
```javascript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // State
  const user = ref(null)
  const isAuthenticated = ref(false)

  // Load from localStorage
  const savedAuth = localStorage.getItem('isAuthenticated')
  const savedUser = localStorage.getItem('user')
  
  if (savedAuth === 'true' && savedUser) {
    isAuthenticated.value = true
    user.value = JSON.parse(savedUser)
  }

  // Getters
  const fullName = computed(() => {
    if (!user.value) return ''
    return `${user.value.firstName} ${user.value.lastName}`
  })

  const initials = computed(() => {
    if (!user.value) return ''
    return `${user.value.firstName[0]}${user.value.lastName[0]}`
  })

  // Actions
  function login(email, password) {
    // Simulate login - in real app, call API
    if (email && password) {
      user.value = {
        id: 1,
        email: email,
        firstName: 'John',
        lastName: 'Doe',
        avatar: 'https://i.pravatar.cc/150?img=1'
      }
      isAuthenticated.value = true
      
      // Save to localStorage
      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem('user', JSON.stringify(user.value))
      
      return { success: true }
    }
    return { success: false, error: 'Invalid credentials' }
  }

  function logout() {
    user.value = null
    isAuthenticated.value = false
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('user')
  }

  function updateProfile(updates) {
    if (user.value) {
      user.value = { ...user.value, ...updates }
      localStorage.setItem('user', JSON.stringify(user.value))
    }
  }

  return {
    // State
    user,
    isAuthenticated,
    // Getters
    fullName,
    initials,
    // Actions
    login,
    logout,
    updateProfile
  }
})
```

### components/ProductList.vue
```vue
<template>
  <div class="product-list">
    <div class="filters">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search products..."
        class="search-input"
      >
      
      <select v-model="selectedCategory" class="category-select">
        <option value="">All Categories</option>
        <option v-for="category in productsStore.categories" :key="category" :value="category">
          {{ category }}
        </option>
      </select>
    </div>

    <div v-if="productsStore.isLoading" class="loading">
      Loading products...
    </div>

    <div v-else class="products-grid">
      <ProductCard
        v-for="product in filteredProducts"
        :key="product.id"
        :product="product"
      />
    </div>

    <p v-if="filteredProducts.length === 0" class="no-results">
      No products found
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useProductsStore } from '../stores/products'
import ProductCard from './ProductCard.vue'

const productsStore = useProductsStore()

const searchQuery = ref('')
const selectedCategory = ref('')

const filteredProducts = computed(() => {
  let result = productsStore.products

  if (searchQuery.value) {
    result = productsStore.searchProducts(searchQuery.value)
  }

  if (selectedCategory.value) {
    result = result.filter(p => p.category === selectedCategory.value)
  }

  return result
})
</script>

<style scoped>
.product-list {
  padding: 20px;
}

.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.search-input,
.category-select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}
</style>
```

### components/ProductCard.vue
```vue
<template>
  <div class="product-card">
    <img :src="product.image" :alt="product.name" />
    <h3>{{ product.name }}</h3>
    <p class="description">{{ product.description }}</p>
    <p class="category">{{ product.category }}</p>
    <p class="price">${{ product.price }}</p>
    <p class="stock" :class="{ 'low-stock': product.stock < 5 }">
      {{ product.stock }} in stock
    </p>
    <button
      @click="handleAddToCart"
      :disabled="product.stock === 0"
      class="add-to-cart-btn"
    >
      {{ product.stock === 0 ? 'Out of Stock' : 'Add to Cart' }}
    </button>
  </div>
</template>

<script setup>
import { useCartStore } from '../stores/cart'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const cartStore = useCartStore()

function handleAddToCart() {
  cartStore.addToCart(props.product.id)
  // Optional: show notification
  alert(`${props.product.name} added to cart!`)
}
</script>

<style scoped>
.product-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
}

.product-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
}

.price {
  font-size: 24px;
  font-weight: bold;
  color: #42b883;
}

.add-to-cart-btn {
  width: 100%;
  padding: 10px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.add-to-cart-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.low-stock {
  color: #ff6b6b;
  font-weight: bold;
}
</style>
```

### components/Cart.vue
```vue
<template>
  <div class="cart">
    <h2>Shopping Cart ({{ cartStore.itemCount }} items)</h2>

    <div v-if="cartStore.isEmpty" class="empty-cart">
      <p>Your cart is empty</p>
      <RouterLink to="/products">Continue Shopping</RouterLink>
    </div>

    <div v-else>
      <div class="cart-items">
        <div
          v-for="item in cartStore.cartItems"
          :key="item.productId"
          class="cart-item"
        >
          <img :src="item.product.image" :alt="item.product.name" />
          <div class="item-details">
            <h4>{{ item.product.name }}</h4>
            <p>${{ item.product.price }}</p>
          </div>
          <div class="quantity-controls">
            <button @click="cartStore.updateQuantity(item.productId, item.quantity - 1)">
              -
            </button>
            <span>{{ item.quantity }}</span>
            <button @click="cartStore.updateQuantity(item.productId, item.quantity + 1)">
              +
            </button>
          </div>
          <p class="item-total">${{ item.itemTotal }}</p>
          <button @click="cartStore.removeFromCart(item.productId)" class="remove-btn">
            Remove
          </button>
        </div>
      </div>

      <div class="cart-summary">
        <div class="summary-row">
          <span>Subtotal:</span>
          <span>${{ cartStore.subtotal.toFixed(2) }}</span>
        </div>
        <div class="summary-row">
          <span>Tax (10%):</span>
          <span>${{ cartStore.tax.toFixed(2) }}</span>
        </div>
        <div class="summary-row total">
          <span>Total:</span>
          <span>${{ cartStore.total.toFixed(2) }}</span>
        </div>
        <button @click="handleCheckout" class="checkout-btn">
          Checkout
        </button>
        <button @click="cartStore.clearCart" class="clear-btn">
          Clear Cart
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '../stores/cart'
import { useRouter } from 'vue-router'

const cartStore = useCartStore()
const router = useRouter()

function handleCheckout() {
  const result = cartStore.checkout()
  if (result.success) {
    alert(result.message)
    router.push('/')
  }
}
</script>

<style scoped>
.cart {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.cart-items {
  margin-bottom: 30px;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 10px;
}

.cart-item img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.cart-summary {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.summary-row.total {
  font-size: 24px;
  font-weight: bold;
  padding-top: 10px;
  border-top: 2px solid #333;
}

.checkout-btn {
  width: 100%;
  padding: 15px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 18px;
  cursor: pointer;
  margin-top: 15px;
}
</style>
```

## ✅ Expected Outcome

Your application should:

1. **Display products** from Pinia store
2. **Add products to cart** and update cart state
3. **Show cart count** in navigation
4. **Calculate totals** using getters
5. **Update quantities** in cart
6. **Remove items** from cart
7. **Persist cart** to localStorage
8. **Handle user authentication** via store
9. **Share state** across components
10. **Process checkout** and update product stock

## 🧪 Testing Checklist

- [ ] Add products to cart
- [ ] Update item quantities
- [ ] Remove items from cart
- [ ] Check cart persists after page refresh
- [ ] Verify total calculations
- [ ] Test search and filter (uses store getters)
- [ ] Login/logout functionality
- [ ] Checkout process
- [ ] Multiple components access same store
- [ ] Stock updates after checkout

## 🎓 Key Concepts

### Defining a Store (Composition API)
```javascript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useMyStore = defineStore('myStore', () => {
  // State
  const count = ref(0)
  
  // Getters
  const doubleCount = computed(() => count.value * 2)
  
  // Actions
  function increment() {
    count.value++
  }
  
  return { count, doubleCount, increment }
})
```

### Using a Store in Components
```javascript
import { useMyStore } from '@/stores/myStore'

const myStore = useMyStore()

// Access state
console.log(myStore.count)

// Access getters
console.log(myStore.doubleCount)

// Call actions
myStore.increment()
```

### Using Multiple Stores
```javascript
const userStore = useUserStore()
const cartStore = useCartStore()

// Stores can access each other
const productsStore = useProductsStore()
```

## 🚀 Bonus Challenges

1. **Wishlist Store**: Create a wishlist feature
2. **Order History**: Store past orders
3. **Product Reviews**: Store with reviews and ratings
4. **Notifications**: Global notification store
5. **Undo/Redo**: Implement with store history
6. **Store Plugins**: Create custom Pinia plugins
7. **Dev Tools**: Explore Pinia devtools integration

## 📚 Resources

- [Pinia Documentation](https://pinia.vuejs.org/)
- [Composition Stores](https://pinia.vuejs.org/core-concepts/#setup-stores)
- [Getters](https://pinia.vuejs.org/core-concepts/getters.html)
- [Actions](https://pinia.vuejs.org/core-concepts/actions.html)

## 🤔 Reflection Questions

1. Why use Pinia instead of props and events?
2. When should state be in a store vs component?
3. What's the difference between state and getters?
4. How does Pinia differ from Vuex?
5. Why use Composition API stores?

## 💡 Common Mistakes

- Mutating state directly instead of using actions (actually OK in Pinia!)
- Not using getters for derived state
- Creating too many stores (or too few)
- Not persisting important state
- Forgetting to handle async errors in actions

## 🎯 Success Criteria

✅ Multiple stores created and working  
✅ Components access shared state  
✅ Getters compute derived values  
✅ Actions modify state correctly  
✅ State persists to localStorage  
✅ Stores interact with each other  
✅ Cart and products functionality complete

---

**Previous**: [Exercise 09: Vue Router](../ex09-vue-router/)  
**Next**: [Exercise 11: API with Fetch](../../04-api-async/ex11-api-fetch/)

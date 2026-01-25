# Exercise 12: Async/Await Patterns

**Difficulty**: ⭐⭐⭐ Advanced  
**Time**: 3-4 hours  
**Concepts**: Async/await, Promise handling, concurrent requests, error handling, composables, advanced async patterns

## 🎯 Learning Objectives

- Master async/await syntax
- Handle multiple concurrent API requests
- Create reusable async composables
- Implement advanced error handling
- Use Promise.all, Promise.race, Promise.allSettled
- Handle request cancellation
- Implement retry logic and exponential backoff

## 📋 Exercise Description

Build a weather dashboard that fetches data from multiple APIs concurrently, handles various async scenarios, and demonstrates advanced async patterns. Create reusable composables for common async operations.

## 🛠️ Setup

```bash
npm create vue@latest ex12-async-await
cd ex12-async-await
npm install
npm run dev
```

We'll use these free APIs:
- [OpenWeatherMap API](https://openweathermap.org/api) (requires free API key)
- [REST Countries API](https://restcountries.com/)
- [JSONPlaceholder](https://jsonplaceholder.typicode.com/) (for testing)

## 📝 Step-by-Step Instructions

### Step 1: Create useFetch Composable

Create `src/composables/useFetch.js`:
- Generic async data fetching
- Loading, error, and data states
- Automatic request execution
- Manual refetch function

### Step 2: Create useAsync Composable

Create `src/composables/useAsync.js`:
- Execute any async function
- Track loading and error states
- Support retry logic
- Cancellation support

### Step 3: Implement Parallel Requests

Create a component that fetches:
- Weather data for multiple cities
- Country information
- User data
Use `Promise.all` to fetch concurrently

### Step 4: Implement Sequential Requests

Create dependent async calls:
- Fetch user ID
- Then fetch user details using that ID
- Then fetch user's posts
- Show loading state for each step

### Step 5: Create Retry Logic

Implement automatic retry with exponential backoff:
- Retry failed requests
- Increasing delay between retries
- Maximum retry attempts
- Show retry count to user

### Step 6: Implement Request Cancellation

Use AbortController to:
- Cancel pending requests
- Cancel on component unmount
- Cancel on new search query

### Step 7: Create useDebounce Composable

Implement debouncing for:
- Search inputs
- API calls
- User input handling

### Step 8: Advanced Error Handling

Create comprehensive error handling:
- Network errors
- Timeout errors
- HTTP errors (404, 500, etc.)
- Custom error messages
- Error recovery strategies

### Step 9: Implement Promise.race

Use Promise.race for:
- Request timeout
- Fastest API wins scenario
- Loading timeout (show message after X seconds)

### Step 10: Create Loading Indicators

Different loading states:
- Initial loading
- Refreshing data
- Background sync
- Skeleton screens

## 💻 Code Structure

### composables/useFetch.js
```javascript
import { ref, unref, watchEffect } from 'vue'

export function useFetch(url, options = {}) {
  const data = ref(null)
  const error = ref(null)
  const isLoading = ref(false)
  const abortController = ref(null)

  async function execute() {
    isLoading.value = true
    error.value = null
    
    // Cancel previous request if exists
    if (abortController.value) {
      abortController.value.abort()
    }
    
    abortController.value = new AbortController()

    try {
      const response = await fetch(unref(url), {
        ...options,
        signal: abortController.value.signal
      })

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`)
      }

      data.value = await response.json()
    } catch (e) {
      if (e.name !== 'AbortError') {
        error.value = e.message
      }
    } finally {
      isLoading.value = false
    }
  }

  // Auto-execute on mount if immediate is true
  if (options.immediate !== false) {
    execute()
  }

  // Re-execute when URL changes
  if (options.watch !== false) {
    watchEffect(() => {
      if (unref(url)) {
        execute()
      }
    })
  }

  function cancel() {
    if (abortController.value) {
      abortController.value.abort()
    }
  }

  return {
    data,
    error,
    isLoading,
    execute,
    cancel
  }
}
```

### composables/useAsync.js
```javascript
import { ref } from 'vue'

export function useAsync(asyncFunction, options = {}) {
  const data = ref(null)
  const error = ref(null)
  const isLoading = ref(false)
  const retryCount = ref(0)

  const {
    maxRetries = 3,
    retryDelay = 1000,
    onError = null,
    onSuccess = null
  } = options

  async function execute(...args) {
    isLoading.value = true
    error.value = null
    retryCount.value = 0

    return executeWithRetry(args)
  }

  async function executeWithRetry(args, attempt = 0) {
    try {
      const result = await asyncFunction(...args)
      data.value = result
      isLoading.value = false
      
      if (onSuccess) {
        onSuccess(result)
      }
      
      return result
    } catch (e) {
      if (attempt < maxRetries) {
        retryCount.value = attempt + 1
        const delay = retryDelay * Math.pow(2, attempt) // Exponential backoff
        
        console.log(`Retry ${retryCount.value}/${maxRetries} after ${delay}ms`)
        
        await new Promise(resolve => setTimeout(resolve, delay))
        return executeWithRetry(args, attempt + 1)
      } else {
        error.value = e.message
        isLoading.value = false
        
        if (onError) {
          onError(e)
        }
        
        throw e
      }
    }
  }

  async function retry() {
    return execute()
  }

  return {
    data,
    error,
    isLoading,
    retryCount,
    execute,
    retry
  }
}
```

### composables/useDebounce.js
```javascript
import { ref, watch } from 'vue'

export function useDebounce(value, delay = 500) {
  const debouncedValue = ref(value.value)
  let timeout

  watch(value, (newValue) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      debouncedValue.value = newValue
    }, delay)
  })

  return debouncedValue
}
```

### services/weatherService.js
```javascript
const API_KEY = 'your_api_key_here' // Get from openweathermap.org
const BASE_URL = 'https://api.openweathermap.org/data/2.5'

export const weatherService = {
  async getCurrentWeather(city) {
    const response = await fetch(
      `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`
    )
    
    if (!response.ok) {
      throw new Error(`Weather data not found for ${city}`)
    }
    
    return response.json()
  },

  async getMultipleCities(cities) {
    // Fetch weather for multiple cities in parallel
    const promises = cities.map(city => this.getCurrentWeather(city))
    return Promise.all(promises)
  },

  async getForecast(city) {
    const response = await fetch(
      `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`
    )
    
    if (!response.ok) {
      throw new Error(`Forecast not found for ${city}`)
    }
    
    return response.json()
  }
}
```

### components/WeatherDashboard.vue
```vue
<template>
  <div class="weather-dashboard">
    <h1>Weather Dashboard</h1>

    <!-- Search Input with Debounce -->
    <div class="search-section">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search city..."
        class="search-input"
      >
      <p class="hint">Try: London, Paris, Tokyo</p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading">
      <div class="spinner"></div>
      <p>Loading weather data...</p>
      <p v-if="retryCount > 0" class="retry-info">
        Retry attempt {{ retryCount }}/{{ maxRetries }}
      </p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="fetchWeather" class="retry-btn">Retry</button>
    </div>

    <!-- Weather Data -->
    <div v-else-if="weatherData" class="weather-info">
      <h2>{{ weatherData.name }}, {{ weatherData.sys.country }}</h2>
      <div class="weather-main">
        <img
          :src="`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`"
          :alt="weatherData.weather[0].description"
        >
        <div>
          <p class="temperature">{{ Math.round(weatherData.main.temp) }}°C</p>
          <p class="description">{{ weatherData.weather[0].description }}</p>
        </div>
      </div>
      <div class="weather-details">
        <div class="detail">
          <span class="label">Feels like:</span>
          <span>{{ Math.round(weatherData.main.feels_like) }}°C</span>
        </div>
        <div class="detail">
          <span class="label">Humidity:</span>
          <span>{{ weatherData.main.humidity }}%</span>
        </div>
        <div class="detail">
          <span class="label">Wind:</span>
          <span>{{ weatherData.wind.speed }} m/s</span>
        </div>
      </div>
    </div>

    <!-- Multiple Cities Section -->
    <div class="multiple-cities">
      <h2>Compare Cities</h2>
      <button @click="fetchMultipleCities" :disabled="isLoadingMultiple">
        {{ isLoadingMultiple ? 'Loading...' : 'Load Multiple Cities' }}
      </button>

      <div v-if="multipleCitiesData.length" class="cities-grid">
        <div
          v-for="city in multipleCitiesData"
          :key="city.id"
          class="city-card"
        >
          <h3>{{ city.name }}</h3>
          <p class="temp">{{ Math.round(city.main.temp) }}°C</p>
          <p>{{ city.weather[0].description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useDebounce } from '../composables/useDebounce'
import { useAsync } from '../composables/useAsync'
import { weatherService } from '../services/weatherService'

const searchQuery = ref('London')
const debouncedSearch = useDebounce(searchQuery, 800)

const weatherData = ref(null)
const error = ref(null)
const isLoading = ref(false)
const retryCount = ref(0)
const maxRetries = 3

const multipleCitiesData = ref([])
const isLoadingMultiple = ref(false)

// Watch debounced search and fetch weather
watch(debouncedSearch, async (newCity) => {
  if (newCity) {
    await fetchWeather()
  }
})

async function fetchWeather() {
  isLoading.value = true
  error.value = null
  retryCount.value = 0

  try {
    weatherData.value = await fetchWithRetry(
      () => weatherService.getCurrentWeather(debouncedSearch.value)
    )
  } catch (e) {
    error.value = e.message
  } finally {
    isLoading.value = false
  }
}

async function fetchWithRetry(asyncFn, attempt = 0) {
  try {
    return await asyncFn()
  } catch (e) {
    if (attempt < maxRetries) {
      retryCount.value = attempt + 1
      const delay = 1000 * Math.pow(2, attempt) // Exponential backoff
      
      await new Promise(resolve => setTimeout(resolve, delay))
      return fetchWithRetry(asyncFn, attempt + 1)
    }
    throw e
  }
}

async function fetchMultipleCities() {
  isLoadingMultiple.value = true
  
  try {
    const cities = ['London', 'Paris', 'Tokyo', 'New York']
    multipleCitiesData.value = await weatherService.getMultipleCities(cities)
  } catch (e) {
    console.error('Failed to fetch multiple cities:', e)
  } finally {
    isLoadingMultiple.value = false
  }
}

// Initial fetch
fetchWeather()
</script>

<style scoped>
.weather-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.search-section {
  margin-bottom: 30px;
}

.search-input {
  width: 100%;
  max-width: 400px;
  padding: 12px;
  font-size: 16px;
  border: 2px solid #ddd;
  border-radius: 8px;
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

.weather-info {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px;
  border-radius: 16px;
  margin-bottom: 30px;
}

.weather-main {
  display: flex;
  align-items: center;
  gap: 20px;
  margin: 20px 0;
}

.temperature {
  font-size: 48px;
  font-weight: bold;
  margin: 0;
}

.weather-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-top: 20px;
}

.cities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.city-card {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.city-card .temp {
  font-size: 32px;
  font-weight: bold;
  color: #42b883;
  margin: 10px 0;
}
</style>
```

### components/AdvancedAsyncDemo.vue
```vue
<template>
  <div class="async-demo">
    <h1>Advanced Async Patterns</h1>

    <!-- Promise.all Demo -->
    <section class="demo-section">
      <h2>1. Parallel Requests (Promise.all)</h2>
      <button @click="runParallelRequests" :disabled="loading.parallel">
        {{ loading.parallel ? 'Loading...' : 'Fetch 3 Posts in Parallel' }}
      </button>
      <p v-if="results.parallel" class="result">
        Loaded {{ results.parallel.length }} posts in {{ timing.parallel }}ms
      </p>
    </section>

    <!-- Sequential Requests Demo -->
    <section class="demo-section">
      <h2>2. Sequential Requests</h2>
      <button @click="runSequentialRequests" :disabled="loading.sequential">
        {{ loading.sequential ? 'Loading...' : 'Fetch Posts Sequentially' }}
      </button>
      <p v-if="results.sequential" class="result">
        Loaded {{ results.sequential.length }} posts in {{ timing.sequential }}ms
      </p>
    </section>

    <!-- Promise.race Demo -->
    <section class="demo-section">
      <h2>3. Race Condition (Promise.race)</h2>
      <button @click="runRaceCondition" :disabled="loading.race">
        {{ loading.race ? 'Racing...' : 'Race Multiple APIs' }}
      </button>
      <p v-if="results.race" class="result">
        Fastest response: {{ results.race.source }} ({{ timing.race }}ms)
      </p>
    </section>

    <!-- Promise.allSettled Demo -->
    <section class="demo-section">
      <h2>4. All Settled (Handle Failures)</h2>
      <button @click="runAllSettled" :disabled="loading.allSettled">
        {{ loading.allSettled ? 'Loading...' : 'Fetch with Some Failures' }}
      </button>
      <div v-if="results.allSettled" class="result">
        <p>Successful: {{ results.allSettled.successful }}</p>
        <p>Failed: {{ results.allSettled.failed }}</p>
      </div>
    </section>

    <!-- Timeout Demo -->
    <section class="demo-section">
      <h2>5. Request with Timeout</h2>
      <button @click="runWithTimeout" :disabled="loading.timeout">
        {{ loading.timeout ? 'Loading...' : 'Fetch with 2s Timeout' }}
      </button>
      <p v-if="results.timeout" class="result">{{ results.timeout }}</p>
      <p v-if="errors.timeout" class="error">{{ errors.timeout }}</p>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const loading = reactive({
  parallel: false,
  sequential: false,
  race: false,
  allSettled: false,
  timeout: false
})

const results = reactive({
  parallel: null,
  sequential: null,
  race: null,
  allSettled: null,
  timeout: null
})

const timing = reactive({
  parallel: 0,
  sequential: 0,
  race: 0
})

const errors = reactive({
  timeout: null
})

async function runParallelRequests() {
  loading.parallel = true
  const start = Date.now()
  
  try {
    const promises = [
      fetch('https://jsonplaceholder.typicode.com/posts/1'),
      fetch('https://jsonplaceholder.typicode.com/posts/2'),
      fetch('https://jsonplaceholder.typicode.com/posts/3')
    ]
    
    const responses = await Promise.all(promises)
    results.parallel = await Promise.all(responses.map(r => r.json()))
    timing.parallel = Date.now() - start
  } finally {
    loading.parallel = false
  }
}

async function runSequentialRequests() {
  loading.sequential = true
  const start = Date.now()
  
  try {
    const posts = []
    
    for (let i = 1; i <= 3; i++) {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${i}`)
      const post = await response.json()
      posts.push(post)
    }
    
    results.sequential = posts
    timing.sequential = Date.now() - start
  } finally {
    loading.sequential = false
  }
}

async function runRaceCondition() {
  loading.race = true
  const start = Date.now()
  
  try {
    const promises = [
      fetch('https://jsonplaceholder.typicode.com/posts/1').then(r => ({ source: 'JSONPlaceholder', data: r })),
      fetch('https://restcountries.com/v3.1/name/france').then(r => ({ source: 'REST Countries', data: r })),
      new Promise(resolve => setTimeout(() => resolve({ source: 'Timeout', data: null }), 3000))
    ]
    
    results.race = await Promise.race(promises)
    timing.race = Date.now() - start
  } finally {
    loading.race = false
  }
}

async function runAllSettled() {
  loading.allSettled = true
  
  try {
    const promises = [
      fetch('https://jsonplaceholder.typicode.com/posts/1'),
      fetch('https://jsonplaceholder.typicode.com/invalid-endpoint'), // Will fail
      fetch('https://jsonplaceholder.typicode.com/posts/2')
    ]
    
    const settled = await Promise.allSettled(promises)
    
    results.allSettled = {
      successful: settled.filter(r => r.status === 'fulfilled').length,
      failed: settled.filter(r => r.status === 'rejected').length
    }
  } finally {
    loading.allSettled = false
  }
}

async function runWithTimeout() {
  loading.timeout = true
  errors.timeout = null
  
  try {
    const fetchPromise = fetch('https://jsonplaceholder.typicode.com/posts/1')
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), 2000)
    )
    
    const response = await Promise.race([fetchPromise, timeoutPromise])
    const data = await response.json()
    results.timeout = `Success! Post title: ${data.title}`
  } catch (e) {
    errors.timeout = e.message
  } finally {
    loading.timeout = false
  }
}
</script>

<style scoped>
.async-demo {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.demo-section {
  background: #f5f5f5;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
}

.demo-section button {
  padding: 10px 20px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.demo-section button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.result {
  margin-top: 10px;
  padding: 10px;
  background: #e8f5e9;
  border-radius: 4px;
}

.error {
  margin-top: 10px;
  padding: 10px;
  background: #ffebee;
  color: #c62828;
  border-radius: 4px;
}
</style>
```

## ✅ Expected Outcome

Your application should:

1. **Fetch weather data** with debounced search
2. **Show loading states** with spinner
3. **Retry failed requests** with exponential backoff
4. **Fetch multiple cities** in parallel
5. **Demonstrate Promise.all** vs sequential
6. **Use Promise.race** for timeouts
7. **Handle partial failures** with Promise.allSettled
8. **Cancel pending requests** on new search
9. **Display retry attempts** to user
10. **Handle all error scenarios** gracefully

## 🧪 Testing Checklist

- [ ] Search updates with debounce
- [ ] Loading spinner appears
- [ ] Retry logic works on failure
- [ ] Multiple cities load in parallel
- [ ] Sequential vs parallel timing difference
- [ ] Timeout cancels slow requests
- [ ] Request cancellation on unmount
- [ ] Error messages display correctly
- [ ] All settled handles partial failures
- [ ] Check Network tab for request patterns

## 🎓 Key Concepts

### Async/Await Basics
```javascript
async function fetchData() {
  try {
    const response = await fetch(url)
    const data = await response.json()
    return data
  } catch (error) {
    console.error(error)
  }
}
```

### Promise.all (Parallel)
```javascript
const [users, posts, comments] = await Promise.all([
  fetchUsers(),
  fetchPosts(),
  fetchComments()
])
```

### Promise.race
```javascript
const result = await Promise.race([
  fetchData(),
  timeout(5000)
])
```

### Promise.allSettled
```javascript
const results = await Promise.allSettled([
  promise1,
  promise2,
  promise3
])
// All promises complete, even if some fail
```

## 🚀 Bonus Challenges

1. **Request Queue**: Implement request queuing
2. **Offline Support**: Detect offline and queue requests
3. **WebSockets**: Integrate real-time data
4. **Service Worker**: Cache API responses
5. **Request Deduplication**: Prevent duplicate requests
6. **Progress Tracking**: Show upload/download progress
7. **GraphQL**: Implement with GraphQL instead of REST

## 📚 Resources

- [Async/Await MDN](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await)
- [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)
- [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
- [Vue Composition API](https://vuejs.org/guide/reusability/composables.html)

## 🤔 Reflection Questions

1. When to use Promise.all vs Promise.allSettled?
2. How does exponential backoff improve reliability?
3. Why debounce API calls from search inputs?
4. What are the tradeoffs of parallel vs sequential requests?
5. How does AbortController prevent memory leaks?

## 💡 Common Mistakes

- Not handling promise rejections
- Forgetting await keyword
- Not canceling requests on unmount
- Using sequential when parallel would work
- Not implementing loading states
- Ignoring network errors

## 🎯 Success Criteria

✅ Reusable async composables created  
✅ Debouncing implemented correctly  
✅ Retry logic with exponential backoff works  
✅ Parallel requests with Promise.all  
✅ Request cancellation functional  
✅ All async patterns demonstrated  
✅ Error handling comprehensive

---

**Previous**: [Exercise 11: API with Fetch](../ex11-api-fetch/)  
**Next**: [Exercise 13: Mini Project Dashboard](../../05-mini-project/ex13-mini-project-dashboard/)

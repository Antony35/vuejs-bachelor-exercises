# Exercise 07: Emit Events

**Difficulty**: ⭐⭐⭐ Intermediate  
**Time**: 2-3 hours  
**Concepts**: Custom events, $emit, event handling, parent-child communication, v-model on components

## 🎯 Learning Objectives

- Emit custom events from child to parent components
- Pass data with emitted events
- Handle events in parent components
- Implement two-way binding with v-model on custom components
- Validate emitted events
- Understand component communication patterns

## 📋 Exercise Description

Create an interactive task management application where child components emit events to communicate with their parent. Implement adding, editing, deleting, and filtering tasks using custom events.

## 🛠️ Setup

```bash
npm create vue@latest ex07-emit-events
cd ex07-emit-events
npm install
npm run dev
```

## 📝 Step-by-Step Instructions

### Step 1: Create TaskItem Component

Create `TaskItem.vue` that:
- Receives a task object as prop
- Displays task title and status
- Has a "Complete" button that emits a `complete` event
- Has a "Delete" button that emits a `delete` event
- Has an "Edit" button that emits an `edit` event

### Step 2: Handle Events in Parent

In `App.vue`:
- Create an array of tasks
- Listen to events from `TaskItem`
- Implement handlers for complete, delete, and edit events
- Update the tasks array based on emitted events

### Step 3: Create AddTask Component

Create `AddTask.vue` that:
- Has an input field for task title
- Has a form that emits an `add-task` event with the task data
- Clears the input after emitting
- Validates that title is not empty

### Step 4: Create SearchFilter Component

Create `SearchFilter.vue` that:
- Has an input for search query
- Emits `update:search` event on input
- Implements v-model pattern for two-way binding

### Step 5: Implement Custom v-model

Make `SearchFilter` work with `v-model`:
- Accept `modelValue` prop
- Emit `update:modelValue` event
- Use it in parent with `v-model="searchQuery"`

### Step 6: Create StatusFilter Component

Create `StatusFilter.vue` that:
- Has buttons/select for: All, Active, Completed
- Emits `filter-change` event with selected filter
- Highlights the active filter

### Step 7: Pass Event Data

Enhance event emissions to include:
- Task ID with events
- Updated task data
- Timestamps
- Any relevant metadata

### Step 8: Add Event Validation

Define and validate emitted events:
- Declare events in `defineEmits`
- Add validation for event payloads
- Handle validation errors gracefully

## 💻 Code Structure

### TaskItem.vue
```vue
<template>
  <div class="task-item" :class="{ completed: task.completed }">
    <div class="task-content">
      <h3>{{ task.title }}</h3>
      <p class="task-description">{{ task.description }}</p>
      <span class="task-date">{{ task.createdAt }}</span>
    </div>
    
    <div class="task-actions">
      <button 
        @click="$emit('toggle-complete', task.id)"
        :class="{ active: task.completed }"
      >
        {{ task.completed ? 'Undo' : 'Complete' }}
      </button>
      
      <button @click="$emit('edit', task.id)">
        Edit
      </button>
      
      <button @click="handleDelete" class="danger">
        Delete
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})

const emit = defineEmits({
  'toggle-complete': (id) => {
    return typeof id === 'number'
  },
  'edit': (id) => {
    return typeof id === 'number'
  },
  'delete': (id) => {
    return typeof id === 'number'
  }
})

function handleDelete() {
  if (confirm('Are you sure you want to delete this task?')) {
    emit('delete', props.task.id)
  }
}
</script>

<style scoped>
.completed {
  opacity: 0.6;
  text-decoration: line-through;
}
</style>
```

### AddTask.vue
```vue
<template>
  <form @submit.prevent="handleSubmit" class="add-task-form">
    <input
      v-model="title"
      type="text"
      placeholder="Task title"
      class="task-input"
    >
    
    <textarea
      v-model="description"
      placeholder="Description (optional)"
      class="task-textarea"
    ></textarea>
    
    <button type="submit" :disabled="!title.trim()">
      Add Task
    </button>
    
    <p v-if="error" class="error">{{ error }}</p>
  </form>
</template>

<script setup>
import { ref } from 'vue'

const title = ref('')
const description = ref('')
const error = ref('')

const emit = defineEmits(['add-task'])

function handleSubmit() {
  if (!title.value.trim()) {
    error.value = 'Title is required'
    return
  }
  
  const newTask = {
    id: Date.now(),
    title: title.value,
    description: description.value,
    completed: false,
    createdAt: new Date().toISOString()
  }
  
  emit('add-task', newTask)
  
  // Clear form
  title.value = ''
  description.value = ''
  error.value = ''
}
</script>
```

### SearchFilter.vue (with v-model)
```vue
<template>
  <div class="search-filter">
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      type="text"
      placeholder="Search tasks..."
      class="search-input"
    >
    <button v-if="modelValue" @click="$emit('update:modelValue', '')">
      Clear
    </button>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

defineEmits(['update:modelValue'])
</script>
```

### App.vue
```vue
<template>
  <div class="app">
    <header>
      <h1>Task Manager</h1>
    </header>
    
    <main>
      <AddTask @add-task="addTask" />
      
      <div class="filters">
        <SearchFilter v-model="searchQuery" />
        <StatusFilter @filter-change="handleFilterChange" />
      </div>
      
      <div class="task-stats">
        <p>Total: {{ tasks.length }}</p>
        <p>Active: {{ activeTasks }}</p>
        <p>Completed: {{ completedTasks }}</p>
      </div>
      
      <div class="task-list">
        <TaskItem
          v-for="task in filteredTasks"
          :key="task.id"
          :task="task"
          @toggle-complete="toggleComplete"
          @edit="editTask"
          @delete="deleteTask"
        />
        
        <p v-if="filteredTasks.length === 0" class="empty-state">
          No tasks found
        </p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import TaskItem from './components/TaskItem.vue'
import AddTask from './components/AddTask.vue'
import SearchFilter from './components/SearchFilter.vue'
import StatusFilter from './components/StatusFilter.vue'

const tasks = ref([
  {
    id: 1,
    title: 'Learn Vue.js Components',
    description: 'Master component basics',
    completed: false,
    createdAt: '2026-01-20'
  },
  {
    id: 2,
    title: 'Understand Props',
    description: 'Learn how to pass data to components',
    completed: true,
    createdAt: '2026-01-21'
  }
])

const searchQuery = ref('')
const currentFilter = ref('all') // 'all', 'active', 'completed'

// Event Handlers
function addTask(task) {
  tasks.value.unshift(task)
}

function toggleComplete(taskId) {
  const task = tasks.value.find(t => t.id === taskId)
  if (task) {
    task.completed = !task.completed
  }
}

function editTask(taskId) {
  // Implement edit functionality
  const task = tasks.value.find(t => t.id === taskId)
  const newTitle = prompt('Edit task:', task.title)
  if (newTitle) {
    task.title = newTitle
  }
}

function deleteTask(taskId) {
  tasks.value = tasks.value.filter(t => t.id !== taskId)
}

function handleFilterChange(filter) {
  currentFilter.value = filter
}

// Computed Properties
const filteredTasks = computed(() => {
  let result = tasks.value
  
  // Apply search filter
  if (searchQuery.value) {
    result = result.filter(task =>
      task.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  
  // Apply status filter
  if (currentFilter.value === 'active') {
    result = result.filter(task => !task.completed)
  } else if (currentFilter.value === 'completed') {
    result = result.filter(task => task.completed)
  }
  
  return result
})

const activeTasks = computed(() => 
  tasks.value.filter(t => !t.completed).length
)

const completedTasks = computed(() => 
  tasks.value.filter(t => t.completed).length
)
</script>

<style scoped>
.task-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}
</style>
```

### StatusFilter.vue
```vue
<template>
  <div class="status-filter">
    <button
      v-for="filter in filters"
      :key="filter.value"
      @click="$emit('filter-change', filter.value)"
      :class="{ active: currentFilter === filter.value }"
    >
      {{ filter.label }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const filters = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' }
]

const currentFilter = ref('all')

defineEmits(['filter-change'])
</script>
```

## ✅ Expected Outcome

Your application should:

1. **Add tasks** through the AddTask component
2. **Toggle task completion** by clicking Complete button
3. **Delete tasks** with confirmation dialog
4. **Edit tasks** using prompt (or custom modal)
5. **Search tasks** with real-time filtering
6. **Filter by status** (All/Active/Completed)
7. **Show task statistics** (total, active, completed)
8. **Clear search** with clear button
9. **Validate** empty task titles
10. **Update UI** reactively when events are emitted

## 🧪 Testing Checklist

- [ ] Add a new task and verify it appears
- [ ] Mark tasks as complete/incomplete
- [ ] Delete a task (confirm dialog works)
- [ ] Edit a task title
- [ ] Search for tasks by title/description
- [ ] Filter by All, Active, Completed
- [ ] Check statistics update correctly
- [ ] Try submitting empty task (should be prevented)
- [ ] Clear search and verify all tasks show
- [ ] Check console for any errors

## 🎓 Key Concepts

### Emitting Events
```javascript
// Define emits
const emit = defineEmits(['event-name'])

// Emit simple event
emit('event-name')

// Emit with data
emit('event-name', payload)

// With validation
const emit = defineEmits({
  'event-name': (payload) => {
    return typeof payload === 'string'
  }
})
```

### Listening to Events
```vue
<ChildComponent @event-name="handleEvent" />

<ChildComponent @event-name="(payload) => handleEvent(payload)" />
```

### Custom v-model
```javascript
// Child component
defineProps(['modelValue'])
defineEmits(['update:modelValue'])

// Template
<input :value="modelValue" @input="$emit('update:modelValue', $event.target.value)">

// Parent usage
<ChildComponent v-model="value" />
```

## 🚀 Bonus Challenges

1. **Drag and Drop**: Emit events for reordering tasks
2. **Bulk Actions**: Select multiple tasks and emit batch operations
3. **Task Priority**: Add priority levels and emit priority change events
4. **Due Dates**: Add due dates and emit reminder events
5. **Categories**: Add categories and emit category change events
6. **Export**: Emit event to export tasks as JSON
7. **Undo/Redo**: Implement with event history

## 📚 Resources

- [Component Events](https://vuejs.org/guide/components/events.html)
- [Event Validation](https://vuejs.org/guide/components/events.html#events-validation)
- [v-model on Components](https://vuejs.org/guide/components/v-model.html)

## 🤔 Reflection Questions

1. Why use custom events instead of directly modifying parent data?
2. What's the difference between props and events?
3. How does `v-model` work on custom components?
4. When should you validate emitted events?
5. What are the naming conventions for events in Vue?

## 💡 Common Mistakes to Avoid

- Using camelCase for event names (use kebab-case)
- Mutating props instead of emitting events
- Forgetting to declare emits in `defineEmits`
- Not passing necessary data with events
- Over-emitting (emitting on every keystroke unnecessarily)

## 🎯 Success Criteria

You've successfully completed this exercise when:
- ✅ Child components emit custom events
- ✅ Parent handles all emitted events correctly
- ✅ Data flows up through events
- ✅ v-model works on custom SearchFilter
- ✅ Events are validated properly
- ✅ UI updates reactively to event handling
- ✅ No direct prop mutations occur

---

**Previous**: [Exercise 06: Props](../ex06-props/)  
**Next**: [Exercise 08: Slots](../ex08-slots/)

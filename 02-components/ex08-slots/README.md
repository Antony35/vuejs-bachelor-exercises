# Exercise 08: Slots

**Difficulty**: ⭐⭐⭐ Intermediate  
**Time**: 2-3 hours  
**Concepts**: Slots, named slots, scoped slots, slot props, fallback content

## 🎯 Learning Objectives

- Understand and use default slots
- Implement named slots for multiple content areas
- Use scoped slots to pass data to slot content
- Provide fallback content for empty slots
- Create flexible, reusable components with slots
- Combine slots with props and events

## 📋 Exercise Description

Create a component library with reusable components that use slots for maximum flexibility. Build cards, modals, tabs, and other UI components that can accept custom content through slots.

## 🛠️ Setup

```bash
npm create vue@latest ex08-slots
cd ex08-slots
npm install
npm run dev
```

## 📝 Step-by-Step Instructions

### Step 1: Create BaseCard with Default Slot

Create `BaseCard.vue` that:
- Accepts content through default slot
- Has a border and padding
- Provides fallback content if slot is empty
- Can be used to wrap any content

### Step 2: Create Card with Named Slots

Create `Card.vue` that has named slots for:
- `header`: Card header content
- `default`: Main card content  
- `footer`: Card footer content
- Each slot should have optional fallback content

### Step 3: Create Modal Component

Create `Modal.vue` with:
- Named slots for: title, content, footer
- Overlay and centered modal box
- Close button that emits event
- Conditional rendering based on `isOpen` prop

### Step 4: Create Tabs Component

Create a tabs interface with:
- `TabContainer.vue`: Wrapper component
- `TabItem.vue`: Individual tab
- Use slots to define tab content
- Support named slots for tab labels

### Step 5: Implement Scoped Slots

Create `UserList.vue` that:
- Receives array of users as prop
- Uses scoped slot to let parent decide how to render each user
- Passes user data to the slot
- Provides default rendering as fallback

### Step 6: Create Alert Component

Create `Alert.vue` with:
- Named slot for icon
- Default slot for message
- Named slot for action buttons
- Different styles based on `type` prop (success, error, warning, info)

### Step 7: Build a Table Component

Create `DataTable.vue` with:
- Scoped slot for custom column rendering
- Receives data array as prop
- Passes row data to slot
- Named slots for header and footer

### Step 8: Create Layout Component

Create `PageLayout.vue` with named slots:
- `sidebar`: Left/right sidebar
- `header`: Page header
- `default`: Main content area
- `footer`: Page footer

## 💻 Code Structure

### BaseCard.vue (Default Slot)
```vue
<template>
  <div class="base-card">
    <slot>
      <!-- Fallback content -->
      <p class="empty">No content provided</p>
    </slot>
  </div>
</template>

<style scoped>
.base-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin: 10px 0;
}
</style>
```

### Card.vue (Named Slots)
```vue
<template>
  <div class="card">
    <header v-if="$slots.header" class="card-header">
      <slot name="header">
        <!-- Fallback header -->
        <h3>Card Title</h3>
      </slot>
    </header>
    
    <div class="card-body">
      <slot>
        <!-- Default slot fallback -->
        <p>Card content goes here</p>
      </slot>
    </div>
    
    <footer v-if="$slots.footer" class="card-footer">
      <slot name="footer">
        <!-- Fallback footer -->
      </slot>
    </footer>
  </div>
</template>

<script setup>
</script>

<style scoped>
.card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.card-header {
  background-color: #f5f5f5;
  padding: 15px 20px;
  border-bottom: 1px solid #e0e0e0;
}

.card-body {
  padding: 20px;
}

.card-footer {
  background-color: #f5f5f5;
  padding: 15px 20px;
  border-top: 1px solid #e0e0e0;
}
</style>
```

### UserList.vue (Scoped Slots)
```vue
<template>
  <div class="user-list">
    <div
      v-for="user in users"
      :key="user.id"
      class="user-item"
    >
      <!-- Scoped slot - pass user data to parent -->
      <slot :user="user" :index="users.indexOf(user)">
        <!-- Fallback rendering -->
        <div class="default-user">
          <img :src="user.avatar" :alt="user.name">
          <div>
            <h4>{{ user.name }}</h4>
            <p>{{ user.email }}</p>
          </div>
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  users: {
    type: Array,
    required: true
  }
})
</script>

<style scoped>
.user-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
```

### Modal.vue
```vue
<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click="$emit('close')">
        <div class="modal-container" @click.stop>
          <div class="modal-header">
            <slot name="title">
              <h2>Modal Title</h2>
            </slot>
            <button @click="$emit('close')" class="close-btn">×</button>
          </div>
          
          <div class="modal-body">
            <slot>
              <p>Modal content</p>
            </slot>
          </div>
          
          <div class="modal-footer" v-if="$slots.footer">
            <slot name="footer">
              <button @click="$emit('close')">Close</button>
            </slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

defineEmits(['close'])
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background: white;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow: auto;
}

.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}
</style>
```

### DataTable.vue (Scoped Slots for Columns)
```vue
<template>
  <table class="data-table">
    <thead>
      <tr>
        <th v-for="column in columns" :key="column">
          <slot :name="`header-${column}`" :column="column">
            {{ column }}
          </slot>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, index) in data" :key="index">
        <td v-for="column in columns" :key="column">
          <slot :name="`cell-${column}`" :row="row" :column="column" :value="row[column]">
            {{ row[column] }}
          </slot>
        </td>
      </tr>
    </tbody>
    <tfoot v-if="$slots.footer">
      <slot name="footer"></slot>
    </tfoot>
  </table>
</template>

<script setup>
defineProps({
  data: {
    type: Array,
    required: true
  },
  columns: {
    type: Array,
    required: true
  }
})
</script>

<style scoped>
.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.data-table thead {
  background-color: #f5f5f5;
}
</style>
```

### App.vue (Using All Components)
```vue
<template>
  <div class="app">
    <h1>Slots Demo</h1>
    
    <!-- Basic Card with Default Slot -->
    <BaseCard>
      <p>This is custom content in the card!</p>
    </BaseCard>
    
    <!-- Card with Named Slots -->
    <Card>
      <template #header>
        <h2>My Custom Header</h2>
      </template>
      
      <p>This is the main content of the card.</p>
      <p>It can contain multiple elements.</p>
      
      <template #footer>
        <button>Action</button>
        <button>Cancel</button>
      </template>
    </Card>
    
    <!-- UserList with Scoped Slot -->
    <UserList :users="users">
      <template #default="{ user, index }">
        <div class="custom-user">
          <span class="index">{{ index + 1 }}.</span>
          <img :src="user.avatar" :alt="user.name" />
          <div>
            <strong>{{ user.name }}</strong>
            <p>{{ user.role }}</p>
          </div>
        </div>
      </template>
    </UserList>
    
    <!-- Modal -->
    <button @click="modalOpen = true">Open Modal</button>
    <Modal :is-open="modalOpen" @close="modalOpen = false">
      <template #title>
        <h2>Confirm Action</h2>
      </template>
      
      <p>Are you sure you want to proceed?</p>
      
      <template #footer>
        <button @click="modalOpen = false">Cancel</button>
        <button @click="confirmAction">Confirm</button>
      </template>
    </Modal>
    
    <!-- DataTable with Scoped Slots -->
    <DataTable :data="tableData" :columns="['name', 'email', 'status', 'actions']">
      <template #cell-status="{ value }">
        <span :class="`status-${value}`">{{ value }}</span>
      </template>
      
      <template #cell-actions="{ row }">
        <button @click="editUser(row)">Edit</button>
        <button @click="deleteUser(row)">Delete</button>
      </template>
    </DataTable>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BaseCard from './components/BaseCard.vue'
import Card from './components/Card.vue'
import UserList from './components/UserList.vue'
import Modal from './components/Modal.vue'
import DataTable from './components/DataTable.vue'

const modalOpen = ref(false)

const users = ref([
  { id: 1, name: 'John Doe', email: 'john@example.com', avatar: 'https://i.pravatar.cc/150?img=1', role: 'Developer' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', avatar: 'https://i.pravatar.cc/150?img=2', role: 'Designer' }
])

const tableData = ref([
  { name: 'Alice', email: 'alice@example.com', status: 'active' },
  { name: 'Bob', email: 'bob@example.com', status: 'inactive' },
  { name: 'Charlie', email: 'charlie@example.com', status: 'active' }
])

function confirmAction() {
  alert('Action confirmed!')
  modalOpen.value = false
}

function editUser(user) {
  alert(`Editing: ${user.name}`)
}

function deleteUser(user) {
  alert(`Deleting: ${user.name}`)
}
</script>
```

## ✅ Expected Outcome

Your application should:

1. **Display cards** with custom header, body, and footer content
2. **Show modal** with custom title and content
3. **Render user list** with custom user card design via scoped slots
4. **Display table** with custom column rendering
5. **Provide fallback content** when slots are empty
6. **Handle multiple named slots** in single component
7. **Pass data** to parent through scoped slots
8. **Check slot existence** with `$slots`

## 🧪 Testing Checklist

- [ ] BaseCard shows fallback when no content provided
- [ ] Card displays all three slot areas (header, body, footer)
- [ ] Try Card without header/footer slots
- [ ] UserList with custom rendering works
- [ ] UserList without scoped slot shows default
- [ ] Modal opens and closes
- [ ] Modal shows custom title and footer
- [ ] DataTable renders custom cells
- [ ] All named slots render correctly

## 🎓 Key Concepts

### Default Slot
```vue
<!-- Component -->
<template>
  <div>
    <slot>Fallback content</slot>
  </div>
</template>

<!-- Usage -->
<MyComponent>Custom content</MyComponent>
```

### Named Slots
```vue
<!-- Component -->
<template>
  <div>
    <slot name="header"></slot>
    <slot></slot>
    <slot name="footer"></slot>
  </div>
</template>

<!-- Usage -->
<MyComponent>
  <template #header>Header</template>
  <p>Default slot</p>
  <template #footer>Footer</template>
</MyComponent>
```

### Scoped Slots
```vue
<!-- Component -->
<template>
  <slot :user="user" :index="index"></slot>
</template>

<!-- Usage -->
<MyComponent>
  <template #default="{ user, index }">
    {{ index }}: {{ user.name }}
  </template>
</MyComponent>
```

## 🚀 Bonus Challenges

1. **Accordion Component**: Use slots for accordion items
2. **Breadcrumb**: Dynamic breadcrumb with scoped slots
3. **Dropdown Menu**: Slots for trigger and menu items
4. **Tooltip**: Wrap content with tooltip slot
5. **Infinite Scroll List**: Scoped slots for item rendering
6. **Form Builder**: Slots for form fields and validation
7. **Notification System**: Slots for custom notification content

## 📚 Resources

- [Slots](https://vuejs.org/guide/components/slots.html)
- [Named Slots](https://vuejs.org/guide/components/slots.html#named-slots)
- [Scoped Slots](https://vuejs.org/guide/components/slots.html#scoped-slots)
- [Slot Fallback Content](https://vuejs.org/guide/components/slots.html#fallback-content)

## 🤔 Reflection Questions

1. When should you use slots vs props?
2. What's the difference between named slots and scoped slots?
3. How do scoped slots enable component flexibility?
4. When would you check for slot existence with `$slots`?
5. What are the benefits of providing fallback content?

## 💡 Common Mistakes to Avoid

- Forgetting `<template>` tags for named slots
- Not providing fallback content when it makes sense
- Using wrong syntax for scoped slots destructuring
- Passing too much logic in scoped slots (keep it simple)
- Not using ` #slotName` shorthand for cleaner templates

## 🎯 Success Criteria

You've successfully completed this exercise when:
- ✅ All components use slots effectively
- ✅ Named slots work for different content areas
- ✅ Scoped slots pass data correctly
- ✅ Fallback content displays appropriately
- ✅ Slot existence is checked where needed
- ✅ Components are flexible and reusable
- ✅ Modal, cards, and table all function properly

---

**Previous**: [Exercise 07: Emit Events](../ex07-emit-events/)  
**Next**: [Exercise 09: Vue Router](../../03-routing-state/ex09-vue-router/)

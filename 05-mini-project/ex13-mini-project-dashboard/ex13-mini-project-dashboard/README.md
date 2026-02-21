# Vue 3 Mini Project - Admin Dashboard

## Project Overview
This project is a simplified Admin Dashboard built with **Vue 3 (Composition API)**. It demonstrates core frontend concepts including authentication flow, state management, routing, and CRUD operations using a fake REST API.

## Features
- **Authentication**: Fake login system using Pinia to manage user state.
- **Protected Routes**: Users cannot access the Dashboard or Products page without logging in (Navigation Guards).
- **Product Management (CRUD)**:
  - **Read**: Fetches data from `fakestoreapi.com`.
  - **Create**: Adds new products to the local state (uses a local placeholder image for new items).
  - **Delete**: Removes products from the list.
- **Responsive Layout**: Sidebar navigation that toggles based on auth state.
- **Data Visualization**: Simple statistics on the dashboard.

## Technologies Used
- **Vue 3**: Composition API (`<script setup>`).
- **Vite**: Build tool.
- **Pinia**: State management (Stores for Auth and Products).
- **Vue Router**: Single Page Application routing.
- **CSS**: Custom scoped styles with transitions.

## Project Setup

```sh
npm install
```

### Run for Development
```sh
npm run dev
``` 

## Key Concepts Learned

### 1. State Management with Pinia 
I learned how to move logic out of components and into Stores. 
- auth.js: Manages isAuthenticated and user object.
- products.js: Handles fetch, add, and delete logic. This makes the components cleaner and allows data to be shared easily. 

### 2. Vue Router & Guards
I implemented router to check requiresAuth. If a user isn't logged in, they are redirected to /login. This secures the application.

### 3. Async Data & Reactivity
Using fetch inside Pinia actions allows the UI to update automatically. When products value changes in the store, the v-for loop in the view updates instantly without reloading the page. 

### 4. Component Architecture 
I separated the layout (Sidebar.vue) from the views (DashboardView.vue, ProductsView.vue). This makes the code reusable and easier to maintain. 

Student Project for Vue.js Bachelor Course

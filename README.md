# Vue.js Bachelor Exercises

Welcome to the Vue.js exercises repository! This collection of hands-on exercises will guide you through learning Vue.js from basics to building a complete mini-project.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Verification](#verification)
- [Exercise Structure](#exercise-structure)
- [Exercises](#exercises)
- [Getting Help](#getting-help)

## Prerequisites

Before starting, you'll need:
- A code editor (VS Code recommended)
- Basic knowledge of HTML, CSS, and JavaScript
- A GitHub account (to clone this repository)

## Installation

### Step 1: Install Node.js and NPM

1. **Download Node.js**: Visit [nodejs.org](https://nodejs.org/)
2. **Choose a version**: Download the LTS (Long Term Support) version
3. **Install**: Run the installer and follow the installation wizard
4. **Accept defaults**: Keep all default settings during installation

### Step 2: Verify Installation

Open a terminal (Command Prompt, PowerShell, or Terminal) and run:

```bash
node --version
```

You should see something like `v20.x.x` or higher.

Then check NPM:

```bash
npm --version
```

You should see something like `10.x.x` or higher.

### Step 3: Install Vue CLI (Optional but Recommended)

The Vue CLI helps create and manage Vue projects:

```bash
npm install -g @vue/cli
```

Verify Vue CLI installation:

```bash
vue --version
```

You should see something like `@vue/cli 5.x.x`.

### Step 4: Clone This Repository

```bash
git clone https://github.com/YOUR-USERNAME/vuejs-bachelor-exercises.git
cd vuejs-bachelor-exercises
```

### Step 5: Create Your First Vue App (Verification)

Navigate to any exercise folder and follow its README instructions. For a quick test:

```bash
cd 01-vue-basics/ex01-hello-vue
npm install
npm run dev
```

If you see a local development server running (usually at `http://localhost:5173`), you're ready to go! 🎉

## Verification

To ensure everything is properly installed, create a test Vue project:

```bash
npm create vue@latest test-project
```

When prompted:
- Project name: `test-project`
- TypeScript: No
- JSX: No
- Vue Router: No
- Pinia: No
- Vitest: No
- ESLint: Yes

Then:

```bash
cd test-project
npm install
npm run dev
```

If the development server starts successfully, you're all set! You can delete the `test-project` folder afterward.

## Exercise Structure

Each exercise folder contains:
- **README.md**: Step-by-step instructions
- **Starter code**: Sometimes provided to help you begin
- **Expected outcome**: What your solution should achieve

### How to Approach Each Exercise

1. Read the README.md completely before starting
2. Try to solve it independently first
3. Refer to [Vue.js documentation](https://vuejs.org/) when needed
4. Test your solution thoroughly
5. Compare with classmates (but do your own work first!)

## Exercises

### [00. Introduction](00-introduction/)
Getting started with the course structure and expectations.

### 01. Vue Basics
- [Exercise 01: Hello Vue](01-vue-basics/ex01-hello-vue/) - Your first Vue application
- [Exercise 02: Data Binding](01-vue-basics/ex02-data-binding/) - Learn v-bind and v-model
- [Exercise 03: Methods & Events](01-vue-basics/ex03-methods-events/) - Handle user interactions
- [Exercise 04: Computed Properties & Watchers](01-vue-basics/ex04-computed-watch/) - Reactive computed values

### 02. Components
- [Exercise 05: Component Basics](02-components/ex05-components-basics/) - Creating reusable components
- [Exercise 06: Props](02-components/ex06-props/) - Passing data to child components
- [Exercise 07: Emit Events](02-components/ex07-emit-events/) - Child-to-parent communication
- [Exercise 08: Slots](02-components/ex08-slots/) - Flexible component content

### 03. Routing & State Management
- [Exercise 09: Vue Router](03-routing-state/ex09-vue-router/) - Navigation between pages
- [Exercise 10: Pinia State Management](03-routing-state/ex10-pinia-state/) - Global state management

### 04. API & Async Operations
- [Exercise 11: API with Fetch](04-api-async/ex11-api-fetch/) - Fetching data from APIs
- [Exercise 12: Async/Await](04-api-async/ex12-async-await/) - Modern async patterns

### 05. Mini Project
- [Exercise 13: Dashboard Mini Project](05-mini-project/ex13-mini-project-dashboard/) - Build a complete dashboard application

## Getting Help

- **Official Documentation**: [vuejs.org](https://vuejs.org/)
- **Vue School**: [vueschool.io](https://vueschool.io/) (free courses available)
- **Stack Overflow**: Tag your questions with `vue.js`
- **Classmates**: Collaborate and learn together!

## Tips for Success

1. **Code every day**: Even 30 minutes of practice helps
2. **Read error messages**: They usually tell you exactly what's wrong
3. **Use Vue DevTools**: Install the browser extension for debugging
4. **Experiment**: Try things beyond the exercise requirements
5. **Build your own projects**: Apply what you learn to personal ideas

## Vue DevTools Installation

Install the Vue DevTools browser extension for easier debugging:
- **Chrome**: [Chrome Web Store](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
- **Firefox**: [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)

---

**Good luck with your exercises!** 🚀

Remember: The goal is to learn, not just to finish. Take your time and understand each concept.

---

## 👨‍🏫 Credits

Course Author: Dr. Amine SOUMIAA  
Program: Bachelor IW  
Institution: ESGI – École Supérieure de Génie Informatique  
Website: https://www.esgi.fr/  

© 2026 – All rights reserved for academic use.
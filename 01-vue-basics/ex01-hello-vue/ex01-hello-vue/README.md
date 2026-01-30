# EX 01-hello-vue

![Exercise Image](./vuejs-bachelor-exercises/01-vue-basics/ex01-hello-vue/ex01-hello-vue/Screenshot 2026-02-06 235636.png)

1. What happens when you type in the input field? Why?
When typing, `v-model` updates the reactive variable (the ref). Vue's reactivity system detects this change and triggers a re-render of the Virtual DOM, which then updates the actual DOM to reflect the new value.
2. What's the difference between `ref()` and a regular JavaScript variable?
A regular variable is just a value in memory; changing it does not trigger a UI update. `ref()` creates a **reactive** reference. When a `ref` value changes, Vue is notified and automatically updates the DOM components that use it.
3. Why do we use `v-model` instead of just `value` and `onChange`?
`v-model` is syntactic sugar for **two-way data binding**. It simplifies the code by automatically handling both the value binding (`:value`) and the event listening (`@input` or `@change`) to update the state.
<template>
  <div class="bubbling" @click="parentAction">
    <h3>both button are in the same div the first on as no stop bubbling</h3>
    <div>
      <button @click="childrenAction">Click me</button>
      <button @click.stop="childrenAction">Click me</button>
    </div>
  </div>
  <button @click="addCounter">Add counter</button>
  <div class="container">
    <ul>
      <li v-for="id in counters" :key="id">
        <Counter :id="id"/>
      </li>
    </ul>
  </div>
</template>

<script setup>
import Counter from "@/components/Counter.vue";
import {ref, watch} from "vue";
const counters = ref(JSON.parse(localStorage.getItem('counter')) || []);

const addCounter = () => {
  counters.value.push(Date.now())
}

watch(counters, () => {
  localStorage.setItem('counter', JSON.stringify(counters.value))
}, {deep: true})

</script>

<style scoped>

/* Global styles for the app context */
:global(body) {
  background-color: #f0f2f5;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin: 0;
  padding: 20px;
  color: #333;
}

.bubbling {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  div {
    display: flex;
    gap: 1rem;
  }
}
/* "Add Counter" Button Style */
button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  display: block;
  margin: 0 auto 30px auto;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

button:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
}

button:active {
  transform: translateY(0);
}

.container ul {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 30px;
  padding: 0;
  margin: 0;
}

.container ul li {
  list-style-type: none;
  padding: 0;
  border: none;
}

</style>
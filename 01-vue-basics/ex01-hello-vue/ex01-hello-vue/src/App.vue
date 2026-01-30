<template>
  <div class="container">
    <div class="project">
      <h1 class="title">Hello Vue!</h1>

      <p v-if="hours < 12" class="greeting">
        Good morning {{ name }} ! Your favorites colors is {{ color }}
      </p>
      <p v-else class="greeting">
        Good afternoon {{ name }} ! Your favorites colors is {{ color }}
      </p>
      <input v-model="name" type="text" placeholder="Your name here..." />
      <input v-model="color" type="text" placeholder="Your favorite color here..." />
        <p>{{ name.length }} characters counts</p>
        <button @click="name = ''">Reset name</button>
      <p class="time">{{ currentDateTime }}</p>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'

  const name = ref('Antony')
  const color = ref('purple')
  const currentDateTime = ref(new Date().toLocaleString())
  const hours = ref(new Date().getHours())

</script>

<style scoped>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f0f2f5;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  .project {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    align-items: center;
    background-color: #ffffff;
    padding: 5rem;
    border-radius: 1.5rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
    .title {
      color: #42b883;
      font-weight: 700;
      letter-spacing: 0.1rem;
    };
    .greeting {
      color: #2c3e50;
      font-size: 2rem;
    }
    input, button {
      text-align: center;
      border-radius: 0.5rem;
      padding: 0.75rem 1rem;
      border: 1px solid #e2e8f0;
      background-color: #f8fafc;
      color: #2c3e50;
      font-size: 1rem;
      outline: none;
      transition: border-color 0.2s;
    }
    button {
      cursor: pointer;
    }
    button:hover {
      border-color: #42b883;
    }
    input:focus {
      border-color: #42b883;
    }
    .time {
      color: #64748b;
      font-style: italic;
    }
  }
</style>

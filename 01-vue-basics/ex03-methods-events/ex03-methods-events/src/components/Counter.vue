<template>
  <div class="counter-app"  @keyup.up="increment" @keyup.down="decrement" @keyup.space="reset" tabindex="0">
    <h1>Interactive Counter</h1>

    <div>
      <label for="targetGoal">Chose your target goal</label>
      <input v-model.number="targetGoal" type="number" name="targetGoal" id="targetGoal">
    </div>

    <div class="counter-display">
      <Transition name="slide-up" mode="out-in">
        <h2 :key="count">Count: {{ count }} / {{ targetGoal }}</h2>
      </Transition>

      <div class="progress-bar-container"><div :style="{width: progressPercentage + '%' }" class="progress-bar"></div></div>
      <p v-if="count >= targetGoal">Goal Reached</p>
      <p>{{warningMessage}}</p>
    </div>

    <div class="controls">
      <button @click="increment">+1</button>
      <button @click="decrement">-1</button>
      <button @click="reset">Reset</button>
      <button @click="undo">Undo</button>
      <button @click="redo">Redo</button>
    </div>

    <form @submit.prevent="incrementBy(customAmount)">
      <input v-model.number="customAmount" type="number">
      <button type="submit">Add</button>
    </form>

    <div class="advanced-controls">
      <button @dblclick="incrementBy(10)">Double-click: +10</button>
      <button @click.right.prevent="decrementBy(5)">Right-click: -5</button>
    </div>

    <div class="history">
      <ul>
        <li v-for="(entry, index) in history" :key="index">{{ (history.length - 1) - index }} : {{ entry }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, watch} from 'vue'
const props = defineProps(["id"])
const counterId = `counter-${props.id}`
const counter = JSON.parse(localStorage.getItem(counterId))

const count = ref(counter?.count || 0)
const targetGoal = ref(50)
const customAmount = ref(0)
const history = ref(counter?.history || [])
const stateHistory = ref([0])
const redoState = ref([0])
const warningMessage = ref('')

const progressPercentage = ref(counter?.progressPercentage || 0)

const playSound = () => {
  const audio = new Audio('/universfield-animation-142973.mp3');
  audio.play();
}

const updatePercentage = () => {
  progressPercentage.value = (count.value / targetGoal.value) * 100
  watch(count, (newVal) => {
    localStorage.setItem('count', JSON.stringify(newVal))
  })
}

const clickHistory = (increment, value) => {
  const time = new Date().toLocaleTimeString()
  stateHistory.value.push(value)
  const message = increment ? `Incremented by ${Math.abs(value)} at [${time}]` : `Decremented by ${Math.abs(value)} at [${time}]`
  history.value.push(message)
  history.value.reverse()
}

const undo = () => {
  if (stateHistory.value.length <= 1) {
    return
  }
  if (count.value >= targetGoal.value || count.value <= 0) {
    warningMessage.value = 'Limit reached!'
    return
  }
  const lastValue = stateHistory.value.pop()
  redoState.value.push(lastValue)
  count.value -= lastValue
  history.value.pop()
  updatePercentage()
}

const redo = () => {
  if (redoState.value.length <= 1) {
    return
  }
  if (count.value >= targetGoal.value || count.value <= 0) {
    warningMessage.value = 'Limit reached!'
    return
  }

  const lastValue = redoState.value.pop()
  count.value += lastValue

  lastValue > 0 ? clickHistory(true, lastValue) : clickHistory(false, lastValue)
  updatePercentage()
}

const increment = () => {
  if (count.value >= targetGoal.value) {
    warningMessage.value = `Limit reached! Cannot go above ${targetGoal.value}.`
    return
  }
  playSound()

  warningMessage.value = ''
  count.value++
  clickHistory(true, 1)
  updatePercentage()
}

const incrementBy = (amount) => {
  const newValue = count.value + amount
  if (newValue > targetGoal.value) {
    warningMessage.value = `Limit reached! Cannot go above ${targetGoal.value}.`
    return
  }
  if (newValue < 0) {
    warningMessage.value = 'Limit reached! Cannot go below 0.'
    return
  }
  warningMessage.value = ''
  count.value += amount
  clickHistory(true, amount)
  updatePercentage()
}

const decrement = () => {
  if (count.value <= 0) {
    warningMessage.value = 'Limit reached! Cannot go below 0.'
    return
  }
  playSound()
  warningMessage.value = ''
  count.value--
  clickHistory(false, -1)
  updatePercentage()
}

const decrementBy = (amount) => {
  if (count.value - amount <= 0) {
    warningMessage.value = 'Limit reached! Cannot go below 0.'
    return
  }
  warningMessage.value = ''
  count.value -= amount
  clickHistory(false, -5)
  updatePercentage()
}



const reset = () => {
  count.value = 0
  history.value = []
  stateHistory.value = [0]
  warningMessage.value = ''
  updatePercentage()
}

const parentAction = () => {
  alert('You see me case the propagation of the click event arrive to me')
}

const childrenAction = () => {
  alert('You should only see this message cause not propagation arrive to the parent div who as a click event too')
}

watch([count, history, progressPercentage], () => {
  const payload = {
    count: count.value,
    history: history.value,
    progressPercentage: progressPercentage.value
  }
  localStorage.setItem(counterId, JSON.stringify(payload))
}, {deep: true})

</script>

<style scoped>

/* Main Card Styling */
.counter-app {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  gap: 20px;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid #eaeaea;
}

.counter-app:focus {
  outline: 2px solid #3498db;
  box-shadow: 0 0 0 4px rgba(52, 152, 219, 0.2);
}

/* Typography */
h1 {
  font-size: 1.5rem;
  margin: 0;
  text-align: center;
}

h2 {
  font-size: 2rem;
  margin: 0;
}

h6 {
  margin: 0 0 10px 0;
  font-weight: normal;
}

/* Inputs & Labels */
label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 0.9rem;
}

input[type="number"] {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #ecf0f1;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

input[type="number"]:focus {
  border-color: #3498db;
  outline: none;
}

/* Display Section */
.counter-display {
  border-radius: 12px;
  padding: 20px;
  text-align: center;
}

/* Control Groups */
.controls, .advanced-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

/* Form */
form {
  display: flex;
  gap: 10px;
}

button {
  background-color: #27ae60;
  color: white;
  white-space: nowrap;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

button:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
}

button:active {
  transform: translateY(0);
}

/* History */
.history {
  margin-top: 10px;
  border-top: 1px solid #eee;
  padding-top: 15px;
}

.history ul {
  list-style: none;
  padding: 0;
  margin: 0;
  overflow-y: auto;
  font-size: 0.85rem;
  color: #7f8c8d;
  min-height: 10vh;
  max-height: 10vh;
}

.history li {
  padding: 4px 0;
  border-bottom: 1px dashed #f0f0f0;
}

/* Transitions */
.slide-up-enter-active {
  transition: all 0.3s ease;
}

.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

/* Progress Bar */
.progress-bar-container {
  height: 10px;
  background-color: #e9ecef;
  border-radius: 10px;
  overflow: hidden;
  margin: 15px 0;
}

.progress-bar {
  height: 100%;
  background-color: #2ecc71;
  border-radius: 10px;
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

</style>
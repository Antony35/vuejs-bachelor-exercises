<template>

  <div @click="parentAction">
    <h6>both button are in the same div the first on as no stop bubbling</h6>
    <button @click="childrenAction">Click me</button>
    <button @click.stop="childrenAction">Click me</button>
  </div>

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
        <li v-for="(entry, index) in history" :key="index">{{index}} : {{entry}}</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const count = ref(0)
const targetGoal = ref(50)
const customAmount = ref(0)
const history = ref([])
const stateHistory = ref([0])
const redoState = ref([0])
const warningMessage = ref('')
const progressPercentage = ref(0)


const playSound = () => {
  const audio = new Audio('.././universfield-animation-142973.mp3');
  audio.play();
}

const updatePercentage = () => {
  console.log(stateHistory.value[stateHistory.value.length - 1])
  progressPercentage.value = (count.value / targetGoal.value) * 100
}

const clickHistory = (increment, value) => {
  const time = new Date().toLocaleTimeString()
  stateHistory.value.push(value)
  const message = increment ? `Incremented by ${Math.abs(value)} at [${time}]` : `Decremented by ${Math.abs(value)} at [${time}]`
  history.value.push(message)
}

const undo = () => {
  if (stateHistory.value.length <= 1) {
    return
  }
  if (count.value >= targetGoal.value || count.value <= 0) {
    warningMessage.value = 'Limit reached!'
    return
  }
  redoState.value.push(stateHistory.value.length - 1)
  const lastValue = stateHistory.value.pop()
  count.value -= lastValue
  history.value.pop()
  updatePercentage()
}

const redo = () => {
  if (stateHistory.value.length <= 1) {
    return
  }
  if (count.value >= targetGoal.value || count.value <= 0) {
    warningMessage.value = 'Limit reached!'
    return
  }



  const lastValue = redoState.value.length - 1
  count.value += redoState.value.pop()

  updatePercentage()
  lastValue > 0 ? clickHistory(true, lastValue) : clickHistory(false, lastValue)
}

const increment = () => {
  if (count.value >= targetGoal.value) {
    warningMessage.value = `Limit reached! Cannot go above ${targetGoal.value}.`
    return
  }
  playSound()

  warningMessage.value = ''
  count.value++
  updatePercentage()
  clickHistory(true, 1)
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
  updatePercentage()
  clickHistory(true, amount)
}

const decrement = () => {
  if (count.value <= 0) {
    warningMessage.value = 'Limit reached! Cannot go below 0.'
    return
  }
  playSound()
  warningMessage.value = ''
  count.value--
  updatePercentage()
  clickHistory(false, -1)
}

const decrementBy = (amount) => {
  if (count.value - amount <= 0) {
    warningMessage.value = 'Limit reached! Cannot go below 0.'
    return
  }
  warningMessage.value = ''
  count.value -= amount
  updatePercentage()
  clickHistory(false, -5)
}



const reset = () => {
  count.value = 0
  updatePercentage()
  history.value = []
  stateHistory.value = [0]
  warningMessage.value = ''
}

const parentAction = () => {
  alert('You see me case the propagation of the click event arrive to me')
}

const childrenAction = () => {
  alert('You should only see this message cause not propagation arrive to the parent div who as a click event too')
}

</script>

<style scoped>

.progress-bar-container {
  width: 300px;
  height: 20px;
  background-color: #4caf50;
}

.progress-bar {
  height: 20px;
  background-color: #c0392b;
}

.slide-up-enter-active {
  transition: all 0.2s ease-out;
}

.slide-up-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
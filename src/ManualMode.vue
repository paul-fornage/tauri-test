<script setup lang="ts">
import { House } from 'lucide-vue-next';
import { ref } from 'vue';
const emit = defineEmits(['modeChange'])

async function homeClicked() {
  console.log("change to home")
  emit("modeChange", "home")
}

const maxCommandedPosition = 48;
const minCommandedPosition = 0;

const commanded_axis_pos = ref<number>(0)

async function addToCommandedPosition(delta: number){
  console.log("delta: " + typeof delta);
  console.log("commanded_axis_pos.value: " + typeof commanded_axis_pos.value);
  const temp_value: number = delta + commanded_axis_pos.value;
  commanded_axis_pos.value = constrain(minCommandedPosition, temp_value, maxCommandedPosition)
}

function constrain(min: number, value: number, max: number): number{
  if(value > max){
    return max
  } else if(value < min) {
    return min
  } else {
    return value
  }
}

</script>

<template>
  <div class="toolbar">
    <p class="my-auto padding-8px">
      Manual Mode
    </p>
    <button @click="homeClicked" class="flex-right my-auto padding-8px">
      <House class="icon"/>
      Home
    </button>
  </div>
  <div class="upper-buttons">
    <button class="home-button">
      Run Axis Homing Sequence
    </button>
    <div class="learn-button-group">
      <button class="learn-start-button">
        Set start to current position
      </button>
      <button class="learn-end-button">
        Set end to current position
      </button>
      <button class="learn-park-button">
        Set park to current position
      </button>
    </div>
    <div class="indicator-group">
      <div class="indicator-card">
        Clamp
      </div>
      <div class="indicator-card">
        Fingers
      </div>
      <div class="indicator-card">
        Roller
      </div>
    </div>
  </div>
  <div class="axis-control">
    <h1>
      {{commanded_axis_pos.toFixed(2)}}
    </h1>
    <div class="axis-slider-div">
      <div>
        {{minCommandedPosition}}
      </div>
      <input
          v-model.number="commanded_axis_pos"
          class="axis-slider"
          type="range"
          id="axis"
          name="Axis"
          :min="minCommandedPosition"
          :max="maxCommandedPosition"
          :value="minCommandedPosition"
          step="0.01" />
      <div>
        {{maxCommandedPosition}}
      </div>
    </div>
    <div class="axis-step">
      <div @click="addToCommandedPosition(-1)" class="button-div w-8v h-10v flex">
        <img src="/chevron-left-3.svg" alt="Chevron Left 3" class="my-auto h-2 p-1">
        <p class="my-auto p-1 nowrap">
          -1 in
        </p>
      </div>
      <div @click="addToCommandedPosition(-0.1)" class="button-div w-8v h-10v flex">
        <img src="/chevron-left-2.svg" alt="Chevron Left 2" class="my-auto h-2 p-1">
        <p class="my-auto p-1 nowrap">
          -0.1 in
        </p>
      </div>
      <div @click="addToCommandedPosition(-0.01)" class="button-div w-8v h-10v flex">
        <img src="/chevron-left-1.svg" alt="Chevron Left 1" class="my-auto h-2 p-1">
        <p class="my-auto p-1 nowrap">
          -0.01 in
        </p>
      </div>
      <div @click="addToCommandedPosition(0.01)" class="button-div w-8v h-10v flex">
        <p class="my-auto p-1 nowrap">
          0.01 in
        </p>
        <img src="/chevron-right-1.svg" alt="Chevron Right 1" class="my-auto h-2 p-1">
      </div>
      <div @click="addToCommandedPosition(0.1)" class="button-div w-8v h-10v flex">
        <p class="my-auto p-1 nowrap">
          0.1 in
        </p>
        <img src="/chevron-right-2.svg" alt="Chevron Right 2" class="my-auto h-2 p-1">
      </div>
      <div @click="addToCommandedPosition(1)" class="button-div w-8v h-10v flex">
        <p class="my-auto p-1 nowrap">
          1 in
        </p>
        <img src="/chevron-right-3.svg" alt="Chevron Right 3" class="my-auto h-2 p-1">
      </div>
    </div>
  </div>
</template>

<style scoped>
.p-1{
  margin: 2px;
}
.h-2{
  height: 2rem;
}

.nowrap{
  text-wrap: nowrap;
}

.flex-max{
  flex: max-content;
}

.debug{
  border: red 2px solid;
}

.white{
  stroke: #e8e8e8;
  fill: #e8e8e8;
}
.w-8v{
  width: 8vw;
}
.h-10v{
  height: 10vh;
}
.flex {
  display: flex;
}


.button-div {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  transition: border-color 0.25s;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
  margin: 0px 10px;
  outline: none;
  color: #ffffff;
  background-color: #0f0f0f98;
  cursor: pointer;
}


.button-div:hover {
  border-color: #396cd8;
}
.button-div:active {
  border-color: #396cd8;
  background-color: #0f0f0f69;
}




.axis-slider-div{
  display: flex;
}

.axis-slider{
  width: 80vw;
  margin: auto auto;
  justify-self: center;
}

.axis-step{
  display: flex;
  flex-direction: row;
}
.upper-buttons{
  display: flex;
  flex-direction: row;
}

.padding-8px{
  padding: 8px;
}

.flex-right{
  margin-left: auto;
}
.my-auto{
  margin-top: auto;
  margin-bottom: auto;
}
.toolbar{
  display: flex;
  height: 50px;
  margin-bottom: auto;
  border-bottom: #2f2f2f 5px ridge;
}
.icon{
  width: 1cap;
  height: 1cap;
  margin: auto;
}
.big-icon{
  width: auto;
  height: 2cap;
  margin: auto;
}
</style>
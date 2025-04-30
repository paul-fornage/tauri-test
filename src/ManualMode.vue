<script setup lang="ts">
import { House } from 'lucide-vue-next';
import { ref } from 'vue';
import { Mode } from './types.ts'
import ModeToolbar from "./ModeToolbar.vue";
import Button from "./Button.vue";

const emit = defineEmits<{
  (e: 'modeChange', mode: Mode): void
}>()

async function homeClicked() {
  console.log("change to home")
  emit("modeChange", Mode.Home)
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
  <ModeToolbar
      header-text="Manual Control"
      @homeClicked="homeClicked"
  />

  <div class="flex border-b-2">
    <div class="flex flex-col flex-1/4 mx-2">
      <Button text="Run Axis Homing Sequence" />
      <Button text="Return to home" />
      <Button text="Set speed" />
    </div>

    <div class="flex flex-col flex-1/4 mx-2">
      <Button text="Set job start to current position" />
      <Button text="Set job end to current position" />
      <Button text="Set job park to current position" />
    </div>
    <div class="flex flex-col flex-1/4 mx-2">
      <Button text="Toggle Clamps" />
      <Button text="Fingers" />
      <Button text="Roller" />
    </div>
  </div>
  <div class="m-2">
    <h1 class="mx-auto text-center">
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
    <div class="flex mt-5 gap-4">
      <div @click="addToCommandedPosition(-1)" class="h-20 flex flex-1/6 border-2 rounded-lg p-1 cursor-pointer bg-zinc-200 hover:bg-zinc-300 click:bg-zinc-400">
        <img src="/chevron-left-3.svg" alt="Chevron Left 3" class="my-auto h-16 p-1 stroke-black">
        <p class="my-auto p-1 nowrap ml-auto text-2xl">
          -1 in
        </p>
      </div>
      <div @click="addToCommandedPosition(-0.1)" class="h-20 flex flex-1/6 border-2 rounded-lg p-1 cursor-pointer bg-zinc-200 hover:bg-zinc-300 click:bg-zinc-400">
        <img src="/chevron-left-2.svg" alt="Chevron Left 2" class="my-auto h-16 p-1">
        <p class="my-auto p-1 nowrap ml-auto text-2xl">
          -0.1 in
        </p>
      </div>
      <div @click="addToCommandedPosition(-0.01)" class="h-20 flex flex-1/6 border-2 rounded-lg p-1 cursor-pointer bg-zinc-200 hover:bg-zinc-300 click:bg-zinc-400">
        <img src="/chevron-left-1.svg" alt="Chevron Left 1" class="my-auto h-16 p-1">
        <p class="my-auto p-1 nowrap ml-auto text-2xl">
          -0.01 in
        </p>
      </div>
      <div @click="addToCommandedPosition(0.01)" class="h-20 flex flex-1/6 border-2 rounded-lg p-1 cursor-pointer bg-zinc-200 hover:bg-zinc-300 click:bg-zinc-400">
        <p class="my-auto p-1 nowrap mr-auto text-2xl">
          0.01 in
        </p>
        <img src="/chevron-right-1.svg" alt="Chevron Right 1" class="my-auto h-16 p-1">
      </div>
      <div @click="addToCommandedPosition(0.1)" class="h-20 flex flex-1/6 border-2 rounded-lg p-1 cursor-pointer bg-zinc-200 hover:bg-zinc-300 click:bg-zinc-400">
        <p class="my-auto p-1 nowrap mr-auto text-2xl">
          0.1 in
        </p>
        <img src="/chevron-right-2.svg" alt="Chevron Right 2" class="my-auto h-16 p-1">
      </div>
      <div @click="addToCommandedPosition(1)" class="h-20 flex flex-1/6 border-2 rounded-lg p-1 cursor-pointer bg-zinc-200 hover:bg-zinc-300 click:bg-zinc-400">
        <p class="my-auto p-1 nowrap mr-auto text-2xl">
          1 in
        </p>
        <img src="/chevron-right-3.svg" alt="Chevron Right 3" class="my-auto h-16 p-1">
      </div>
    </div>
  </div>
</template>

<style scoped>

.nowrap{
  text-wrap: nowrap;
}


.debug{
  border: red 2px solid;
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

</style>
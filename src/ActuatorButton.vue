<script setup lang="ts">
import {
  debug,
} from '@tauri-apps/plugin-log';
import {Actuator} from "./types.ts";
import {computed, ComputedRef} from "vue";

const props = defineProps<{
  actuatorName: string,
  actuatorState: Actuator
}>();

const emit = defineEmits<{
  (e: 'clicked'): void
}>()

async function clickHandler() {
  emit("clicked")
}

function getActuatorButtonClass(state: Actuator): string {
  if (state.has_unknown_state()) {
    return "border-gray-400 text-gray-900";
  }
  if (state.sensed === true) {
    return "border-green-700 text-green-900";
  }
  if (state.sensed === false) {
    return "border-red-600 text-red-900";
  }
  return "border-gray-400 text-gray-900";
}

const subtext: ComputedRef<string> = computed(() => {
  console.log("get_subtext: " + props.actuatorState)
  if(!props.actuatorState){
    return "Unknown";
  }
  if (!props.actuatorState.has_unknown_state()) {
    switch (props.actuatorState.sensed) {
      case true:
        return "Engaged";
      case false:
        return "Disengaged";
    }
  }
  return "Unknown";
});

</script>

<template>
  <div @click="clickHandler"
       :class="['m-2 py-4 px-8 border-4 rounded-lg flex gap-5 bg-zinc-200 cursor-pointer hover:bg-zinc-300 click:bg-zinc-400',
                getActuatorButtonClass]">
    <p class="text-center m-auto">
      {{ actuatorName }}
    </p>
    <div>
      <p>
        {{ subtext }}
      </p>
    </div>
  </div>
</template>

<style scoped>
</style>
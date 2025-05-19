<script setup lang="ts">
import {
  debug,
} from '@tauri-apps/plugin-log';
import {Actuator} from "../types.ts";
import {computed, ComputedRef} from "vue";

const props = defineProps<{
  actuatorName: string,
  actuatorCommanded: boolean,
  actuatorSensed: boolean,
}>();

const emit = defineEmits<{
  (e: 'clicked'): void
}>();

async function clickHandler() {
  emit("clicked")
}

function getActuatorButtonClass(): string {
  if (props.actuatorSensed && props.actuatorCommanded) {
    return "border-green-900 text-green-900";
  }
  if (!props.actuatorSensed && !props.actuatorCommanded) {
    return "border-red-800 text-red-900";
  }
  if (props.actuatorCommanded) {
    return "border-green-600 text-green-900";
  }
  if (!props.actuatorCommanded) {
    return "border-red-500 text-red-900"
  }
  return "border-gray-400 text-gray-900";
}

const subtext: ComputedRef<string> = computed(() => {
  debug("get_subtext: " + props.actuatorName)
  if (props.actuatorSensed && props.actuatorCommanded) {
    return "Engaged";
  } else if (!props.actuatorSensed && !props.actuatorCommanded) {
    return "Disengaged";
  } else if (!props.actuatorSensed && props.actuatorCommanded) {
    return "Engaging...";
  } else if (props.actuatorSensed && !props.actuatorCommanded) {
    return "Disengaging...";
  } else {
    return "Unknown";
  }
});

</script>

<template>
  <div @click="clickHandler"
       :class="['my-2 py-4 px-8 border-4 rounded-lg flex gap-5 bg-zinc-200 cursor-pointer hover:bg-zinc-300 click:bg-zinc-400',
                getActuatorButtonClass()]">
    <p class="text-left mr-auto">
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
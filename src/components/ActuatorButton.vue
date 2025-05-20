<script setup lang="ts">
import {
  debug,
} from '@tauri-apps/plugin-log';
import {computed, ComputedRef} from "vue";
import {Button} from "@/components/ui/button";

const props = defineProps<{
  actuatorName: string,
  actuatorCommanded: boolean,
  actuatorSensed: boolean,
  true_text?: string,
  false_text?: string,
  rising_text?: string,
  falling_text?: string,
}>();

const emit = defineEmits<{
  (e: 'clicked'): void
}>();

async function clickHandler() {
  emit("clicked")
}

function getActuatorButtonClass(): string {
  if (props.actuatorSensed && props.actuatorCommanded) {
    return "border-green-600 text-green-600 dark:text-green-800";
  }
  if (!props.actuatorSensed && !props.actuatorCommanded) {
    return "border-red-500 text-red-600 dark:text-red-800";
  }
  return "border-gay-600 text-gray-400";
}

const subtext: ComputedRef<string> = computed(() => {
  if (props.actuatorSensed && props.actuatorCommanded) {
    return props.true_text ?? "Engaged";
  } else if (!props.actuatorSensed && !props.actuatorCommanded) {
    return props.false_text ?? "Disengaged";
  } else if (!props.actuatorSensed && props.actuatorCommanded) {
    return props.rising_text ?? "Engaging...";
  } else if (props.actuatorSensed && !props.actuatorCommanded) {
    return props.falling_text ?? "Disengaging...";
  } else {
    return "Unknown";
  }
});

</script>

<template>
  <Button @click="clickHandler"
       :class="['my-2 py-6 px-8 border-4 rounded-lg flex gap-5 text-xl',
                getActuatorButtonClass()]">
    <p class="text-left mr-auto">
      {{ actuatorName }}
    </p>
    <div>
      <p>
        {{ subtext }}
      </p>
    </div>
  </Button>
</template>

<style scoped>
</style>
<script setup lang="ts">
import {
  debug,
} from '@tauri-apps/plugin-log';

const props = defineProps<{
  text: string
}>();

const emit = defineEmits<{
  (e: 'clicked'): void
}>()

async function clickHandler() {
  debug(props.text)
  emit("clicked")
}

</script>

<template>
  <div @click="clickHandler"
       class="m-2 py-4 px-8 border-2 rounded-lg flex gap-5 bg-zinc-200 cursor-pointer hover:bg-zinc-300 click:bg-zinc-400">
    <p class="text-center m-auto">
      {{ text }}
    </p>
  </div>
</template>

<style scoped>
</style>
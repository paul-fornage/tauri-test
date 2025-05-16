<script setup lang="ts">
import {
  debug,
} from '@tauri-apps/plugin-log';


const props = defineProps<{
  text: string
  disabled?: boolean
}>();

const emit = defineEmits<{
  (e: 'clicked'): void
}>()

function clickHandler() {
  if(!props.disabled){
    debug("clicked "+props.text)
    emit("clicked")
  } else {
    debug("clicked when disabled "+props.text)
  }
}


</script>



<template>
  <div @click="clickHandler"
     :aria-disabled="props.disabled"
     :class="[
        'm-2 py-4 px-8 border-4 rounded-lg flex gap-5 bg-zinc-200 cursor-pointer',
        props.disabled ? 'border-gray-300 hover:cursor-not-allowed text-gray-400' : 'hover:bg-zinc-300 focus:bg-zinc-400'
     ]">
    <p class="text-center m-auto">
      {{ text }}
    </p>
  </div>
</template>

<style scoped>
</style>
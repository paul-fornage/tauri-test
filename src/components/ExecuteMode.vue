<script setup lang="ts">
import { Mode } from '../types.ts'
import ModeToolbar from "./ModeToolbar.vue";

const emit = defineEmits<{
  (e: 'modeChange', mode: Mode): void
}>()
async function homeClicked() {
  console.log("change to home")
  emit("modeChange", Mode.Home)
}
</script>

<template>
  <ModeToolbar
      header-text="Execute mode"
      @homeClicked="homeClicked"
  />
  <h1>
    Execute Mode
  </h1>
</template>

<style scoped>


</style>
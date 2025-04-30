<script setup lang="ts">
import { House } from 'lucide-vue-next';
import { Mode } from './types.ts'

const emit = defineEmits<{
  (e: 'modeChange', mode: Mode): void
}>()
async function homeClicked() {
  console.log("change to home")
  emit("modeChange", Mode.Home)
}
</script>

<template>
  <div class="toolbar">
    <p class="my-auto padding-8px">
      Execute Mode
    </p>
    <button @click="homeClicked" class="flex-right my-auto padding-8px">
      <House class="icon"/>
      Home
    </button>
  </div>
  <h1>
    Execute Mode
  </h1>
</template>

<style scoped>

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
</style>
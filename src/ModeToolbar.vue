<script setup lang="ts">
import {House} from "lucide-vue-next";

defineProps<{
  headerText: string
}>();

const emit = defineEmits<{
  (e: 'homeClicked'): void
}>()

async function homeClicked() {
  console.log("change to home")
  emit("homeClicked")
}


</script>

<template>
  <div class="flex w-full border-b-2">
    <p class="mr-auto p-6 text-xl">
      {{ headerText }}
    </p>
    <div @click="homeClicked" class="ml-auto m-2 py-4 px-8 border-2 rounded-lg flex gap-5 bg-zinc-200 cursor-pointer hover:bg-zinc-300 click:bg-zinc-400">
      <House class="w-8 h-8"/>
      <p class="my-auto">
        Home
      </p>
    </div>
  </div>
</template>

<style scoped>

</style>
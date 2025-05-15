<script setup lang="ts">
import {House} from "lucide-vue-next";
import * as Register from './RegisterDefinitions.ts';
import {computed} from "vue";

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

const cycleTime = computed<string>(() => {
  return Register.cc_iteration_time.value.value.toString() + ' µs cycle time'
})


</script>

<template>
  <div class="flex w-full border-b-2 h-20">
    <p class="mr-auto p-6 text-xl">
      {{ headerText }}
    </p>
    <div
        v-if="Register.show_message.value.value"
        class="bg-gray-300 border-2 border-gray-900 rounded-xl h-min my-auto m-1 p-1 text-center">
      {{Register.message_register_range.value.as_text()}}
    </div>
    <p
        v-else
        class="text-gray-500 text-l my-auto">
      {{cycleTime}}
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
<script setup lang="ts">
import { Mode } from './types.ts'
import { invoke } from "@tauri-apps/api/core";
import { ref, onMounted } from 'vue';

const ip_addr = ref<string>("Ip Address");

const emit = defineEmits<{
  (e: 'modeChange', mode: Mode): void
}>()

async function modeChange(mode: Mode) {
  console.log("modeChange: " + mode)
  emit('modeChange', mode)
}

onMounted(async () => {
  ip_addr.value = await invoke("get_ip_addr");
  console.log("ip_addr: " + ip_addr.value);
})

</script>

<template>
  <main class="container">
    <div class="flex">
      <img src="/mitusa-logo.png" class="logo mitusa mx-auto p-3" alt="Mitusa logo" />
    </div>
    <div class="">
      <h2 class="mx-auto mt-3 text-center text-4xl ">
        Select operating mode
      </h2>
      <p class="mx-auto mt-1 pb-2 mb-5 text-center text-sm border-b-2">
        Local IP address: {{ip_addr}}
      </p>
    </div>

    <div class="flex">
      <button
          @click="modeChange(Mode.Execute)"
          class="mode-button">
        Execute Mode
      </button>
      <button
          @click="modeChange(Mode.Manual)"
          class="mode-button">
        Manual Mode
      </button>
      <button
          @click="modeChange(Mode.CameraPreview)"
          class="mode-button">
        Camera Preview
      </button>
    </div>
  </main>
</template>

<style scoped>
.logo.mitusa:hover {
  filter: drop-shadow(0 0 2em #747bff);
}

.logo.mitusa:hover {
  filter: drop-shadow(0 0 2em #249b73);
}

.mode-button {
  @apply mx-auto;
  @apply p-3;
  @apply border-zinc-900;
  @apply border-2;
  @apply w-60;
  @apply text-center;
  @apply rounded-lg;
  @apply bg-zinc-200;
  @apply cursor-pointer;
  @apply hover:bg-zinc-300;
  @apply click:bg-zinc-400;
}

</style>
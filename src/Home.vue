<script setup lang="ts">
import { Mode } from './types.ts'
import { invoke } from "@tauri-apps/api/core";
import { ref, onMounted } from 'vue';
import Button from "./Button.vue";

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
  <main>
    <div class="flex pt-10">
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

    <div class="flex gap-4 mx-4">
      <Button @click="modeChange(Mode.Execute)" text="Execute" class="flex-1/3 h-32 text-2xl"/>
      <Button @click="modeChange(Mode.Manual)" text="Manual" class="flex-1/3 h-32 text-2xl"/>
      <Button @click="modeChange(Mode.CameraPreview)" text="Camera" class="flex-1/3 h-32 text-2xl"/>
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



</style>
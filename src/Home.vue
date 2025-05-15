<script setup lang="ts">
import { Mode } from './types.ts'
import { invoke } from "@tauri-apps/api/core";
import { ref, onMounted } from 'vue';
import Button from "./Button.vue";


const emit = defineEmits<{
  (e: 'modeChange', mode: Mode): void
}>()

const props = defineProps<{
  local_ip: string,
  remote_sock_addr: string
}>();

async function modeChange(mode: Mode) {
  console.log("modeChange: " + mode)
  emit('modeChange', mode)
}

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
      <div class="mt-1 pb-2 mb-5 border-b-2">
        <p class="mx-auto text-center text-sm">
          Local IP address: {{props.local_ip}}
        </p>
        <p class="mx-auto text-center text-sm">
          Remote socket address: {{props.remote_sock_addr}}
        </p>
      </div>
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
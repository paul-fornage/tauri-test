<script setup lang="ts">
import { Mode } from '../types.ts'
import { invoke } from "@tauri-apps/api/core";
import { ref, onMounted } from 'vue';
import {Button} from "@/components/ui/button";
import SpinnerLoader from "./LoadingSpinner.vue";
import DarkModeSwitch from "@/components/DarkModeSwitch.vue";
import ModeToolbar from "@/components/ModeToolbar.vue";


const emit = defineEmits<{
  (e: 'modeChange', mode: Mode): void
}>()

const props = defineProps<{
  local_ip: string,
  remote_sock_addr: string
  is_connected: boolean,
}>();

async function modeChange(mode: Mode) {
  console.log("modeChange: " + mode)
  emit('modeChange', mode)
}



</script>

<template>
  <main>
    <ModeToolbar
        header-text="Home"
        :is-home="true"
        @homeClicked="() => {}"
    />
    <div class="h-10 flex w-full justify-end p-2">
      <DarkModeSwitch class="m-2"/>
    </div>
    <div class="flex pt-2">
      <img src="/mitusa-logo.png" class="logo mitusa mx-auto p-3" alt="Mitusa logo" />
    </div>
    <div class="">
      <h2 class="mx-auto mt-3 text-center text-4xl ">
        Select operating mode
      </h2>
      <div v-if="!is_connected" class="mt-1 pb-2 mb-5 border-b-2 flex flex-col">
        <SpinnerLoader
            class="mx-auto m-2"
            :loading="true" :size="32" color="#909090" />
        <p class="mx-auto text-center text-m">
          Connecting...
        </p>
      </div>

      <div v-if="is_connected" class="mt-1 pb-2 mb-5 border-b-2 flex">
        <p class="mx-auto text-center text-sm w-1/2">
          Local IP address: {{props.local_ip}}
        </p>
        <p class="mx-auto text-center text-sm w-1/2">
          Remote socket address: {{props.remote_sock_addr}}
        </p>
      </div>
    </div>

    <div class="flex gap-4 mx-4">
      <Button
          class="flex-1/3 h-32 text-4xl active:scale-95 active:bg-slate-700"
          @click="modeChange(Mode.Execute)"
          :disabled="!is_connected"
          variant="default">
        Execute
      </Button>
      <Button
          class="flex-1/3 h-32 text-4xl active:scale-95 active:bg-slate-700"
          @click="modeChange(Mode.Manual)"
          :disabled="!is_connected"
          variant="default">
        Manual
      </Button>
      <Button
          class="flex-1/3 h-32 text-4xl active:scale-95 active:bg-slate-700"
          @click="modeChange(Mode.CameraPreview)"
          :disabled="!is_connected"
          variant="default">
        Camera
      </Button>
    </div>
  </main>
</template>

<style scoped>

.logo.mitusa {
  transition: filter 0.1s ease-in-out;
}

.logo.mitusa:hover {
  filter: drop-shadow(0 0 2em #747bff);
}

.logo.mitusa:hover {
  filter: drop-shadow(0 0 2em #249b73);
}


</style>
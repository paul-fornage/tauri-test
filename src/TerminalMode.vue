<script setup lang="ts">
import { Mode } from './types';
import ModeToolbar from "./ModeToolbar.vue";
import {ref, computed, ComputedRef} from 'vue';
import {info} from "@tauri-apps/plugin-log";



const inputMessage = ref('');

const props = defineProps<{
  connectionInfo: string|null,
  tcpLog: string[],
}>();

const PORT = 8888;

const clientConnected: ComputedRef<boolean> = computed(() => {
  return props.connectionInfo !== null;
})

const emit = defineEmits<{
  (e: 'modeChange', mode: Mode): void
  (e: 'sendTcpMessage', message: string): void
}>();


async function homeClicked() {
  emit("modeChange", Mode.Home);
}

async function sendMessage() {
  const message_text: string = inputMessage.value + '\n'
  emit("sendTcpMessage", message_text);
  inputMessage.value = '';
}

</script>

<template>
  <div class="flex flex-col h-screen">
    <ModeToolbar
      header-text="Terminal Mode"
      @homeClicked="homeClicked"
    />
    <div class="flex-1 flex flex-col p-4">
      <div class="bg-gray-900 flex-1 rounded-lg p-4 font-mono text-green-400 overflow-y-auto">
        <div v-if="!clientConnected" class="text-yellow-400">
          Waiting for TCP connection on port {{ PORT }}...
        </div>
        <div v-else class="text-blue-400 mb-2">
          {{ connectionInfo }}
        </div>
        <div v-for="(message, index) in tcpLog" :key="index">
          {{ message }}
        </div>
      </div>
      <div class="mt-4 flex gap-2">
        <input
          v-model="inputMessage"
          type="text"
          class="flex-1 bg-gray-800 text-white px-4 py-2 rounded"
          placeholder="Type message..."
          :disabled="!clientConnected"
          @keyup.enter="sendMessage"
        />
        <button
          @click="sendMessage"
          :disabled="!clientConnected"
          class="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-500"
        >
          Send
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
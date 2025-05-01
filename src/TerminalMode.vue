<script setup lang="ts">
import { Mode } from './types';
import ModeToolbar from "./ModeToolbar.vue";
import { ref, onMounted, onUnmounted } from 'vue';
import { send, listen, bind, unbind, Payload } from "@kuyoonjo/tauri-plugin-tcp";

// Server side
const sid = 'unique-server-id';

const clientConnected = ref(false);
const clientIp = ref('');
const connectionInfo = ref("not connected");
const messages = ref<string[]>([]);
const inputMessage = ref('');

const PORT = 8888;

let intervalId: number;


const emit = defineEmits<{
  (e: 'modeChange', mode: Mode): void
}>();


async function homeClicked() {
  emit("modeChange", Mode.Home);
}

async function new_message_handler(payload: Payload) {
  console.log("new message: " + payload.event.message);
  messages.value.push(payload.event.message);
}

const sendMessage = async () => {
  if (clientConnected.value) {
    await send(sid, inputMessage.value);
    messages.value.push(inputMessage.value);
    inputMessage.value = '';
  }
}

onMounted(async () => {
  await bind(sid, '0.0.0.0:'+PORT);
  connectionInfo.value = "Waiting for connection";
  await listen((x) => {
    console.log(x.payload);
    if (x.payload.id === sid && x.payload.event.connect) {
      clientIp.value = x.payload.event.connect;
      connectionInfo.value = "Connected to " + clientIp.value;
      clientConnected.value = true;
    }
  });
  intervalId = setInterval(() => {
    listen((x) => {
      new_message_handler(x);
      if (x.payload.id === sid && x.payload.event.connect) {
        clientIp.value = x.payload.event.connect;
        connectionInfo.value = "Connected to " + clientIp.value;
        clientConnected.value = true;
      }
    })
    // You can add your actual logic here
  }, 10);
});

onUnmounted(async () => {
  await unbind(sid);
  connectionInfo.value = "not connected";
  clientIp.value = '';
  clientConnected.value = false;
  clearInterval(intervalId);

})

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
        <div v-for="(message, index) in messages" :key="index">
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
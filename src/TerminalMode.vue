<script setup lang="ts">
import { Mode } from './types';
import ModeToolbar from "./ModeToolbar.vue";
import { ref, onMounted, onUnmounted } from 'vue';
import { send, listen, bind, unbind, Payload } from "@kuyoonjo/tauri-plugin-tcp";
import { Event } from "@tauri-apps/api/event";

// Server side
const sid = 'unique-server-id';

const clientConnected = ref(false);
const connectionInfo = ref("not connected");
const messages = ref<string[]>([]);
const inputMessage = ref('');

const PORT = 8888;



const emit = defineEmits<{
  (e: 'modeChange', mode: Mode): void
}>();


async function homeClicked() {
  emit("modeChange", Mode.Home);
}

async function callback_handler(payload: Payload) {
  console.log("new callback: " + payload.event);
  if (payload.event.message) {
    const message_text: String = String.fromCharCode(...payload.event.message.data)
    console.log("message from " + payload.event.message.addr + ": " + message_text);
    messages.value.push(payload.event.message.addr + "->" + message_text);
  } else if (payload.event.connect) {
    console.log("connect: " + payload.event.connect);
    messages.value.push("connect: " + payload.event.connect);
  } else if (payload.event.disconnect) {
    console.log("disconnect: " + payload.event.disconnect);
    messages.value.push("disconnect: " + payload.event.disconnect);
  } else if (payload.event.bind) {
    console.log("bind: " + payload.event.bind);
    messages.value.push("bind: " + payload.event.bind);
  } else if (payload.event.unbind) {
    console.log("unbind: " + payload.event.unbind);
    messages.value.push("unbind: " + payload.event.unbind);
  } else {
    console.log("unkown event");
  }
}

const sendMessage = async () => {
  if (clientConnected.value) {
    await send(sid, inputMessage.value);
    messages.value.push(inputMessage.value);
    inputMessage.value = '';
  }
}

let unsubscribe: () => void | undefined;

onMounted(async () => {
  await bind(sid, '0.0.0.0:'+PORT);
  unsubscribe = await listen((x: Event<Payload>) => {
    callback_handler(x.payload);
  });
});

onUnmounted(async () => {
  await unbind(sid);
  if (unsubscribe) {
    unsubscribe();
  }
});


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
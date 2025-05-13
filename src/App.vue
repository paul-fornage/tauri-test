<script setup lang="ts">
import Home from "./Home.vue";
import ExecuteMode from "./ExecuteMode.vue";
import ManualMode from "./ManualMode.vue";
import CameraPreview from "./CameraPreview.vue";
import {info,} from '@tauri-apps/plugin-log';
import TerminalMode from "./TerminalMode.vue";
import {Actuator, Mode} from './types';
import {onMounted, onUnmounted, ref} from 'vue';
import {bind, listen, Payload, send, unbind} from "@kuyoonjo/tauri-plugin-tcp";
import {Event} from "@tauri-apps/api/event";
import {decodeMessage, encodeMessage, MessageHeader, MiTcpMessage, toString} from "./MiTcp.ts";


// Server side
const sid = 'unique-server-id';

const connectionInfo = ref<string|null>(null);



const TcpLog = ref<string[]>([]);

let sendInterval: number | undefined;

const PORT = 8888;

async function sendMiTcp(message: MiTcpMessage) {
  info("sending MiTcp message: " + message);
  const encoded_message = encodeMessage(message);
  await sendMessage(encoded_message);
}

async function callback_handler(payload: Payload) {
  info("new callback: " + payload.event);
  if (payload.event.message) {
    const mitcp_message: MiTcpMessage = decodeMessage(payload.event.message.data)
    info("message from " + payload.event.message.addr + ": " + toString(mitcp_message));
    TcpLog.value.push(payload.event.message.addr + "->" + toString(mitcp_message));
  } else if (payload.event.connect) {
    info("connect: " + payload.event.connect);
    TcpLog.value.push("connect: " + payload.event.connect);
    connectionInfo.value = payload.event.connect;
  } else if (payload.event.disconnect) {
    info("disconnect: " + payload.event.disconnect);
    TcpLog.value.push("disconnect: " + payload.event.disconnect);
    connectionInfo.value = null;
  } else if (payload.event.bind) {
    info("bind: " + payload.event.bind);
    TcpLog.value.push("bind: " + payload.event.bind);
  } else if (payload.event.unbind) {
    info("unbind: " + payload.event.unbind);
    TcpLog.value.push("unbind: " + payload.event.unbind);
  } else {
    info("unkown event");
  }
}

async function sendMessage(message_to_send: string|number[]) {
  if (connectionInfo.value !== null) {
    info("sending message: " + message_to_send);
    await send(sid, message_to_send, connectionInfo.value);
    TcpLog.value.push(connectionInfo.value + "<-" + message_to_send);
  } else {
    info("no connection to send message");
  }
}

let unsubscribe: () => void | undefined;

onMounted(async () => {
  await bind(sid, '0.0.0.0:'+PORT);
  unsubscribe = await listen((x: Event<Payload>) => {
    callback_handler(x.payload);
  });
  sendInterval = window.setInterval(() => {
    const message: MiTcpMessage = {
      header: MessageHeader.ReadRequest,
      target: "finger_state",
    }
    sendMiTcp(message).catch((err) => console.error('Failed to send message:', err));
  }, 1000);

});

onUnmounted(async () => {
  await unbind(sid);
  if (unsubscribe) {
    unsubscribe();
  }
  if (sendInterval) {
    clearInterval(sendInterval);
  }
});

const currentMode = ref<Mode>(Mode.Home);

function handleModeChange(mode: Mode) {
  currentMode.value = mode;
  info(`Switched to ${mode} mode`);
}

</script>

<template>
  <Home
      v-if="currentMode==Mode.Home"
      @mode-change="handleModeChange"></Home>
  <ExecuteMode
      v-if="currentMode==Mode.Execute"
      @mode-change="handleModeChange"></ExecuteMode>
  <ManualMode
      :finger_state="finger_state"
      :roller_state="roller_state"
      @sendMessage="sendMiTcp"
      v-if="currentMode==Mode.Manual"
      @mode-change="handleModeChange"></ManualMode>
  <CameraPreview
      v-if="currentMode==Mode.CameraPreview"
      @mode-change="handleModeChange"></CameraPreview>
  <TerminalMode
      :tcp-log="TcpLog"
      :connection-info="connectionInfo"
      @send-tcp-message="sendMessage"
      v-if="currentMode==Mode.Terminal"
      @mode-change="handleModeChange"></TerminalMode>
</template>


<style>
:root {
  font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;

  color: #0f0f0f;
  background-color: #f6f6f6;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
}

html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}

#app {
  height: 100%;
}


</style>
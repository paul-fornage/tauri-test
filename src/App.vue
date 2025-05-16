<script setup lang="ts">
import Home from "./Home.vue";
import ExecuteMode from "./ExecuteMode.vue";
import ManualMode from "./ManualMode.vue";
import CameraPreview from "./CameraPreview.vue";
import {info,warn} from '@tauri-apps/plugin-log';
import {Actuator, Mode} from './types';
import {onMounted, onUnmounted, ref} from 'vue';
import {Event} from "@tauri-apps/api/event";
import { invoke } from '@tauri-apps/api/core';
import * as Register from './RegisterDefinitions.ts';

// TODO: https://github.com/tauri-apps/plugins-workspace/tree/v2/plugins/autostart
// TODO: https://v2.tauri.app/plugin/updater/

const connectedSocket = ref<string>("Socket Address");
const local_ip_addr = ref<string>("Ip Address");
const is_connected = ref<boolean>(false);

const currentMode = ref<Mode>(Mode.Home);

async function check_connection() {
  try {
    const state_name = await invoke("get_connection_state_name");
    const connected: boolean = (state_name === "Connected");
    is_connected.value = connected;
    return connected
  } catch (err) {
    warn("get_connection_state_name returns error variant: " + err);
    is_connected.value = false;
    return false;
  }
}

async function reset_connection() {
  try {
    await invoke("reset_connection");
  } catch (err) {
    warn("reset_connection returns error variant: " + err);
  }
  if(await check_connection()){
    connectedSocket.value = await invoke("get_connected_socket_addr");
    return;
  } else {
    throw new Error("reset_connection succeeded, but check_connection failed. This should never happen.");
  }

}

onMounted(async () => {

  setInterval(async () => {
    local_ip_addr.value = await invoke("get_ip_addr");
  }, 10000);

  let isProcessing = false;


  setInterval(async () => {
    if (isProcessing){
      return;
    }

    isProcessing = true; // Mark as processing
    try {
      if(is_connected.value){
        try {
          await Register.read_coils();
        } catch(err) {
          warn("read_coils returns error variant: " + err);
          await check_connection();
        }
        try {
          await Register.read_hregs();
        } catch(err) {
          warn("read_hregs returns error variant: " + err);
          await check_connection();
        }
      } else {
        await reset_connection();
      }
    } catch (err) {
      warn("Unexpected error: " + err);
    } finally {
      isProcessing = false; // Mark as not processing
    }
  }, 50);


  await invoke("set_target_socket", {socket: "192.168.1.26:502"}).catch((err) => {warn("set_target_socket returns error variant: " + err);});
  await invoke("get_target_socket").then((sock) => {info("retreived sock: " + sock)}).catch((err) => {warn("get_target_socket returns error variant: " + err);});
})

function handleModeChange(mode: Mode) {
  currentMode.value = mode;
  info(`Switched to ${mode} mode`);
}

</script>

<template>
  <Home
      :is_connected="is_connected"
      :local_ip="local_ip_addr"
      :remote_sock_addr="connectedSocket"
      v-if="currentMode==Mode.Home"
      @mode-change="handleModeChange"></Home>
  <ExecuteMode
      v-if="currentMode==Mode.Execute"
      @mode-change="handleModeChange"></ExecuteMode>
  <ManualMode
      v-if="currentMode==Mode.Manual"
      @mode-change="handleModeChange"></ManualMode>
  <CameraPreview
      v-if="currentMode==Mode.CameraPreview"
      @mode-change="handleModeChange"></CameraPreview>
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
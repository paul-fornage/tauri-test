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


const connectedSocket = ref<string>("Socket Address");
const local_ip_addr = ref<string>("Ip Address");
const is_connected = ref<boolean>(false);

const currentMode = ref<Mode>(Mode.Home);

onMounted(async () => {

  setInterval(async () => {
    is_connected.value = ((await invoke("get_connection_state_name")) == "Connected");
    connectedSocket.value = await invoke("get_connected_socket_addr");
    local_ip_addr.value = await invoke("get_ip_addr");
    if (!is_connected.value) {
      warn("Not connected to socket, recconecting...");
      await invoke("reset_connection").then(() => {
        info("Reset connection success");
      }).catch((err) => {
        warn("Reset connection returns error variant: " + err);
      })
    }
  }, 200);

  setInterval(async () => {
    if(is_connected.value){
      Register.read_coils();
      Register.read_hregs();

      // Register.debug_print_coils();
    }
  }, 20);


  await invoke("set_target_socket", {socket: "192.168.1.26:502"}).catch((err) => {warn("set_target_socket returns error variant: " + err);});
  await invoke("get_target_socket").then((sock) => {info("retreived sock: " + sock)}).catch((err) => {warn("get_target_socket returns error variant: " + err);});

  await invoke("get_connection_state_name").then(async (state_name) => {
    // typeof state_name === "string"
    if (state_name === "Connected") {
      info("Already connected to socket");
    } else {
      info("Not connected to socket");
      await invoke("reset_connection").then(() => {
        info("Reset connection success");
      }).catch((err) => {
        warn("Reset connection returns error variant: " + err);
      })
    }
  })


})

function handleModeChange(mode: Mode) {
  currentMode.value = mode;
  info(`Switched to ${mode} mode`);
}

</script>

<template>
  <Home
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
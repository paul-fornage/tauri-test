<script setup lang="ts">
import Home from "./components/Home.vue";
import ExecuteMode from "./components/ExecuteMode.vue";
import ManualMode from "./components/ManualMode.vue";
import CameraPreview from "./components/CameraPreview.vue";
import {info,warn,error} from '@tauri-apps/plugin-log';
import {Actuator, Mode} from './types';
import {onMounted, onUnmounted, ref} from 'vue';
import {Event} from "@tauri-apps/api/event";
import { invoke } from '@tauri-apps/api/core';
import * as Register from './RegisterDefinitions.ts';
import LearnMode from "@/components/LearnMode.vue";


// TODO: https://v2.tauri.app/plugin/updater/
// TODO: Optimize for different viewports
// TODO: Organize file structure
// TODO: ESTOP FEEDBACK
// TODO: Icons everywhere

const connectedSocket = ref<string>("Socket Address");
const local_ip_addr = ref<string>("Ip Address");
const is_connected = ref<boolean>(false);

const currentMode = ref<Mode>(Mode.Home);

const last_heartbeat_time = ref<number>(0);




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
    return;
  }
  if(await check_connection()){
    connectedSocket.value = await invoke("get_connected_socket_addr");
    return;
  } else {
    throw new Error("reset_connection succeeded, but check_connection failed. This should never happen.");
  }
}

async function heartbeat() {
  const u16_time_now: number = Date.now()%65536;
  const last_time: number = Register.heartbeat_out.value.value;

  if(u16_time_now >= last_time){
    last_heartbeat_time.value = u16_time_now-last_time;
  } else {
    // local u16 rolled over, so add 2^16 to get the right difference
    last_heartbeat_time.value = u16_time_now + 65536 - last_time;
  }

  try{
    await Register.heartbeat_in.value.write_value(u16_time_now)
  } catch(err) {
    throw err;
  }


  if(last_heartbeat_time.value > 500){
    warn("Heartbeat took " + last_heartbeat_time.value + " ms");
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
          await Register.read_hregs();
          await heartbeat();
        } catch(err) {
          warn("read modbus returns error variant: " + err);
          await check_connection();
        }
        if (last_heartbeat_time.value > 1000){
          is_connected.value = false;
        }
      } else {
        if(currentMode.value !== Mode.Home){
          currentMode.value = Mode.Home;
        }
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
  if(is_connected.value) {
    currentMode.value = mode;
    info(`Switched to ${mode} mode`);
  } else {
    currentMode.value = Mode.Home;
    info("can't switch modes while not connected. Please connect first.");
  }


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
  <LearnMode
      v-if="currentMode==Mode.Learn"
      @mode-change="handleModeChange"></LearnMode>
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
  overflow: hidden;

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
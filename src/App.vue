<script setup lang="ts">
import Home from "./Home.vue";
import ExecuteMode from "./ExecuteMode.vue";
import ManualMode from "./ManualMode.vue";
import CameraPreview from "./CameraPreview.vue";
import {info,} from '@tauri-apps/plugin-log';
import {Actuator, Mode} from './types';
import {onMounted, onUnmounted, ref} from 'vue';
import {Event} from "@tauri-apps/api/event";
import Modbus from 'jsmodbus'
import { Socket, SocketConnectOpts } from 'net'

const socket = new Socket()

const options: SocketConnectOpts = {
  host: '192.168.1.17',
  port: 502
}
const client = new Modbus.client.TCP(socket)

let successCount = 0
let errorCount = 0
let reconnectCount = 0
let closedOnPurpose = false
let firstTime = true

const readStart = 0;
const readCount = 10;

const start = function () {
  console.log('Starting request...')

  client.readHoldingRegisters(readStart, readCount)
      .then(({ metrics, request, response }) => {
        successCount += 1

        console.log('Transfer Time: ' + metrics.transferTime)
        console.log('Response Body Payload: ' + response.body.valuesAsArray)
        console.log('Response Body Payload As Buffer: ' + response.body.valuesAsBuffer)

        console.log('Success', successCount, 'Errors', errorCount, 'Reconnect', reconnectCount)
        console.log('Request finished successfull.')

        setTimeout(start, 2000)
      })
      .catch(err => {
        console.error(err)
        errorCount += 1

        console.log('Success', successCount, 'Errors', errorCount, 'Reconnect', reconnectCount)

        console.log('Request finished Unsuccessfully.')
      })
}

socket.on('connect', function () {
  console.log('client connected.')
  isConnected.value = false

  if (firstTime) {
    firstTime = false
  } else {
    reconnectCount += 1
  }

  start()
})

const shutdown = () => {
  closedOnPurpose = true
  socket.end()
}

const reconnect = () => {
  if (!closedOnPurpose) {
    socket.connect(options)
  }
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)

socket.on('close', function () {
  console.log('Socket closed, stopping interval.')
  isConnected.value = false
  reconnect()
})

socket.on('error', function (err) {
  console.log('Socket Error', err)
})

const isConnected = ref<boolean>(false);


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
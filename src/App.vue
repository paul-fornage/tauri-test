<script setup lang="ts">
import { invoke } from "@tauri-apps/api/core";
import { Mode } from './types.ts'
import { ref } from 'vue';
import Home from "./Home.vue";
import ExecuteMode from "./ExecuteMode.vue";
import ManualMode from "./ManualMode.vue";
import CameraPreview from "./CameraPreview.vue";
import {
  warn,
  debug,
  trace,
  info,
  error,
  attachConsole,
  attachLogger,
} from '@tauri-apps/plugin-log';

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


</style>
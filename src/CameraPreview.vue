<script setup lang="ts">
import {Mode} from "./types.ts";
import {House} from "lucide-vue-next";
import { ref, onMounted, onUnmounted } from 'vue';
import ModeToolbar from "./ModeToolbar.vue";


const emit = defineEmits<{
  (e: 'modeChange', mode: Mode): void
}>()

const videoRef = ref<HTMLVideoElement | null>(null);
const stream = ref<MediaStream | null>(null);


async function homeClicked() {
  console.log("change to home")
  emit("modeChange", Mode.Home)
}

async function startWebcam() {
  try {
    stream.value = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false
    });

    if (videoRef.value) {
      videoRef.value.srcObject = stream.value;
    }
  } catch (err) {
    console.error('Error accessing webcam:', err);
  }
}

onMounted(() => {
  startWebcam();
});

onUnmounted(() => {
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop());
  }
});

</script>

<template>
  <ModeToolbar
      header-text="Camera Preview"
      @homeClicked="homeClicked"
  />
  <div class="w-full flex h-max">
    <video
        ref="videoRef"
        autoplay
        playsinline
        class="my-4 mx-auto"
    ></video>
  </div>

</template>

<style scoped>

</style>
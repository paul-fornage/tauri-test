<script setup lang="ts">
import {Mode} from "./types.ts";
import {House} from "lucide-vue-next";
import { ref, onMounted, onUnmounted } from 'vue';


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
  <div class="toolbar">
    <p class="my-auto p-8">
      Execute Mode
    </p>
    <button @click="homeClicked" class="flex-right my-auto padding-8px">
      <House class="icon"/>
      Home
    </button>
  </div>
  <div class="webcam-container">
    <video
        ref="videoRef"
        autoplay
        playsinline
        class="webcam-preview"
    ></video>
  </div>

</template>

<style scoped>
.padding-8px{
  padding: 8px;
}

.flex-right{
  margin-left: auto;
}
.my-auto{
  margin-top: auto;
  margin-bottom: auto;
}
.toolbar{
  display: flex;
  height: 50px;
  margin-bottom: auto;
  border-bottom: #2f2f2f 5px ridge;
}
.icon{
  width: 1cap;
  height: 1cap;
  margin: auto;
}

.webcam-container {
  width: 100%;
  max-width: 640px;
  margin: 1rem auto;
}

.webcam-preview {
  width: 100%;
  height: auto;
  border-radius: 8px;
  background-color: #000;
}

</style>
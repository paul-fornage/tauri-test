<script setup lang="ts">
import {Button} from "@/components/ui/button";
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { Minus, Plus } from 'lucide-vue-next';
import {JogDirection} from "@/types.ts";
import {info,error} from "@tauri-apps/plugin-log";
import * as Register from '../RegisterDefinitions.ts';

const props = defineProps<{
  direction: JogDirection;
}>();


// Function to handle the press (action to perform while holding)


// Start the action
function startAction() {

  if(props.direction === JogDirection.NEGATIVE) {
    info("Negative Jog button pressed");
    Register.is_jog_neg_pressed.value.write_value(true);
    Register.is_jog_pos_pressed.value.write_value(false);
  } else if(props.direction === JogDirection.POSITIVE) {
    info("Positive Jog button pressed");
    Register.is_jog_pos_pressed.value.write_value(true);
    Register.is_jog_neg_pressed.value.write_value(false);
  } else {
    error("Invalid jog direction");
  }
}

// Stop the action
function stopAction() {
  info(props.direction + " Jog button released");

  Register.is_jog_pos_pressed.value.write_value(false);
  Register.is_jog_neg_pressed.value.write_value(false);
}


onMounted(() => {
  window.addEventListener("mouseup", stopAction);
  window.addEventListener("touchend", stopAction);
});

onBeforeUnmount(() => {
  window.removeEventListener("mouseup", stopAction);
  window.removeEventListener("touchend", stopAction);
  stopAction();
});

</script>

<template>
  <Button
      class="flex select-none"
      @mousedown="startAction"
      @touchstart="startAction"
      @mouseup="stopAction"
      @touchend="stopAction">
    <Minus
        class="size-8"
        v-if="direction === JogDirection.NEGATIVE"/>
    <p class="flex-max m-2">
      Jog
    </p>
    <Plus
        class="size-8"
        v-if="direction === JogDirection.POSITIVE"/>
  </Button>
</template>

<style scoped>

</style>
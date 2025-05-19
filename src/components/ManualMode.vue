<script setup lang="ts">
import {ref} from 'vue';
import {Actuator, Mode} from '../types.ts'
import ModeToolbar from "./ModeToolbar.vue";
import {Button} from "@/components/ui/button";
import ActuatorButton from "./ActuatorButton.vue";
import {info} from "@tauri-apps/plugin-log";
import * as Register from '../RegisterDefinitions.ts';
import ManualJog from "@/components/ManualJog.vue";
import {Popover, PopoverTrigger, PopoverContent} from "@/components/ui/popover";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {Card, CardContent} from "@/components/ui/card";
import BooleanStatus from "@/components/BooleanStatus.vue";
import SpeedSelect from "@/components/SpeedSelect.vue";

const emit = defineEmits<{
  (e: 'modeChange', mode: Mode): void
}>()

async function homeClicked() {
  console.log("change to home")
  emit("modeChange", Mode.Home)
}

const maxCommandedPosition = 47;
const minCommandedPosition = 0;

const commanded_axis_position = ref<number>(0);







function toggleFingers() {
  if(Register.cc_commanded_fingers.value.value){
    Register.is_finger_up_latched.value.write_value(true);
    info("Fingers up latched")
  } else {
    Register.is_finger_down_latched.value.write_value(true);
    info("Fingers down latched")
  }
}

function toggleRoller() {
  if(Register.cc_commanded_roller.value.value){
    Register.is_roller_up_latched.value.write_value(true);
    info("Roller up latched")
  } else {
    Register.is_roller_down_latched.value.write_value(true);
    info("Roller down latched")
  }
}



</script>

<template>
  <ModeToolbar
      header-text="Manual Control"
      @homeClicked="homeClicked"
  />

  <div class="flex border-b-2 p-4 select-none">
    <div class="flex flex-col flex-1/4 mx-2">
      <BooleanStatus
          class="h-12 my-2"
          :state="Register.is_homed.value.value"
          true_text="Axis is homed"
          false_text="Axis not homed"/>
      <Button class="h-16 my-2 text-xl">
        {{ Register.is_homed.value.value ? 'Re-home axis' : 'Home carriage axis'}}
      </Button>
      <SpeedSelect
          text="Set jog speed"
          :value="1.2"
          :min="1"
          :max="100"
      />
    </div>

    <div class="flex flex-col flex-1/4 mx-2">
      <Button> Set job start to current position </Button>
      <Button> Set job end to current position </Button>
      <Button> Set job park to current position </Button>
    </div>
    <div class="flex flex-col flex-1/4 mx-2">
      <BooleanStatus
          class="h-12 my-2"
          :state="Register.is_mandrel_latch_closed.value.value"
          true_text="Mandrel latch closed and secured"
          false_text="Mandrel latch not secured"
      />
      <ActuatorButton
          actuatorName="Fingers"
          @clicked="toggleFingers()"
          :actuatorSensed="Register.is_fingers_down.value.value"
          :actuatorCommanded="Register.cc_commanded_fingers.value.value"
      />
      <ActuatorButton
          actuatorName="Roller"
          @clicked="toggleRoller()"
          :actuatorSensed="Register.is_roller_down.value.value"
          :actuatorCommanded="Register.cc_commanded_roller.value.value"
      />
    </div>
  </div>
  <div class="w-full flex">
    <Dialog class="">
      <DialogTrigger as-child>
        <Button class="mx-auto mt-2 text-2xl h-18" variant="default">
          Go to position...
        </Button>
      </DialogTrigger>
      <DialogContent class="">
        <ManualJog
            v-model="commanded_axis_position"
            :min-commanded-position="minCommandedPosition"
            :max-commanded-position="maxCommandedPosition" />
        <DialogFooter class="">
          <DialogClose as-child class="flex-1 h-20 text-3xl">
            <Button type="button" variant="destructive">
              Close
            </Button>
          </DialogClose>
          <Button class="flex-1 h-20 text-3xl bg-green-900 hover:bg-green-800 active:bg-green-700">
            Go
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<style scoped>

.nowrap{
  text-wrap: nowrap;
}


.debug{
  border: red 2px solid;
}



.axis-slider {
  -webkit-appearance: none;  /* Override default CSS styles */
  appearance: none;
  width: 90vw;
  margin: auto auto;
  justify-self: center;
  height: 25px; /* Specified height */
  background: #d3d3d3; /* Grey background */
  border-radius: 1rem;
  outline: none; /* Remove outline */
  opacity: 0.7; /* Set transparency (for mouse-over effects on hover) */
  -webkit-transition: .2s; /* 0.2 seconds transition on hover */
  transition: opacity .2s;
}

/* Mouse-over effects */
.axis-slider:hover {
  opacity: 1; /* Fully shown on mouse-over */
}

.axis-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background: #04AA6D;
  cursor: pointer;
}

.axis-slider::-moz-range-thumb {
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background: #04AA6D;
  cursor: pointer;
}

.axis-step{
  display: flex;
  flex-direction: row;
}


</style>
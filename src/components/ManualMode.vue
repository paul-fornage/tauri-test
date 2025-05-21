<script setup lang="ts">
import {ref, computed} from 'vue';
import {JogDirection, Mode} from '../types.ts'
import ModeToolbar from "./ModeToolbar.vue";
import {Button} from "@/components/ui/button";
import ActuatorButton from "./ActuatorButton.vue";
import {info} from "@tauri-apps/plugin-log";
import * as Register from '../RegisterDefinitions.ts';
import PositionSelect from "@/components/PositionSelect.vue";
import {Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger,} from '@/components/ui/dialog'
import BooleanStatus from "@/components/BooleanStatus.vue";
import SpeedSelect from "@/components/SpeedSelect.vue";
import LightCard from "@/components/LightCard.vue";
import JogButton from "@/components/JogButton.vue";
import PositionDisplay from "@/components/PositionDisplay.vue";
import {MAX_AXIS_POS, MIN_AXIS_POS} from "@/constants.ts"

const emit = defineEmits<{
  (e: 'modeChange', mode: Mode): void
}>()

async function homeClicked() {
  console.log("change to home")
  emit("modeChange", Mode.Home)
}

// TODO: half speed jog? maybe?


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

function submitJogSpeedHandler(new_val: number) {
  info("submit jog speed handler: " + new_val.toString());
  Register.jog_speed.value.write_value(new_val);
}

function submitPlanishSpeedHandler(new_val: number) {
  info("submit planish speed handler: " + new_val.toString());
  Register.planish_speed.value.write_value(new_val);
}



function homeAxisHandler() {
  Register.is_axis_homing_button_latched.value.write_value(true);
}

function manualJogAbsoluteSubmitHandler(position: number) {
  info("manual jog absolute button handler: " + position.toString());
  Register.hmi_commanded_position.value.write_value(position);
  Register.is_commanded_pos_latched.value.write_value(true);
}

</script>

<template>
  <ModeToolbar
      header-text="Manual Control"
      @homeClicked="homeClicked"
  />

  <div class="flex border-b-2 p-4 select-none">
    <div class="flex flex-col flex-1/4 mx-2">

      <LightCard class="border-2 border-slate-600 mb-1">
        <div class="flex-rox flex text-xl">
          <p class="flex-max mr-auto ml-4">
            Current jog speed:
          </p>
          <p class="ml-auto mr-2 flex-1 text-right text-slate-800 dark:text-slate-200 text-2xl font-bold">
            {{Register.jog_speed.value.value.toFixed(2)}}
          </p>
          <p class="mr-4 text-right">
            in/min
          </p>
        </div>

        <SpeedSelect
            text="Set new jog speed"
            :initial_value="Register.jog_speed.value.value"
            :min="1"
            :max="96"
            @submit="submitJogSpeedHandler"
        />
      </LightCard>
      <LightCard class="border-2 border-slate-600 my-1">
        <div class="flex-rox flex text-xl">
          <p class="flex-max mr-auto ml-4 ">
            Current planish speed:
          </p>
          <p class="ml-auto mr-2 flex-1 text-right text-slate-800 dark:text-slate-200 text-2xl font-bold">
            {{Register.planish_speed.value.value.toFixed(2)}}
          </p>
          <p class="mr-4 text-right">
            in/min
          </p>
        </div>
        <SpeedSelect
            text="Set new planish speed"
            :initial_value="Register.planish_speed.value.value"
            :min="1"
            :max="48"
            @submit="submitPlanishSpeedHandler"
        />
      </LightCard>

    </div>

    <div class="flex flex-col flex-1/4 mx-2 gap-2">
      <LightCard class="border-2 border-slate-600">
        <PositionDisplay
            v-if="Register.is_homed.value.value"
            :position-to-display="Register.cc_commanded_position.value.value" >
          <p>
            Current position
          </p>
        </PositionDisplay>
        <div v-else>
          <h1 class="text-slate-400 text-xl text-center">
            Home axis to see position
          </h1>
        </div>
      </LightCard>
    </div>
    <div class="flex flex-col flex-1/4 mx-2">
      <BooleanStatus
          class="mb-2"
          :state="Register.is_mandrel_latch_closed.value.value"
          true_text="Mandrel latch closed and secured"
          false_text="Mandrel latch not secured"
      />
      <ActuatorButton
          actuatorName="Carriage axis"
          @clicked="homeAxisHandler()"
          :actuatorSensed="Register.is_homed.value.value"
          :actuatorCommanded="Register.is_homing.value.value || Register.is_homed.value.value"
          true_text="Homed"
          false_text="Not homed"
          rising_text="Homing..."
          falling_text="Something has gone wrong"
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
  <div class="w-full flex mt-4">
    <JogButton
        class="mx-auto h-16 w-64 text-2xl"
        :direction="JogDirection.NEGATIVE" />
    <PositionSelect
        @submitNewPosition="manualJogAbsoluteSubmitHandler"
        :current-position="Register.cc_commanded_position.value.value"
        :min-commanded-position="MIN_AXIS_POS"
        :is-homed="Register.is_homed.value.value"
        :max-commanded-position="MAX_AXIS_POS" >
      Jog to absolute position
    </PositionSelect>
    <JogButton
        class="mx-auto h-16 w-64 text-2xl"
        :direction="JogDirection.POSITIVE" />
  </div>
</template>

<style scoped>
.debug{
  border: red 2px solid;
}
</style>
<script setup lang="ts">
import {ref, computed} from 'vue';
import {JogDirection, Mode} from '../types.ts'
import ModeToolbar from "./ModeToolbar.vue";
import {Button} from "@/components/ui/button";
import ActuatorButton from "./ActuatorButton.vue";
import {info, warn} from "@tauri-apps/plugin-log";
import * as Register from '../RegisterDefinitions.ts';
import PositionSelect from "@/components/PositionSelect.vue";
import {Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger,} from '@/components/ui/dialog'
import BooleanStatus from "@/components/BooleanStatus.vue";
import SpeedSelect from "@/components/SpeedSelect.vue";
import LightCard from "@/components/LightCard.vue";
import JogButton from "@/components/JogButton.vue";
import PositionDisplay from "@/components/PositionDisplay.vue";
import {MAX_AXIS_POS, MIN_AXIS_POS} from "@/constants.ts"
import ChevronButton from "@/components/ChevronButton.vue";
import SpeedManage from "@/components/SpeedManage.vue";
import CurrentPositionDisplay from "@/components/CurrentPositionDisplay.vue";
import AxisSlider from "@/components/AxisSlider.vue";
import AxisSliderDisplay from "@/components/AxisSliderDisplay.vue";

const emit = defineEmits<{
  (e: 'modeChange', mode: Mode): void
}>()

async function homeClicked() {
  console.log("change to home")
  emit("modeChange", Mode.Home)
}

// TODO: half speed jog? maybe?
// TODO: direct step jog
// TODO: slider position feedback
// TODO: feedback messages should be a popover and a lib

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

function manualStepJog(amount: number) {
  info("manual step jog button handler: " + amount.toString());
  let newPosition: number = Register.cc_commanded_position.value.value + amount;
  if(newPosition < MIN_AXIS_POS) {
    newPosition = MIN_AXIS_POS;
    warn("Manual step jog: position below min")
  } else if (newPosition > MAX_AXIS_POS) {
    newPosition = MAX_AXIS_POS;
    warn("Manual step jog: position above max")
  }
  Register.hmi_commanded_position.value.write_value(newPosition);
  Register.is_commanded_pos_latched.value.write_value(true);
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

  <LightCard class="flex p-4 select-none flex-row m-2">
    <div class="flex flex-col flex-1/4 mx-2 gap-2">

      <SpeedManage
          @submit-speed="(val: number) => Register.jog_speed.value.write_value(val)"
          :current-speed="Register.jog_speed.value.value"
          type="jog" />
      <SpeedManage
          @submit-speed="(val: number) => Register.planish_speed.value.write_value(val)"
          :current-speed="Register.planish_speed.value.value"
          type="planish" />

    </div>

    <div class="flex flex-col flex-1/4 mx-2 gap-2">
      <BooleanStatus
          class=""
          :state="Register.is_mandrel_latch_closed.value.value"
          true_text="Mandrel latch closed and secured"
          false_text="Mandrel latch not secured"
      />
      <LightCard class="border-2 border-slate-600 flex-1 py-0">
        <CurrentPositionDisplay
            :homed="Register.is_homed.value.value"
            :position-to-display="Register.cc_commanded_position.value.value" />

      </LightCard>
    </div>
    <div class="flex flex-col flex-1/4 mx-2 gap-2">
      <ActuatorButton
          class="flex-1/4"
          actuatorName="Carriage axis"
          @clicked="Register.is_axis_homing_button_latched.value.write_value(true)"
          :actuatorSensed="Register.is_homed.value.value"
          :actuatorCommanded="Register.is_homing.value.value || Register.is_homed.value.value"
          true_text="Homed"
          false_text="Not homed"
          rising_text="Homing..."
          falling_text="Something has gone wrong"
      />
      <ActuatorButton
          class="flex-1/4"
          actuatorName="Fingers"
          @clicked="toggleFingers()"
          :actuatorSensed="Register.is_fingers_down.value.value"
          :actuatorCommanded="Register.cc_commanded_fingers.value.value"
      />
      <ActuatorButton
          class="flex-1/4"
          actuatorName="Roller"
          @clicked="toggleRoller()"
          :actuatorSensed="Register.is_roller_down.value.value"
          :actuatorCommanded="Register.cc_commanded_roller.value.value"
      />
    </div>
  </LightCard>
  <LightCard class="gap-1 py-2 m-2">
    <h3 v-if="!Register.is_homed.value.value"
        class="text-2xl text-center">
      Home the carriage to jog
    </h3>
    <div class="w-full flex my-1">
      <JogButton
          :disabled="!Register.is_homed.value.value"
          class="mx-auto h-16 w-64 text-2xl"
          :direction="JogDirection.NEGATIVE" />
      <PositionSelect
          :disabled="!Register.is_homed.value.value"
          @submitNewPosition="manualJogAbsoluteSubmitHandler"
          :current-position="Register.cc_commanded_position.value.value"
          :min-commanded-position="MIN_AXIS_POS"
          :is-homed="Register.is_homed.value.value"
          :max-commanded-position="MAX_AXIS_POS" >
        Jog to absolute position
      </PositionSelect>
      <JogButton
          :disabled="!Register.is_homed.value.value"
          class="mx-auto h-16 w-64 text-2xl"
          :direction="JogDirection.POSITIVE" />
    </div>
  </LightCard>
  <LightCard class="flex m-2 gap-1 py-2 px-8">
    <div class="flex h-10">
      <div class="m-auto text-xl px-4">
        {{ MIN_AXIS_POS }}
      </div>
<!--      TODO: add a commanded and actual pos thumb. also make the bounds line up + notches   -->
      <AxisSliderDisplay
          :model-value="[Register.cc_commanded_position.value.value]"
          :min="MIN_AXIS_POS"
          :max="MAX_AXIS_POS"
          :disable-thumb="!Register.is_homed.value.value"
          :disabled="true"
          :step="0.01"
          class="flex-1"
      />
      <div class="m-auto text-xl px-4">
        {{ MAX_AXIS_POS }}
      </div>
    </div>
  </LightCard>
  <LightCard class="flex m-2 gap-1 py-2">
    <div class="mt-1 flex gap-3 flex-row px-3">
      <ChevronButton @click="manualStepJog(-1)" variant="l3" :disabled="!Register.is_homed.value.value" />
      <ChevronButton @click="manualStepJog(-0.1)" variant="l2" :disabled="!Register.is_homed.value.value" />
      <ChevronButton @click="manualStepJog(-0.01)" variant="l1" :disabled="!Register.is_homed.value.value" />
      <ChevronButton @click="manualStepJog(0.01)" variant="r1" :disabled="!Register.is_homed.value.value" />
      <ChevronButton @click="manualStepJog(0.1)" variant="r2" :disabled="!Register.is_homed.value.value" />
      <ChevronButton @click="manualStepJog(1)" variant="r3" :disabled="!Register.is_homed.value.value" />
    </div>
  </LightCard>
</template>

<style scoped>
.debug{
  border: red 2px solid;
}
</style>
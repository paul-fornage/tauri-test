<script setup lang="ts">
import {Mode, JobStatusMessage, JobStatus} from '../types.ts'
import ModeToolbar from "./ModeToolbar.vue";
import LightCard from "@/components/LightCard.vue";
import {computed} from "vue";
import * as Register from "@/RegisterDefinitions.ts";
import {Button} from "@/components/ui/button";
import ActuatorButton from "@/components/ActuatorButton.vue";
import BooleanStatus from "@/components/BooleanStatus.vue";
import {info} from "@tauri-apps/plugin-log";
import { Play, Pause, X, TriangleAlert, Check, OctagonX } from 'lucide-vue-next';
import {cn} from "@/lib/utils.ts";
import SpeedSelect from "@/components/SpeedSelect.vue";


const emit = defineEmits<{
  (e: 'modeChange', mode: Mode): void
}>()
async function homeClicked() {
  console.log("change to home")
  emit("modeChange", Mode.Home)
}


const status = computed<JobStatusMessage>(() => {
  if(Register.is_job_paused.value.value) {
    return {text: "Job paused", job_status: JobStatus.Paused}
  }
  if(Register.is_job_active.value.value) {
    return {text: "Job running", job_status: JobStatus.Running}
  }
  if(!Register.is_homed.value.value) {
    return {text: "Home axis to start", job_status: JobStatus.NotReady}
  }
  if(!Register.is_mandrel_latch_closed.value.value) {
    return {text: "Secure mandrel latch to start", job_status: JobStatus.NotReady}
  }
  if(!(Register.is_fingers_down.value.value && Register.cc_commanded_fingers.value.value)) {
    return {text: "Lower fingers to start", job_status: JobStatus.NotReady}
  }
  if(Register.is_roller_down.value.value || Register.cc_commanded_roller.value.value) {
    return {text: "Raise roller to start", job_status: JobStatus.NotReady}
  }
  return {text: "Ready to start job", job_status: JobStatus.Ready}
});


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

function homeAxisHandler() {
  Register.is_axis_homing_button_latched.value.write_value(true);
}

const colorClass = computed<string>(() => {
  switch (status.value.job_status) {
    case JobStatus.Ready:
      return "text-green-900 border-green-800 dark:text-green-700"
    case JobStatus.NotReady:
      return "text-red-900 border-red-800 dark:text-red-700"
    case JobStatus.Paused:
      return "text-slate-700 border-slate-600 dark:text-slate-700"
    case JobStatus.Running:
      return "text-slate-700 border-blue-800 dark:text-slate-700"
    default:
      return "text-slate-900 border-slate-800 dark:text-slate-700"
  }
})

</script>

<template>
  <ModeToolbar
      header-text="Execute mode"
      @homeClicked="homeClicked"
  />
  <LightCard class="mx-2">
    <div class="flex-row mx-2 flex-1 flex gap-2">
      <Button
          @click="Register.is_cancel_cycle_button_latched.value.write_value(true)"
          :disabled="!Register.is_job_active.value.value"
          class="border-4 flex-1 h-16 text-2xl border-red-700">
        <OctagonX class="size-6"/>
        Cancel
      </Button>
      <Button
          @click="Register.is_pause_cycle_button_latched.value.write_value(true)"
          :disabled="!Register.is_job_active.value.value"
          class="border-4 flex-1 h-16 text-2xl border-slate-600">
        <Pause class="size-6"/>
        {{ status.job_status == JobStatus.Paused ? 'Paused' : 'Pause' }}
      </Button>
      <Button
          @click="Register.is_start_cycle_button_latched.value.write_value(true)"
          :disabled="!(status.job_status == JobStatus.Paused || status.job_status == JobStatus.Ready)"
          class="border-4 flex-1 h-16 text-2xl border-green-600">
        <Play class="size-6"/>
        {{ status.job_status == JobStatus.Paused ? 'Resume' : 'Start' }}
      </Button>
      <div :class="cn('text-center text-lg font-bold m-auto border-2 px-8 py-2 rounded-lg flex gap-4', colorClass)">
        <Check class="m-auto size-6" v-if="status.job_status == JobStatus.Ready"/>
        <TriangleAlert class="m-2" v-if="status.job_status == JobStatus.NotReady"/>
        <Pause class="m-2" v-if="status.job_status == JobStatus.Paused"/>
        <Play class="m-2" v-if="status.job_status == JobStatus.Running"/>
        <p class="">
          {{ status.text }}
        </p>
      </div>
    </div>
  </LightCard>
  <LightCard class="flex-row mx-2">
    <div class="flex flex-col flex-1/3 mx-2">
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
      <div class="flex-col gap-2">
        <div class="border-2 border-slate-600 rounded-lg flex-col flex flex-1 my-1">
          <div class="flex-row flex text-lg">
            <p class="flex-1 mr-auto ml-1">
              Jog speed:
            </p>
            <div class="ml-auto mr-1 flex">
              <p class="text-slate-800 dark:text-slate-200 text-2xl font-bold text-right">
                {{Register.jog_speed.value.value.toFixed(2)}}
              </p>
              <p class="text-sm text-right m-1 mt-auto">
                in/min
              </p>
            </div>

          </div>
          <SpeedSelect
              class="mx-1 h-12 text-lg mb-1"
              text="Edit Jog speed"
              :initial_value="Register.jog_speed.value.value"
              :min="1"
              :max="96"
              @submit="Register.jog_speed.value.write_value"
          />
        </div>
        <div class="border-2 border-slate-600 rounded-lg flex-col flex flex-1 my-1">
          <div class="flex-row flex text-lg">
            <p class="flex-max mr-auto ml-1">
              Planish speed:
            </p>
            <div class="ml-auto mr-1 flex">
              <p class="text-slate-800 dark:text-slate-200 text-2xl font-bold text-right">
                {{Register.planish_speed.value.value.toFixed(2)}}
              </p>
              <p class="text-sm text-right m-1 mt-auto">
                in/min
              </p>
            </div>

          </div>
          <SpeedSelect
              class="mx-1 h-12 text-lg mb-1"
              text="Edit Planish speed"
              :initial_value="Register.planish_speed.value.value"
              :min="1"
              :max="48"
              @submit="Register.planish_speed.value.write_value"
          />
        </div>
      </div>
    </div>
    <div class="flex flex-col flex-2/3 mx-2">

    </div>
  </LightCard>

</template>

<style scoped>


</style>
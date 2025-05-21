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
import JobStatusIndicator from "@/components/JobStatusIndicator.vue";


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

</script>

<template>
  <ModeToolbar
      header-text="Execute mode"
      @homeClicked="homeClicked"
  />
  <LightCard class="mx-2">
    <JobStatusIndicator :status="status" />
    <div class="flex-row mx-2 flex-1 flex gap-2">
      <Button
          @click="Register.is_start_cycle_button_latched.value.write_value(true)"
          :disabled="!(status.job_status == JobStatus.Paused || status.job_status == JobStatus.Ready)"
          class="border-4 flex-1 h-16 text-2xl border-green-600">
        <Play />
        {{ status.job_status == JobStatus.Paused ? 'Resume' : 'Start' }}
      </Button>
      <Button
          @click="Register.is_pause_cycle_button_latched.value.write_value(true)"
          :disabled="!Register.is_job_active.value.value"
          class="border-4 flex-1 h-16 text-2xl border-slate-600">
        <Pause />
        {{ status.job_status == JobStatus.Paused ? 'Paused' : 'Pause' }}
      </Button>
      <Button
          @click="Register.is_cancel_cycle_button_latched.value.write_value(true)"
          :disabled="!Register.is_job_active.value.value"
          class="border-4 flex-1 h-16 text-2xl border-red-700">
        <OctagonX />
        Stop
      </Button>
    </div>
  </LightCard>
  <LightCard class="flex-row mx-2">
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
    <div class="flex flex-col flex-1/4 mx-2">

    </div>
    <div class="flex flex-col flex-1/4 mx-2">

    </div>
  </LightCard>

</template>

<style scoped>


</style>
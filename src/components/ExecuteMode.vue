<script setup lang="ts">
import {Mode, JobStatusMessage, JobStatus} from '../types.ts'
import ModeToolbar from "./ModeToolbar.vue";
import LightCard from "@/components/LightCard.vue";
import {computed, ref} from "vue";
import * as Register from "@/RegisterDefinitions.ts";
import {Button} from "@/components/ui/button";
import ActuatorButton from "@/components/ActuatorButton.vue";
import BooleanStatus from "@/components/BooleanStatus.vue";
import {info} from "@tauri-apps/plugin-log";
import { Play, Pause, X, TriangleAlert, Check, OctagonX } from 'lucide-vue-next';
import {cn} from "@/lib/utils.ts";
import SpeedSelect from "@/components/SpeedSelect.vue";
import {Progress} from "@/components/ui/progress";
import {ActiveJob, getPhaseInfos, getTotalProgress} from "@/active_job.ts";
import JobPhaseList from "@/components/JobPhaseList.vue";
import SpeedManage from "@/components/SpeedManage.vue";


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

function toggleDualPass() {
  if(Register.is_dual_pass_mode.value.value) {
    Register.is_dual_pass_mode.value.write_value(false);
  } else {
    Register.is_dual_pass_mode.value.write_value(true);
  }
}

const loadedJob = computed<ActiveJob>(()=>{
  return {
    pre_start_position: Register.is_job_active.value.value
        ? Register.job_pre_start_pos.value.value
        : Register.cc_commanded_position.value.value,
    start_position: Register.job_start_pos.value.value,
    end_position: Register.job_end_pos.value.value,
    park_position: Register.job_park_pos.value.value,
    is_dual_pass: Register.is_dual_pass_mode.value.value,
    current_phase: Register.job_progress.value.value,
    current_position: Register.cc_commanded_position.value.value,
  }
})

const totalProgress = computed<number>(()=>{
  if(!Register.is_job_active.value.value) {
    return 0;
  }
  return getTotalProgress(loadedJob.value);
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
          class="border-4 flex-1/5 h-16 text-2xl border-red-700">
        <OctagonX class="size-6"/>
        Cancel
      </Button>
      <Button
          @click="Register.is_pause_cycle_button_latched.value.write_value(true)"
          :disabled="!Register.is_job_active.value.value"
          class="border-4 flex-1/5 h-16 text-2xl border-slate-600">
        <Pause class="size-6"/>
        {{ status.job_status == JobStatus.Paused ? 'Paused' : 'Pause' }}
      </Button>
      <Button
          @click="Register.is_start_cycle_button_latched.value.write_value(true)"
          :disabled="!(status.job_status == JobStatus.Paused || status.job_status == JobStatus.Ready)"
          class="border-4 flex-1/5 h-16 text-2xl border-green-600">
        <Play class="size-6"/>
        {{ status.job_status == JobStatus.Paused ? 'Resume' : 'Start' }}
      </Button>
      <ActuatorButton
          class="flex-1/5 h-16 my-0"
          actuatorName="Dual-pass mode"
          @clicked="toggleDualPass"
          :actuatorSensed="Register.is_dual_pass_mode.value.value"
          :actuatorCommanded="Register.is_dual_pass_mode.value.value"
          true_text="On"
          false_text="Off"
          rising_text=""
          falling_text=""
      />
      <div :class="cn('h-16 text-center text-lg font-bold m-auto border-2 py-2 px-2 rounded-lg flex flex-1/5', colorClass)">
        <Check class="m-auto size-6" v-if="status.job_status == JobStatus.Ready"/>
        <TriangleAlert class="m-auto size-6" v-if="status.job_status == JobStatus.NotReady"/>
        <Pause class="m-auto size-6" v-if="status.job_status == JobStatus.Paused"/>
        <Play class="m-auto size-6" v-if="status.job_status == JobStatus.Running"/>
        <p class="my-auto mr-auto text-nowrap">
          {{ status.text }}
        </p>
      </div>
    </div>
  </LightCard>
  <LightCard class="flex-row mx-2">
    <div class="flex flex-col flex-1/4 mb-2 gap-1">
      <BooleanStatus
          class=""
          :state="Register.is_mandrel_latch_closed.value.value"
          true_text="Mandrel latch closed and secured"
          false_text="Mandrel latch not secured"
      />
      <ActuatorButton
          class="flex-1/6"
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
          class="flex-1/6"
          actuatorName="Fingers"
          @clicked="toggleFingers()"
          :actuatorSensed="Register.is_fingers_down.value.value"
          :actuatorCommanded="Register.cc_commanded_fingers.value.value"
      />
      <ActuatorButton
          class="flex-1/6"
          actuatorName="Roller"
          @clicked="toggleRoller()"
          :actuatorSensed="Register.is_roller_down.value.value"
          :actuatorCommanded="Register.cc_commanded_roller.value.value"
      />
      <SpeedManage
          class="flex-1/6"
          @submit-speed="(val: number) => Register.jog_speed.value.write_value(val)"
          :current-speed="Register.jog_speed.value.value"
          type="jog" />
      <SpeedManage
          class="flex-1/6"
          @submit-speed="(val: number) => Register.planish_speed.value.write_value(val)"
          :current-speed="Register.planish_speed.value.value"
          type="planish" />
    </div>
    <div class="flex flex-col flex-2/3 mx-4">
      <div class="flex">
        <h3 class="ml-auto mr-2 text-lg">
          Progress:
        </h3>
        <h3 class="mr-auto ml-2 text-xl font-bold">
          {{(totalProgress*100).toFixed(1) + '%'}}
        </h3>
      </div>

      <Progress
          :max="100"
          :model-value="totalProgress*100" />
      <JobPhaseList :job-phases="getPhaseInfos(loadedJob)" />
    </div>
  </LightCard>

</template>

<style scoped>


</style>
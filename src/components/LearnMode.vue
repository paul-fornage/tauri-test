<script setup lang="ts">
import ModeToolbar from "@/components/ModeToolbar.vue";
import {JogDirection, Mode, PositionType} from "@/types.ts";
import LightCard from "@/components/LightCard.vue";
import * as Register from "@/RegisterDefinitions.ts";
import PositionDisplay from "@/components/PositionDisplay.vue";
import {computed, ref} from "vue";
import {Button} from "@/components/ui/button";
import {Pencil, Save, X, ArrowDownToLine, ArrowUpFromLine} from 'lucide-vue-next';
import JobPosition from "@/components/JobPosition.vue";
import {error, info} from "@tauri-apps/plugin-log";
import { open, save } from '@tauri-apps/plugin-dialog';
import { readTextFile, writeTextFile, BaseDirectory } from '@tauri-apps/plugin-fs';
import {MAX_AXIS_POS, MIN_AXIS_POS} from "@/constants.ts";
import PositionSelect from "@/components/PositionSelect.vue";
import JogButton from "@/components/JogButton.vue";
import CurrentPositionDisplay from "@/components/CurrentPositionDisplay.vue";



const emit = defineEmits<{
  (e: 'modeChange', mode: Mode): void
}>()

async function homeClicked() {
  console.log("change to home")
  emit("modeChange", Mode.Home)
}

const local_temp_start_pos = ref<number>(Register.job_start_pos.value.value);
const local_temp_end_pos = ref<number>(Register.job_end_pos.value.value);
const local_temp_park_pos = ref<number>(Register.job_park_pos.value.value);

function resetToCurrentHandler() {
  local_temp_start_pos.value = Register.job_start_pos.value.value;
  local_temp_end_pos.value = Register.job_end_pos.value.value;
  local_temp_park_pos.value = Register.job_park_pos.value.value;
}

const EPSILON = 0.000001; // Precision of machine is 0.01, so this is safe

const isUnsavedChanges = computed<boolean>(() => {
  const isStartDiff = Math.abs(local_temp_start_pos.value - Register.job_start_pos.value.value) > EPSILON;
  const isEndDiff = Math.abs(local_temp_end_pos.value - Register.job_end_pos.value.value) > EPSILON;
  const isParkDiff = Math.abs(local_temp_park_pos.value - Register.job_park_pos.value.value) > EPSILON;

  return isStartDiff || isEndDiff || isParkDiff;
})


function submitPosHandler(new_pos: number, position_type: PositionType) {
  switch (position_type) {
    case PositionType.Start:
      local_temp_start_pos.value = new_pos;
      return;
    case PositionType.End:
      local_temp_end_pos.value = new_pos;
      return;
    case PositionType.Park:
      local_temp_park_pos.value = new_pos;
      return;
  }
}

function saveJobHandler() {
  Register.hmi_job_start_pos.value.write_value(local_temp_start_pos.value);
  Register.hmi_job_end_pos.value.write_value(local_temp_end_pos.value);
  Register.hmi_job_park_pos.value.write_value(local_temp_park_pos.value);
  Register.is_commit_job_button_latched.value.write_value(true);
}

function manualJogAbsoluteSubmitHandler(position: number) {
  info("manual jog absolute button handler: " + position.toString());
  Register.hmi_commanded_position.value.write_value(position);
  Register.is_commanded_pos_latched.value.write_value(true);
}

interface JobFile {
  mitusa_planisher_job: {
    schema_version: string;
    start_position: number;
    end_position: number;
    park_position: number;
  }
}

async function saveJobToDiskHandler() {
  const jobData: JobFile = {
    mitusa_planisher_job: {
      schema_version: "0.0.1",
      start_position: local_temp_start_pos.value,
      end_position: local_temp_end_pos.value,
      park_position: local_temp_park_pos.value
    }
  };

  try {
    // Convert to JSON string
    const jsonString = JSON.stringify(jobData, null, 2);


    const filePath = await save({
      filters: [{
        name: 'Job File',
        extensions: ['json']
      }]
    });

    if (filePath) {
      await writeTextFile(filePath, jsonString, {
        baseDir: BaseDirectory.Document,
      });
      info("Job saved successfully to " + filePath);
    }
  } catch (err) {
    error("Failed to save job: " + err);
  }
}

async function loadJobFromDiskHandler() {
  try {
    // Use Tauri's dialog to open file


    const filePath = await open({
      filters: [{
        name: 'Job File',
        extensions: ['json']
      }]
    });

    if (filePath) {
      const contents = await readTextFile(filePath as string, {
        baseDir: BaseDirectory.Document,
      });
      const jobData = JSON.parse(contents) as JobFile;

      // Validate schema version
      if (jobData.mitusa_planisher_job?.schema_version !== "0.0.1") {
        throw new Error("Unsupported job file version");
      }

      // Update local values
      local_temp_start_pos.value = jobData.mitusa_planisher_job.start_position;
      local_temp_end_pos.value = jobData.mitusa_planisher_job.end_position;
      local_temp_park_pos.value = jobData.mitusa_planisher_job.park_position;

      info("Job loaded successfully from " + filePath);
    }
  } catch (err) {
    error("Failed to load job: " + err);
  }
}


</script>

<template>
  <ModeToolbar
      header-text="Edit job"
      @homeClicked="homeClicked"
  />
  <LightCard class="m-2 p-2 border-2"> <!-- Saved job display -->
    <h1 class="text-center text-2xl">
      Current saved job
    </h1>
    <div class="flex gap-4">
      <PositionDisplay
          class="border-2 border-slate-300 rounded-lg flex-1"
          :position-to-display="Register.job_start_pos.value.value" >
        <p class="mr-4">
          Start position
        </p>
      </PositionDisplay>
      <PositionDisplay
          class="border-2 border-slate-300 rounded-lg flex-1"
          :position-to-display="Register.job_end_pos.value.value" >
        <p class="mr-4">
          End position
        </p>
      </PositionDisplay>
      <PositionDisplay
          class="border-2 border-slate-300 rounded-lg flex-1"
          :position-to-display="Register.job_park_pos.value.value" >
        <p class="mr-4">
          Park position
        </p>
      </PositionDisplay>
    </div>
  </LightCard> <!-- /Saved job display -->
  <LightCard
      class="m-2 gap-2 py-2 border-2">
    <div class="flex h-12">
      <div
          class="flex-1"
          v-if="isUnsavedChanges">
        <h3 class="text-center text-xl m-auto border-4 rounded-lg border-orange-500 bg-orange-300 w-min text-nowrap p-1">
          Unsaved changes
        </h3>
      </div>
      <h1 v-else
          class="text-center text-2xl my-auto flex-1">
        Modified job
      </h1>
    </div>


    <div class="flex gap-4 p-2 m-2">
      <JobPosition
          class="flex-1"
          :pos="local_temp_start_pos"
          :position_type="PositionType.Start"
          @submit="(num) => {submitPosHandler(num, PositionType.Start)}" />
      <JobPosition
          class="flex-1"
          :pos="local_temp_end_pos"
          :position_type="PositionType.End"
          @submit="(num) => {submitPosHandler(num, PositionType.End)}" />
      <JobPosition
          class="flex-1"
          :pos="local_temp_park_pos"
          :position_type="PositionType.Park"
          @submit="(num) => {submitPosHandler(num, PositionType.Park)}" />
    </div>
    <div class="flex gap-4 p-2 m-2">
      <Button
          class="flex-1 text-xl h-12"
          @click="resetToCurrentHandler">
        <X />
        Reset
      </Button>
      <Button
          class="flex-1 text-xl h-12"
          @click="loadJobFromDiskHandler">
        <ArrowUpFromLine />
        Upload from disk
      </Button>
      <Button
          class="flex-1 text-xl h-12"
          @click="saveJobToDiskHandler">
        <ArrowDownToLine />
        Download to disk
      </Button>
      <Button
          class="flex-1 text-xl h-12"
          @click="saveJobHandler">
        <Save />
        Save job
      </Button>
    </div>
  </LightCard>
  <LightCard class="flex-row mt-2 mx-2 px-2 gap-3">
    <JogButton
        :disabled="!Register.is_homed.value.value"
        class="mx-auto h-16 w-64 text-2xl flex-1/4"
        :direction="JogDirection.NEGATIVE" />
    <div class="border-2 rounded-lg flex-1/4">
      <CurrentPositionDisplay
          :homed="Register.is_homed.value.value"
          :position-to-display="Register.cc_commanded_position.value.value" />
    </div>

    <PositionSelect
        :disabled="!Register.is_homed.value.value"
        class="flex-1/4"
        @submitNewPosition="manualJogAbsoluteSubmitHandler"
        :current-position="Register.cc_commanded_position.value.value"
        :min-commanded-position="MIN_AXIS_POS"
        :is-homed="Register.is_homed.value.value"
        :max-commanded-position="MAX_AXIS_POS" >
      Jog to absolute position
    </PositionSelect>
    <JogButton
        :disabled="!Register.is_homed.value.value"
        class="mx-auto h-16 w-64 text-2xl flex-1/4"
        :direction="JogDirection.POSITIVE" />
  </LightCard>

</template>

<style scoped>

</style>
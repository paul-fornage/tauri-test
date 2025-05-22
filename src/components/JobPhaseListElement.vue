<script setup lang="ts">
import {JobStateLookup, PhaseWorkingStatus} from "@/types.ts";
import ProgressCircle from "@/components/ProgressCircle.vue";
import CheckboxDisplay from "@/components/CheckboxDisplay.vue";
import {computed, ref, shallowRef, watch} from "vue";
import {JobPhaseInfo} from "@/active_job.ts";
import {info} from "@tauri-apps/plugin-log";


const props = defineProps<JobPhaseInfo>();

const boxRef = shallowRef<HTMLElement | null>(null);


function scrollHere() {
  boxRef.value?.scrollIntoView({behavior: "smooth", block: "center"});
}

watch(() => props.isActive, (newValue, oldValue) => {
  if (newValue && !oldValue) {
    scrollHere();
  }
}, { immediate: false });





const phaseWorkingStatus = computed<PhaseWorkingStatus>(() => {
  if (props.isActive) {
    return PhaseWorkingStatus.Working;
  } else if (props.progress == 1) {
    return PhaseWorkingStatus.Done;
  } else {
    return PhaseWorkingStatus.NotStarted;
  }
});

const phaseColor = computed<string>(() => {
  switch (phaseWorkingStatus.value) {
    case PhaseWorkingStatus.NotStarted:
      return "slate-400";
    case PhaseWorkingStatus.Working:
      return "slate-600";
    case PhaseWorkingStatus.Done:
      return "green-700";
  }
});

const phaseStrokeColor = computed<string>(() => {
  return "stroke-" + phaseColor.value;
});
const phaseTextColor = computed<string>(() => {
  return "text-" + phaseColor.value;
});
</script>

<template>
  <div class="flex h-16 p-2" ref="boxRef">
    <ProgressCircle v-if="typeof props.progress == 'number'"
                    size="3rem"
                    :max="1" :value="props.progress" :percentage="true" />
    <CheckboxDisplay v-else
                     :class="['size-12 my-auto', phaseStrokeColor]"
                     :state="phaseWorkingStatus" />
    <h3 :class="['my-auto text-4xl ml-3', phaseTextColor]">
      {{props.title}}
    </h3>
  </div>

  <div v-if="props.phase !== JobStateLookup.JogToPark" class="border-b-2 border-slate-500 w-full"></div>
</template>
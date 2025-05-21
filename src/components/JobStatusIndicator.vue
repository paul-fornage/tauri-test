<script setup lang="ts">

import {JobStatusMessage, JobStatus} from "@/types.ts";
import {Check, Pause, TriangleAlert, Play} from "lucide-vue-next";
import {cn} from "@/lib/utils.ts";
import {computed} from "vue";

const props = defineProps<{
  status: JobStatusMessage
}>();

const colorClass = computed<string>(() => {
  switch (props.status.job_status) {
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
  <div :class="cn('text-center text-lg font-bold m-auto border-2 px-4 py-1 rounded-lg flex', colorClass)">
    <Check class="m-2" v-if="status.job_status == JobStatus.Ready"/>
    <TriangleAlert class="m-2" v-if="status.job_status == JobStatus.NotReady"/>
    <Pause class="m-2" v-if="status.job_status == JobStatus.Paused"/>
    <Play class="m-2" v-if="status.job_status == JobStatus.Running"/>
    <p class="m-2">
      {{ status.text }}
    </p>
  </div>
</template>

<style scoped>

</style>
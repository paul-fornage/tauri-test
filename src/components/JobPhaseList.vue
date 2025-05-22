<script setup lang="ts">
import {JobPhaseInfo} from "@/active_job.ts"
import {ScrollArea} from '@/components/ui/scroll-area'
import JobPhaseListElement from "@/components/JobPhaseListElement.vue";

const props = defineProps<{
  jobPhases: JobPhaseInfo[],
}>();





</script>

<template>
  <ScrollArea
      class="border-2 border-slate-500 rounded-lg m-2 mt-4 h-96">
    <div v-for="phase of props.jobPhases">
      <JobPhaseListElement
          :phase="phase.phase"
          :title="phase.title"
          :progress="phase.progress"
          :is-active="phase.isActive" />
    </div>

  </ScrollArea>
</template>

<style scoped>

</style>
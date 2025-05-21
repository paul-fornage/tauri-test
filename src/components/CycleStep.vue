<script setup lang="ts">
import {JobStateLookup} from "@/types.ts"
import {computed} from "vue";

const props = defineProps<{
  state: JobStateLookup
  job: Job // TODO: Job struct
  /*
    Prepare = 0,
    JogToStart = 1,
    HeadDown = 2,
    PlanishToEnd = 3,
    PlanishToStart = 4,
    HeadUp = 5,
    JogToPark = 6,
   */
}>();

const title = computed<string>(() => {
  switch (props.state) {
    case JobStateLookup.Prepare:
      return "Prepare"
    case JobStateLookup.JogToStart:
      return "Jog to start"
    case JobStateLookup.HeadDown:
      return "Engage roller"
    case JobStateLookup.PlanishToEnd:
      return "Planish to end"
    case JobStateLookup.PlanishToStart:
      return "Re-planish to start"
    case JobStateLookup.HeadUp:
      return "Disengage roller"
    case JobStateLookup.JogToPark:
      return "Jog to park"
  }
})

</script>

<template>
  <div class="p-1 border-2 border-slate-600">
    <p class="text-center m-auto">
      {{title}}
    </p>
  </div>
</template>

<style scoped>

</style>
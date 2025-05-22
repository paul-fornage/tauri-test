<script setup lang="ts">

import * as Register from "@/RegisterDefinitions.ts";
import PositionDisplay from "@/components/PositionDisplay.vue";

const props = defineProps<{
  positionToDisplay: number
  precision?: number
  homed: boolean
}>()

</script>

<template>
  <PositionDisplay
      v-if="props.homed"
      :precision="props.precision"
      :position-to-display="props.positionToDisplay" >
    <p>
      Current position
    </p>
  </PositionDisplay>
  <div v-else class="h-full border-slate-200 text-slate-600 bg-slate-300 opacity-50
              rounded-lg text-2xl text-center flex flex-col justify-center">
    Home axis to see position
  </div>
</template>

<style scoped>

</style>
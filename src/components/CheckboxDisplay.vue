<script setup lang="ts">
import { CircleDashed, CircleEllipsis, CircleCheckBig } from 'lucide-vue-next';
import {computed, type HTMLAttributes} from 'vue';
import {cn} from "@/lib/utils.ts";
import {PhaseWorkingStatus} from "@/types.ts";


const props = defineProps<{
  state: PhaseWorkingStatus
  class?: HTMLAttributes['class']
}>();

const CurrentIcon = computed(() => {
  switch (props.state) {
    case PhaseWorkingStatus.NotStarted: return CircleDashed;
    case PhaseWorkingStatus.Working: return CircleEllipsis;
    case PhaseWorkingStatus.Done: return CircleCheckBig;
  }
});
</script>

<template>
  <component :is="CurrentIcon" :class="cn('', props.class)" />

<!--  <CircleDashed v-if="props.state === 'NotStarted'"-->
<!--                :class="cn('stroke-slate-400', props.class)" />-->
<!--  <CircleEllipsis v-if="props.state === 'Working'"-->
<!--                  :class="cn('stroke-slate-600', props.class)" />-->
<!--  <CircleCheckBig v-if="props.state === 'Done'"-->
<!--                  :class="cn('stroke-green-800', props.class)" />-->
</template>
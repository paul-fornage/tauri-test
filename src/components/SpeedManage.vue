<script setup lang="ts">
import SpeedSelect from "@/components/SpeedSelect.vue";
import {computed, HTMLAttributes} from "vue";
import {cn} from '@/lib/utils.ts'
import {MIN_PLANISH_SPEED, MIN_JOG_SPEED, MAX_PLANISH_SPEED, MAX_JOG_SPEED} from "@/constants.ts";

const props = defineProps<{
  currentSpeed: number,
  type: 'planish' | 'jog',
  class?: HTMLAttributes['class'],
  disabled?: boolean,
}>();

const emits = defineEmits<{
  (e: 'submitSpeed', new_value: number): void
}>();

const title = computed<string>(() => {
  switch (props.type) {
    case 'planish':
      return 'Planish speed: '
    case 'jog':
      return 'Jog speed: '
  }
})

const buttonText = computed<string>(() => {
  switch (props.type) {
    case 'planish':
      return 'Edit Planish speed'
    case 'jog':
      return 'Edit Jog speed'
  }
})

const minSpeed = computed<number>(() => {
  switch (props.type) {
    case 'planish':
      return MIN_PLANISH_SPEED
    case 'jog':
      return MIN_JOG_SPEED
  }
})

const maxSpeed = computed<number>(() => {
  switch (props.type) {
    case 'planish':
      return MAX_PLANISH_SPEED
    case 'jog':
      return MAX_JOG_SPEED
  }
})

</script>

<template>
  <div :class="cn('border-2 border-slate-600 rounded-lg flex-col flex p-1', props.class)">
    <div class="flex-row flex text-lg">
      <p class="flex-1 mr-auto ml-1">
        {{title}}
      </p>
      <div class="ml-auto mr-1 flex">
        <p class="text-slate-800 dark:text-slate-200 text-2xl font-bold text-right">
          {{currentSpeed.toFixed(2)}}
        </p>
        <p class="text-sm text-right m-1 mt-auto">
          in/min
        </p>
      </div>
    </div>
    <SpeedSelect
        class="mx-1 h-12 text-lg mb-1 mt-auto"
        :text="buttonText"
        :initial_value="currentSpeed"
        :min="minSpeed"
        :max="maxSpeed"
        @submit="emits('submitSpeed', $event)"
    />
  </div>
</template>

<style scoped>

</style>
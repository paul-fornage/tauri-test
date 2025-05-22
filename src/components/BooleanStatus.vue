<script setup lang="ts">
import {computed} from "vue";
import LightCard from "@/components/LightCard.vue";

const props = defineProps<{
  true_text: string,
  false_text: string
  state: boolean
}>();

const stateClass = computed(() => {
  if (props.state) {
    return "text-green-900 border-green-800 dark:text-green-700"
  }
  return "text-red-900 border-red-800 dark:text-red-700"
})

const text = computed(() => {
  if (props.state) {
    return props.true_text
  }
  return props.false_text
})

</script>

<template>
  <LightCard :class="['border-2', stateClass]">
    <p class="text-center text-xl my-auto">
      {{text}}
    </p>

  </LightCard>
</template>

<style scoped>
</style>
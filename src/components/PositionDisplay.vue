<script setup lang="ts">

const props = defineProps<{
  positionToDisplay: number
  precision?: number
}>()

</script>

<template>
  <div class="flex flex-row">
    <div class="flex-1 ml-3 mr-auto text-xl my-auto justify-center">
      <slot></slot>
    </div>
    <p class="flex-1 ml-auto text-right text-2xl font-bold my-auto justify-center">
      {{positionToDisplay.toFixed(precision ?? 2)}}
    </p>
    <p class="mr-3 ml-1 text-xl my-auto justify-center">
      inches
    </p>
  </div>
</template>

<style scoped>

</style>
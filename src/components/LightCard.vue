<script setup lang="ts">
import type {HTMLAttributes} from "vue";
import {cn} from "@/lib/utils.ts";

const props = defineProps<{
  class?: HTMLAttributes['class']
}>();
</script>

<template>
  <div :class="cn('bg-card text-card-foreground flex flex-col gap-2 rounded-xl border py-3 shadow-sm', props.class)">
    <slot> </slot>
  </div>
</template>

<style scoped>

</style>
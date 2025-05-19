<script setup lang="ts">
const props = defineProps<{
  variant: "l1"|"l2"|"l3"|"r1"|"r2"|"r3",
}>();
</script>

<template>
  <svg v-if="variant == 'l1'"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-chevron-left-icon lucide-chevron-left">
    <path d="m15 18-6-6 6-6"/>
  </svg>
  <svg v-else-if="variant == 'l2'"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-chevron-left-icon lucide-chevron-left">
    <path d="m15 18-6-6 6-6"/>
  </svg>
  <svg v-else-if="variant == 'l3'"
       xmlns="http://www.w3.org/2000/svg"
       viewBox="0 0 24 24"
       fill="none"
       stroke="currentColor"
       stroke-width="2"
       stroke-linecap="round"
       stroke-linejoin="round">
    <path d="m8 17-5-5 5-5"/>
    <path d="m15 17-5-5 5-5"/>
    <path d="m23 17-5-5 5-5"/>
  </svg>
  <svg v-else-if="props.variant == 'r1'"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-chevron-right-icon lucide-chevron-right">
    <path d="m9 18 6-6-6-6"/>
  </svg>
  <svg v-else-if="variant == 'r2'"
      xmlns="http://www.w3.org/2000/svg"
      width="24" height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-chevrons-right-icon lucide-chevrons-right">
    <path d="m6 17 5-5-5-5"/>
    <path d="m13 17 5-5-5-5"/>
  </svg>
  <svg v-else-if="variant == 'r3'"
      xmlns="http://www.w3.org/2000/svg"
      width="24" height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-chevrons-right-icon lucide-chevrons-right">
    <path d="m2 17 5-5-5-5"/>
    <path d="m9 17 5-5-5-5"/>
    <path d="m16 17 5-5-5-5"/>
  </svg>
</template>

<style scoped>

</style>
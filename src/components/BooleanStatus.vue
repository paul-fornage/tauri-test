<script setup lang="ts">
import {Card, CardContent} from "@/components/ui/card";
import {computed} from "vue";

const props = defineProps<{
  true_text: string,
  false_text: string
  state: boolean
}>();

const stateClass = computed(() => {
  if (props.state) {
    return "text-green-900 border-green-900"
  }
  return "text-red-900 border-red-900"
})

const text = computed(() => {
  if (props.state) {
    return props.true_text
  }
  return props.false_text
})

</script>

<template>
  <Card :class="['p-1 border-2', stateClass]">
    <CardContent class="my-auto text-center">
      {{text}}
    </CardContent>
  </Card>
</template>

<style scoped>
</style>
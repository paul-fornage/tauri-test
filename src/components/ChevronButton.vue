<script setup lang="ts">
import ChevronIcon from "@/components/ChevronIcon.vue";
import {computed} from "vue";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils.ts";

const emits = defineEmits(["click"]);

const props = defineProps<{
  variant: "l1"|"l2"|"l3"|"r1"|"r2"|"r3",
  disabled?: boolean,
}>();

const text = computed<string>(() => {
  switch (props.variant) {
    case "l1":
      return "-0.01 in"
    case "l2":
      return "-0.1 in"
    case "l3":
      return "-1 in"
    case "r1":
      return "+0.01 in"
    case "r2":
      return "+0.1 in"
    case "r3":
      return "+1 in"
  }
});

const on_left = computed<boolean>(() => {
  switch (props.variant) {
    case "l1":
    case "l2":
    case "l3":
      return true
    default:
      return false
  }
});



</script>

<template>
  <Button
      :disabled="props.disabled"
      @click="emits('click')"
      class="h-20 flex flex-1/6 border-2 rounded-lg p-1 active:bg-slate-700">
    <p v-if="on_left" class="my-auto p-1 nowrap mr-auto text-2xl">
      {{ text }}
    </p>
    <ChevronIcon
        :variant="props.variant"
        :class="cn('my-auto size-16 p-1 slate-200 dark:slate-700', disabledClass)" />
    <p v-if="!on_left"
       :class="cn('my-auto p-1 nowrap ml-auto text-2xl', disabledClass)">
      {{ text }}
    </p>
  </Button>
</template>

<style scoped>

</style>
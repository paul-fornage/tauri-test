<script setup lang="ts">


import {Button} from "@/components/ui/button";
import {computed} from "vue";
import {KeypadFunctionButton} from "@/types.ts";


const props = defineProps<{
  variant: KeypadFunctionButton
}>();

const text = computed<string>(() => {
  switch (props.variant) {
    case KeypadFunctionButton.zero:
      return "0";
    case KeypadFunctionButton.one:
      return "1";
    case KeypadFunctionButton.two:
      return "2";
    case KeypadFunctionButton.three:
      return "3";
    case KeypadFunctionButton.four:
      return "4";
    case KeypadFunctionButton.five:
      return "5";
    case KeypadFunctionButton.six:
      return "6";
    case KeypadFunctionButton.seven:
      return "7";
    case KeypadFunctionButton.eight:
      return "8";
    case KeypadFunctionButton.nine:
      return "9";
    case KeypadFunctionButton.clear:
      return"Clr";
    case KeypadFunctionButton.delete:
      return"Del";
    case KeypadFunctionButton.dot:
      return".";
    case KeypadFunctionButton.enter:
      return"Ent";
    case KeypadFunctionButton.blank:
      return" ";
  }
});


const emits = defineEmits<{
  (e: 'pressed', value: KeypadFunctionButton): void;
}>();


</script>

<template>
  <Button class="h-16 w-56 mx-auto text-2xl"
      @click="emits('pressed', props.variant)">
    {{text}}
  </Button>
</template>

<style scoped>

</style>
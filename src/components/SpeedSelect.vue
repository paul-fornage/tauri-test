<script setup lang="ts">
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {onMounted, onUnmounted, ref} from "vue";
import {info} from "@tauri-apps/plugin-log";
import {Card, CardContent} from "@/components/ui/card";
import KeypadButton from "@/components/KeypadButton.vue";
import {KeypadFunctionButton} from "@/types.ts";
import LightCard from "@/components/LightCard.vue";


const ENABLE_FLOAT: boolean = true;

const props = defineProps<{
  text: string,
  initial_value: number,
  min: number,
  max: number,
  class?: string,
  disabled?: boolean,
}>();

const local_value = ref<string>("");
const invalidInputFeedback = ref<string>("");

const keyButtonValues = [
    KeypadFunctionButton.one,   KeypadFunctionButton.two,   KeypadFunctionButton.three, KeypadFunctionButton.delete,
    KeypadFunctionButton.four,  KeypadFunctionButton.five,  KeypadFunctionButton.six,   KeypadFunctionButton.clear,
    KeypadFunctionButton.seven, KeypadFunctionButton.eight, KeypadFunctionButton.nine,  KeypadFunctionButton.enter,
    ENABLE_FLOAT ? KeypadFunctionButton.dot : KeypadFunctionButton.blank,   KeypadFunctionButton.zero,
]

const emits = defineEmits<{
  (e: 'submit', value: number): void;
}>();

const is_open = ref<boolean>(false);


function submitHandler() {
  if(inputCheck()){
    const as_float: number = parseFloat(local_value.value);
    emits("submit", as_float);
    local_value.value = "";
    is_open.value = false;
  }
}

function inputCheck(): boolean {
  const as_float: number = parseFloat(local_value.value);
  if(!as_float){
    invalidInputFeedback.value = "Invalid input";
    return false;
  }
  if(as_float < props.min){
    local_value.value = props.min.toString();
    info("speed is less than min");
    invalidInputFeedback.value = "Speed must be greater than "+props.min.toString();
    return false;
  }
  if(as_float > props.max){
    local_value.value = props.max.toString();
    info("speed is greater than max");
    info("currently: "+as_float.toString());
    invalidInputFeedback.value = "Speed must be less than "+props.max.toString();
    return false;
  }
  if(!ENABLE_FLOAT && as_float.toString().includes(".")){
    local_value.value = Math.round(as_float).toString();
    info("speed has decimal");
    invalidInputFeedback.value = "Speed must be an integer";
    return false;
  }
  invalidInputFeedback.value = "";
  return true;
}

function keyPress(key: KeypadFunctionButton){
  const currentValue = local_value.value;

  switch (key) {
    case KeypadFunctionButton.zero:
    case KeypadFunctionButton.one:
    case KeypadFunctionButton.two:
    case KeypadFunctionButton.three:
    case KeypadFunctionButton.four:
    case KeypadFunctionButton.five:
    case KeypadFunctionButton.six:
    case KeypadFunctionButton.seven:
    case KeypadFunctionButton.eight:
    case KeypadFunctionButton.nine:
      local_value.value+=key.toString();
      break;
    case KeypadFunctionButton.clear:
      local_value.value = "";
      break;
    case KeypadFunctionButton.delete:
      if(currentValue.length > 0){
        local_value.value = local_value.value.substring(0, local_value.value.length-1);
      }
      break;
    case KeypadFunctionButton.dot:
      if (!currentValue.includes(".") && ENABLE_FLOAT) {
        local_value.value += ".";
      }
      break;
    case KeypadFunctionButton.enter:
      submitHandler();
      break;
    case KeypadFunctionButton.blank:
      break;
  }
  inputCheck();
}

const keyMapping: Record<string, KeypadFunctionButton> = {
  "0": KeypadFunctionButton.zero,
  "1": KeypadFunctionButton.one,
  "2": KeypadFunctionButton.two,
  "3": KeypadFunctionButton.three,
  "4": KeypadFunctionButton.four,
  "5": KeypadFunctionButton.five,
  "6": KeypadFunctionButton.six,
  "7": KeypadFunctionButton.seven,
  "8": KeypadFunctionButton.eight,
  "9": KeypadFunctionButton.nine,
  ".": KeypadFunctionButton.dot,
  "Enter": KeypadFunctionButton.enter,
  "Backspace": KeypadFunctionButton.delete,
  "Escape": KeypadFunctionButton.clear
};

function handleKeyDown(event: KeyboardEvent) {
  const key = keyMapping[event.key];
  if (key !== undefined) {
    keyPress(key);
  }
}

// Register the listener on component mount
onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
});

// Clean up the listener on component unmount
onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
});

</script>

<template>
  <Dialog
      v-model:open="is_open"
      class="">
    <DialogTrigger as-child>
      <Button
          :disabled="props.disabled"
          :class="props.class ?? 'mx-auto my-1 text-xl h-16 w-10/12'" variant="default">
        {{ text }}
      </Button>
    </DialogTrigger>
    <DialogContent class="">
      <DialogHeader>
        <DialogTitle>
          {{ text }}
        </DialogTitle>
      </DialogHeader>
      <div class="flex">
        <Input
            :disabled="true"
            v-model="local_value"
            class="text-3xl h-20"
            :placeholder="initial_value.toFixed(2)"
        />
        <p class="flex-1 text-nowrap my-auto mx-2 p-1">
          Inches per minute
        </p>
      </div>
      <p class="text-nowrap mx-auto p-1 text-red-800 h-4">
        {{ invalidInputFeedback }}
      </p>
      <LightCard class="grid grid-cols-4 gap-2">
        <div
            class="mx-auto justify-self-center"
            v-for="keyButtonValue in keyButtonValues"
            :key="keyButtonValue"
        >
          <KeypadButton
              @pressed="keyPress"
              :variant="keyButtonValue"
          />
        </div>
      </LightCard>
      <DialogFooter class="">
        <DialogClose as-child class="flex-1 h-12 text-3xl">
          <Button type="button" variant="destructive">
            Close
          </Button>
        </DialogClose>
        <Button
            @click="submitHandler"
            class="flex-1 h-12 text-3xl bg-green-900 hover:bg-green-800 active:bg-green-700">
          Go
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<style scoped>

</style>
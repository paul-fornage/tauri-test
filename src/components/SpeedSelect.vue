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
import {ref} from "vue";
import {info} from "@tauri-apps/plugin-log";
import {Card, CardContent} from "@/components/ui/card";
import KeypadButton from "@/components/KeypadButton.vue";
import {KeypadFunctionButton} from "@/types.ts";


const props = defineProps<{
  text: string,
  value: number,
  min: number,
  max: number,
}>();

const local_value = ref<string>(props.value.toString());
const invalidInputFeedback = ref<string>("");

const keyButtonValues = [
    KeypadFunctionButton.one, KeypadFunctionButton.two, KeypadFunctionButton.three,
    KeypadFunctionButton.four, KeypadFunctionButton.five, KeypadFunctionButton.six,
    KeypadFunctionButton.seven, KeypadFunctionButton.eight, KeypadFunctionButton.nine,
    KeypadFunctionButton.dot, KeypadFunctionButton.zero, KeypadFunctionButton.enter,
    KeypadFunctionButton.delete, KeypadFunctionButton.clear, KeypadFunctionButton.blank,
]


function submitHandler() {
  info("submit speed handler");
  if(parseFloat(local_value.value) < props.min){
    local_value.value = props.min.toString();
    info("speed is less than min");
    invalidInputFeedback.value = "Speed must be greater than "+props.min;
  } else if(parseFloat(local_value.value) > props.max){
    local_value.value = props.max.toString();
    info("speed is greater than max");
    invalidInputFeedback.value = "Speed must be less than "+props.max;
  }
  invalidInputFeedback.value = "";
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
      if (!currentValue.includes(".")) {
        local_value.value += ".";
      }
      break;
    case KeypadFunctionButton.enter:
      submitHandler();
      break;
    case KeypadFunctionButton.blank:
      break;
  }
}

</script>

<template>
  <Dialog class="">
    <DialogTrigger as-child>
      <Button class="mx-auto mt-2 text-2xl h-18" variant="default">
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
            :placeholder="text"
        />
        <p class="flex-1 text-nowrap my-auto mx-2 p-1">
          Inches per minute
        </p>
      </div>
      <p class="text-nowrap mx-auto p-1 text-red-800">
        {{ invalidInputFeedback }}
      </p>
      <Card class="py-3">
        <CardContent class="grid grid-cols-3 gap-2">
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

        </CardContent>
      </Card>

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
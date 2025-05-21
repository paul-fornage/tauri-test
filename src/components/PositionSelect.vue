<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { constrain } from "@/utils.ts";
import {Button} from "@/components/ui/button";
import ChevronButton from "@/components/ChevronButton.vue";
import AxisSlider from "@/components/AxisSlider.vue";
import {Slider} from "@/components/ui/slider";
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import {Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger} from "@/components/ui/dialog";
import {warn} from "@tauri-apps/plugin-log";


const props = defineProps<{
  currentPosition: number;
  minCommandedPosition: number;
  maxCommandedPosition: number;
  isHomed: boolean; // should reset to current pos be offered?
  initialPosition?: number;
}>();

const emits = defineEmits<{
  (e: 'submitNewPosition', new_val: number): void;
}>();

// Always keep a reactive local copy of the modelValue prop
const local_val = ref<number>(props.initialPosition ?? props.currentPosition);

const isDialogOpen = ref<boolean>(false);

const local_val_as_array = computed<number[]>({
  get() {
    return [local_val.value];
  },
  set(new_val: number[]) {
    if (new_val[0] != undefined) {
      local_val.value = new_val[0];
    }
  }
});

function submitHandler() {
  if(local_val.value >= props.minCommandedPosition && local_val.value <= props.maxCommandedPosition){
    emits("submitNewPosition", local_val.value);
    isDialogOpen.value = false;
  } else {
    warn("Tried to submit on position out of bounds. This should not be able to happen");
  }
}

function resetValue() {
  local_val.value = props.currentPosition;
}

async function addToCommandedPosition(delta: number){
  const temp_value: number = delta + local_val.value;
  local_val.value = constrain(props.minCommandedPosition, temp_value, props.maxCommandedPosition)
}
</script>

<template>
  <Dialog
      v-model:open="isDialogOpen"
      class="flex-1">
    <DialogTrigger as-child>
      <Button class="mx-auto text-2xl h-16" variant="default">
        <slot>
        </slot>
      </Button>
    </DialogTrigger>
    <DialogContent class="">
      <div class="select-none">
        <Card>
          <CardHeader class="mx-auto w-64 text-center my-0 p-0">
            <h1 class="text-2xl">
              {{ local_val.toFixed(2) + " in" }}
            </h1>
          </CardHeader>
          <CardContent>
            <div class="flex h-10">
              <div class="m-auto text-xl px-4">
                {{ minCommandedPosition }}
              </div>

              <AxisSlider
                  v-model="local_val_as_array"
                  :min="minCommandedPosition"
                  :max="maxCommandedPosition"
                  :step="0.01"
                  class="flex-1"
              />

              <div class="m-auto text-xl px-4">
                {{ maxCommandedPosition }}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card class="mt-2">
          <CardContent class="flex gap-4">
            <ChevronButton @click="addToCommandedPosition(-1)" variant="l3" />
            <ChevronButton @click="addToCommandedPosition(-0.1)" variant="l2" />
            <ChevronButton @click="addToCommandedPosition(-0.01)" variant="l1" />
            <ChevronButton @click="addToCommandedPosition(0.01)" variant="r1" />
            <ChevronButton @click="addToCommandedPosition(0.1)" variant="r2" />
            <ChevronButton @click="addToCommandedPosition(1)" variant="r3" />
          </CardContent>
        </Card>
      </div>
      <DialogFooter class="">
        <DialogClose as-child class="flex-1 h-20 text-3xl">
          <Button type="button" class="bg-red-900 active:bg-red-700 dark:bg-red-500">
            Cancel
          </Button>
        </DialogClose>
        <Button
            v-if="props.isHomed"
            @click="resetValue"
            class="flex-1 h-20 text-xl">
          <p class="">
            Reset to current axis position
          </p>
        </Button>
        <Button
            :disabled="true"
            class="flex-1 h-20 text-xl block"
            v-else>
          <p class="line-through text-muted">
            Reset to current axis position
          </p>
          <p>
            Home axis first
          </p>
        </Button>
        <Button
            @click="submitHandler"
            class="flex-1 h-20 text-3xl bg-green-900 active:bg-green-700 dark:bg-green-500">
          Confirm
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<style scoped>

</style>
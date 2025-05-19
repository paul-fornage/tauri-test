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


const props = defineProps<{
  modelValue: number;
  minCommandedPosition: number;
  maxCommandedPosition: number;
}>();

const emit = defineEmits(["update:modelValue"]);

// Always keep a reactive local copy of the modelValue prop
const local_val = ref(props.modelValue);

// Emit changes to the parent when the `local_val` is updated
watch(local_val, (newValue) => {
  emit("update:modelValue", constrain(props.minCommandedPosition, newValue, props.maxCommandedPosition));
});

const local_val_as_array = computed<number[]>({
  get() {
    return [local_val.value];
  },
  set(new_val: number[]) {
    if (new_val[0] !== undefined) {
      local_val.value = new_val[0];
    }
  }
});


async function addToCommandedPosition(delta: number){
  const temp_value: number = delta + local_val.value;
  local_val.value = constrain(props.minCommandedPosition, temp_value, props.maxCommandedPosition)
}
</script>

<template>
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
</template>

<style scoped>

</style>
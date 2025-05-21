<script setup lang="ts">

import * as Register from "@/RegisterDefinitions.ts";
import {MAX_AXIS_POS, MIN_AXIS_POS} from "@/constants.ts";
import PositionDisplay from "@/components/PositionDisplay.vue";
import PositionSelect from "@/components/PositionSelect.vue";
import {Pencil} from "lucide-vue-next";
import LightCard from "@/components/LightCard.vue";
import {PositionType} from "@/types.ts";
import {computed} from "vue";
import {Button} from "@/components/ui/button";

const props = defineProps<{
  pos: number
  position_type: PositionType
}>();

const emits = defineEmits<{
  (e: 'submit', new_pos: number): void
}>();

const editText = computed<string>(() => {
  switch (props.position_type) {
    case PositionType.Start:
      return "Edit start position:"
    case PositionType.End:
      return "Edit end position:"
    case PositionType.Park:
      return "Edit park position:"
  }
})

</script>

<template>
  <LightCard>
    <PositionDisplay
        class=""
        :position-to-display="props.pos" >
      <p class="mr-4 text-nowrap">
        {{editText}}
      </p>
    </PositionDisplay>
    <div class="p-2 flex gap-4">
      <PositionSelect
          @submitNewPosition="emits('submit', $event)"
          :current-position="Register.cc_commanded_position.value.value"
          :initial-position="props.pos"
          :min-commanded-position="MIN_AXIS_POS"
          :is-homed="Register.is_homed.value.value"
          :max-commanded-position="MAX_AXIS_POS" >
        <div class="p-2 flex gap-4">
          <Pencil class="my-auto"/>
          <p>
            Edit
          </p>
        </div>
      </PositionSelect>
      <Button
          @click="emits('submit', Register.cc_commanded_position.value.value)"
          class="h-16">
        Set to current position
      </Button>
    </div>

  </LightCard>
</template>

<style scoped>

</style>
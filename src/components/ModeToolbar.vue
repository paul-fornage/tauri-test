<script setup lang="ts">
import {House} from "lucide-vue-next";
import * as Register from '../RegisterDefinitions.ts';
import {computed} from "vue";
import {Button} from "@/components/ui/button";
import LightCard from "@/components/LightCard.vue";

defineProps<{
  headerText: string;
  isHome?: boolean;
}>();

const emit = defineEmits<{
  (e: 'homeClicked'): void
}>()

async function homeClicked() {
  console.log("change to home")
  emit("homeClicked")
}

const cycleTime = computed<string>(() => {
  return Register.cc_iteration_time.value.value.toString() + ' µs cycle time'
})


</script>

<template>
  <div class="flex w-full border-b-2 h-20">
    <p class="p-6 text-xl">
      {{ headerText }}
    </p>
    <LightCard
        v-if="Register.show_message.value.value"
        class="h-min m-auto py-1 px-4 text-center flex-max border-orange-500 border-2">
      {{Register.message_register_range.value.as_text()}}
    </LightCard>
    <p
        v-else
        class="text-gray-500 text-l flex-max m-auto text-center">
      {{cycleTime}}
    </p>
    <Button
        v-if="!isHome"
        @click="homeClicked"
        class="m-2 py-4 px-8 flex flex-row gap-5 h-16">
      <House class="size-6"/>
      <p class="my-auto text-xl">
        Home
      </p>
    </Button>

  </div>
</template>

<style scoped>

</style>
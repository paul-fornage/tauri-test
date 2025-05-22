<script setup lang="ts">
import type { SliderRootEmits, SliderRootProps } from 'reka-ui'
import {computed, HTMLAttributes} from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { SliderRange, SliderRoot, SliderThumb, SliderTrack, useForwardPropsEmits } from 'reka-ui'
import { cn } from '@/lib/utils'
import { ChevronsDownUp } from 'lucide-vue-next';


const props = defineProps<SliderRootProps & { class?: HTMLAttributes['class'], disableThumb?: boolean }>()
const emits = defineEmits<SliderRootEmits>()

const delegatedProps = reactiveOmit(props, 'class')

const forwarded = useForwardPropsEmits(delegatedProps, emits)


</script>

<template>
  <SliderRoot
      v-slot="{ modelValue }"
      data-slot="slider"
      :class="cn(
      'relative flex w-full touch-none items-center select-none data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col',
      props.class,
    )"
      v-bind="forwarded"
  >
    <SliderTrack
        data-slot="slider-track"
        class="disabled:bg-muted bg-slate-300 relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-3 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
    >

    </SliderTrack>

    <SliderThumb
        v-if="!props.disableThumb"
        v-for="(_, key) in modelValue"
        :as="ChevronsDownUp"
        :key="key"
        data-slot="slider-thumb"
        class="size-12 stroke-slate-900"
    />
  </SliderRoot>
</template>


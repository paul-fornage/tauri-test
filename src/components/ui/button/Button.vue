<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { computed } from "vue";
import { Primitive, type PrimitiveProps } from 'reka-ui'
import { cn } from '@/lib/utils'
import { type ButtonVariants, buttonVariants } from '.'

interface Props extends PrimitiveProps {
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  class?: HTMLAttributes['class']
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
})

const disabledClass = computed<string>(() => {
  if (props.disabled) {
    return "border-gray-300 hover:cursor-not-allowed text-gray-400"
  } else {
    return ""
  }
})

</script>

<template>
  <Primitive
    data-slot="button"
    :as="as"
    :as-child="asChild"
    :class="[cn(buttonVariants({ variant, size }), props.class), disabledClass, 'active:scale-95']"
  >
    <slot />
  </Primitive>
</template>

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


</script>

<template>
  <Primitive
    data-slot="button"
    :disabled="props.disabled"
    :as="as"
    :as-child="asChild"
    :class="cn(buttonVariants({ variant, size }),
       'active:scale-95 disabled:border-slate-200 disabled:hover:cursor-not-allowed ' +
       'disabled:text-slate-400 disabled:bg-slate-300', props.class)"
  >
    <slot />
  </Primitive>
</template>

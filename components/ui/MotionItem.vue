<template>
  <div
    v-motion
    :initial="initial"
    :enter="enter"
    :transition="transition"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    delay?: number
    y?: number
    x?: number
  }>(),
  { delay: 0, y: 16, x: 0 }
)

const initial = computed(() => ({ opacity: 0, y: props.y, x: props.x }))
const enter = computed(() => ({ opacity: 1, y: 0, x: 0 }))
const transition = computed(() => ({
  type: 'spring',
  stiffness: 170,
  damping: 22,
  delay: props.delay,
}))
</script>

<template>
  <Teleport v-if="teleport" to="body">
    <Transition :name="transitionName">
      <div
        v-if="open"
        data-popover
        class="fixed z-50 rounded-lg bg-white border border-gray-100 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.18)] overflow-hidden"
        :style="floatingStyle"
      >
        <slot />
      </div>
    </Transition>
  </Teleport>

  <Transition v-else :name="transitionName">
    <div
      v-if="open"
      data-popover
      class="absolute z-30 rounded-lg bg-white border border-gray-100 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.18)] overflow-hidden"
      :class="positionClass"
      :style="{ width: `${width}px`, transformOrigin: origin }"
    >
      <slot />
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

type Placement = 'bottom-right' | 'top-right' | 'top-left'

const props = withDefaults(
  defineProps<{
    open: boolean
    width?: number
    placement?: Placement
    teleport?: boolean
    anchor?: HTMLElement | null
    offset?: number
  }>(),
  { width: 340, placement: 'bottom-right', teleport: false, anchor: null, offset: 8 }
)

const positionClass = computed(() => {
  switch (props.placement) {
    case 'top-right':  return 'right-0 bottom-[calc(100%+8px)]'
    case 'top-left':   return 'left-0  bottom-[calc(100%+8px)]'
    case 'bottom-right':
    default:           return 'right-0 top-[calc(100%+8px)]'
  }
})

const origin = computed(() => {
  switch (props.placement) {
    case 'top-right':  return 'bottom right'
    case 'top-left':   return 'bottom left'
    case 'bottom-right':
    default:           return 'top right'
  }
})

const transitionName = computed(() =>
  props.placement.startsWith('top') ? 'popover-up' : 'popover-down'
)

const floatingStyle = ref<Record<string, string>>({})

const recompute = () => {
  if (!props.teleport || !props.anchor) return
  const rect = props.anchor.getBoundingClientRect()
  const style: Record<string, string> = {
    width: `${props.width}px`,
    transformOrigin: origin.value,
  }
  switch (props.placement) {
    case 'top-right':
      style.bottom = `${window.innerHeight - rect.top + props.offset}px`
      style.right = `${window.innerWidth - rect.right}px`
      break
    case 'top-left':
      style.bottom = `${window.innerHeight - rect.top + props.offset}px`
      style.left = `${rect.left}px`
      break
    case 'bottom-right':
    default:
      style.top = `${rect.bottom + props.offset}px`
      style.right = `${window.innerWidth - rect.right}px`
      break
  }
  floatingStyle.value = style
}

watch(
  () => props.open,
  async (v) => {
    if (v) {
      await nextTick()
      recompute()
    }
  }
)

onMounted(() => {
  window.addEventListener('resize', recompute)
  window.addEventListener('scroll', recompute, true)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', recompute)
  window.removeEventListener('scroll', recompute, true)
})
</script>

<style scoped>
.popover-down-enter-active,
.popover-up-enter-active {
  transition: opacity 0.16s ease, transform 0.16s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.popover-down-leave-active,
.popover-up-leave-active {
  transition: opacity 0.12s ease, transform 0.12s ease;
}
.popover-down-enter-from,
.popover-down-leave-to {
  opacity: 0;
  transform: scale(0.96) translateY(-4px);
}
.popover-up-enter-from,
.popover-up-leave-to {
  opacity: 0;
  transform: scale(0.96) translateY(4px);
}
</style>

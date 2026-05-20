<template>
  <Transition name="loader-fade">
    <div
      v-if="visible"
      class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#f8f9fb]"
    >
      <div class="relative">
        <svg width="88" height="88" viewBox="0 0 88 88" class="block">
          <g transform="translate(44, 44)">
            <line
              v-for="(seg, i) in segments"
              :key="i"
              :x1="seg.x1"
              :y1="seg.y1"
              :x2="seg.x2"
              :y2="seg.y2"
              :stroke="seg.active ? '#1a1a1a' : '#e6e6e6'"
              stroke-width="2"
              stroke-linecap="round"
              class="transition-[stroke] duration-100"
            />
          </g>
        </svg>
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="loader-percent text-[13px] font-semibold text-gray-900 tabular-nums tracking-tight">
            {{ progress }}
          </span>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'

const TOTAL = 24
const DURATION = 1500

const progress = ref(0)
const visible = ref(true)
const emit = defineEmits<{ (e: 'done'): void }>()

const round = (n: number) => Math.round(n * 1000) / 1000

const segments = computed(() => {
  const active = Math.round((progress.value / 100) * TOTAL)
  return Array.from({ length: TOTAL }, (_, i) => {
    const angle = ((i * 360) / TOTAL - 90) * (Math.PI / 180)
    return {
      x1: round(Math.cos(angle) * 22),
      y1: round(Math.sin(angle) * 22),
      x2: round(Math.cos(angle) * 32),
      y2: round(Math.sin(angle) * 32),
      active: i < active,
    }
  })
})

onMounted(() => {
  const start = performance.now()
  const tick = (now: number) => {
    const t = Math.min((now - start) / DURATION, 1)
    const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
    progress.value = Math.round(eased * 100)
    if (t < 1) {
      requestAnimationFrame(tick)
    } else {
      progress.value = 100
      setTimeout(() => {
        visible.value = false
        emit('done')
      }, 280)
    }
  }
  requestAnimationFrame(tick)
})
</script>

<style scoped>
.loader-percent {
  font-family: 'PT Mono', 'SF Mono', ui-monospace, monospace;
}
.loader-fade-leave-active {
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.loader-fade-leave-to {
  opacity: 0;
}
</style>

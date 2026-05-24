<template>
  <BaseCard>
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2.5">
        <div class="h-9 w-9 rounded nested-surface flex items-center justify-center">
          <component :is="icon" class="h-4 w-4 text-gray-700" :stroke-width="1.75" />
        </div>
        <p class="label-mono text-[10px] text-gray-500">{{ label }}</p>
        <span v-if="index" class="numbered-index text-[9px]">#{{ String(index).padStart(2, '0') }}</span>
      </div>
      <span
        :class="[
          'inline-flex items-center gap-0.5 text-[10.5px] font-semibold tabular-nums px-1.5 py-0.5 rounded-sm border',
          trend >= 0
            ? 'text-emerald-700 bg-emerald-50/60 border-emerald-100'
            : 'text-red-700 bg-red-50/60 border-red-100',
        ]"
      >
        <TrendingUp v-if="trend >= 0" class="h-2.5 w-2.5" :stroke-width="2.5" />
        <TrendingDown v-else class="h-2.5 w-2.5" :stroke-width="2.5" />
        {{ Math.abs(trend) }}%
      </span>
    </div>
    <div class="mt-auto pt-6">
      <p class="text-[28px] font-semibold text-gray-900 tracking-[-0.02em] tabular-nums leading-none">
        {{ formatted }}
      </p>
      <div class="bar-track mt-3.5">
        <div class="bar-fill transition-[width] duration-700 ease-out" :style="{ width: `${barWidth}%` }" />
      </div>
    </div>
  </BaseCard>
</template>

<script lang="ts" setup>
import { computed, type Component } from 'vue'
import { TrendingDown, TrendingUp } from 'lucide-vue-next'

const props = defineProps<{
  label: string
  value: number
  trend: number
  icon: Component
  index?: number
}>()

const { currency } = useFormat()
const formatted = computed(() => currency(props.value))
const barWidth = computed(() => Math.min(95, Math.max(20, 40 + Math.abs(props.trend) * 3.5)))
</script>

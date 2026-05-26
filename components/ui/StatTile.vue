<template>
  <div class="relative flex flex-col gap-2.5 px-6 py-5 first:pl-0 last:pr-0 flex-1 min-w-0">
    <div class="flex items-center justify-between gap-2">
      <p class="label-mono text-[10px] text-gray-500">{{ label }}</p>
      <span v-if="index !== undefined" class="numbered-index">#{{ String(index).padStart(2, '0') }}</span>
    </div>

    <div class="flex items-baseline justify-between gap-3">
      <p class="text-[26px] font-semibold text-gray-900 tracking-[-0.018em] tabular-nums leading-none truncate">{{ value }}</p>
      <span
        v-if="trend !== undefined"
        :class="[
          'inline-flex items-center gap-0.5 text-[10.5px] font-semibold tabular-nums px-1.5 py-0.5 rounded-sm border',
          trend >= 0
            ? 'text-emerald-700 bg-emerald-50/60 border-emerald-100'
            : 'text-red-700 bg-red-50/60 border-red-100',
        ]"
      >
        <ArrowUpRight v-if="trend >= 0" class="h-2.5 w-2.5" :stroke-width="2.5" />
        <ArrowDownRight v-else class="h-2.5 w-2.5" :stroke-width="2.5" />
        {{ Math.abs(trend).toFixed(1) }}%
      </span>
    </div>

    <p v-if="hint" class="text-[11.5px] text-gray-500 truncate">{{ hint }}</p>

    <div v-if="progress !== undefined" class="bar-track mt-1">
      <div class="bar-fill transition-[width] duration-700 ease-out" :style="{ width: `${Math.min(100, Math.max(0, progress))}%` }" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ArrowDownRight, ArrowUpRight } from 'lucide-vue-next'

defineProps<{
  label: string
  value: string
  hint?: string
  trend?: number
  progress?: number
  index?: number
}>()
</script>

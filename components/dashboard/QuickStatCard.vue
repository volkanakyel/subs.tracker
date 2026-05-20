<template>
  <BaseCard>
    <div class="flex items-center justify-between">
      <div class="h-8 w-8 rounded-md bg-gray-50 flex items-center justify-center">
        <component :is="icon" class="h-4 w-4 text-gray-700" :stroke-width="1.75" />
      </div>
      <span
        class="inline-flex items-center gap-0.5 text-[11px] font-medium tabular-nums"
        :class="trend >= 0 ? 'text-emerald-600' : 'text-gray-400'"
      >
        <TrendingUp v-if="trend >= 0" class="h-3 w-3" :stroke-width="2" />
        <TrendingDown v-else class="h-3 w-3" :stroke-width="2" />
        {{ Math.abs(trend) }}%
      </span>
    </div>
    <div class="mt-auto pt-6">
      <p class="text-[22px] font-semibold text-gray-900 tracking-tight tabular-nums leading-none">
        {{ formatted }}
      </p>
      <p class="text-[11px] text-gray-400 mt-2">{{ label }}</p>
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
}>()

const { currency } = useFormat()
const formatted = computed(() => currency(props.value))
</script>

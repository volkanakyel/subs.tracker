<template>
  <BaseCard title="Allocation" subtitle="Portfolio breakdown by asset class">
    <template #header>
      <span class="text-[15px] font-semibold text-gray-900 tabular-nums">
        ${{ total.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}
      </span>
    </template>

    <div class="flex h-2 w-full overflow-hidden rounded-full bg-gray-100">
      <div
        v-for="bucket in buckets"
        :key="bucket.type"
        class="h-full transition-[width] duration-500"
        :style="{ width: `${bucket.pct}%`, backgroundColor: bucket.color }"
      />
    </div>

    <div class="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2">
      <div
        v-for="bucket in buckets"
        :key="bucket.type"
        class="flex items-center justify-between"
      >
        <div class="flex items-center gap-2 min-w-0">
          <span class="h-2 w-2 rounded-full flex-shrink-0" :style="{ backgroundColor: bucket.color }" />
          <span class="text-[12px] text-gray-600 truncate">{{ bucket.label }}</span>
        </div>
        <span class="text-[11px] text-gray-500 tabular-nums flex-shrink-0 ml-2">{{ bucket.pct.toFixed(1) }}%</span>
      </div>
    </div>
  </BaseCard>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { HOLDING_TYPES, marketValue, type Holding } from '~/composables/useInvestments'

const props = defineProps<{ holdings: Holding[] }>()

const palette: Record<Holding['type'], string> = {
  stock:  '#111111',
  etf:    '#4a4a4a',
  crypto: '#7a7a7a',
  bond:   '#a8a8a8',
  cash:   '#d4d4d4',
}

const total = computed(() => props.holdings.reduce((s, h) => s + marketValue(h), 0))

const buckets = computed(() => {
  const totals = new Map<Holding['type'], number>()
  for (const h of props.holdings) {
    totals.set(h.type, (totals.get(h.type) ?? 0) + marketValue(h))
  }
  return HOLDING_TYPES
    .map((t) => ({
      type: t.value,
      label: t.label,
      value: totals.get(t.value) ?? 0,
      pct: total.value ? ((totals.get(t.value) ?? 0) / total.value) * 100 : 0,
      color: palette[t.value],
    }))
    .filter((b) => b.value > 0)
    .sort((a, b) => b.pct - a.pct)
})
</script>

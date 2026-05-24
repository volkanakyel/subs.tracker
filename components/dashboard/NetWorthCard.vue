<template>
  <BaseCard>
    <template #header>
      <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3 w-full">
        <div>
          <div class="flex items-center justify-between gap-3">
            <p class="label-mono text-[10px] text-gray-500">Total net worth</p>
            <span class="numbered-index">#01</span>
          </div>
          <div class="flex items-baseline gap-2.5 mt-3">
            <h2 class="text-[32px] sm:text-[38px] font-semibold text-gray-900 tracking-[-0.022em] tabular-nums leading-[1.05]">
              {{ formatted }}
            </h2>
            <span
              :class="[
                'inline-flex items-center gap-0.5 text-[11px] font-semibold tabular-nums px-1.5 py-0.5 rounded-sm border',
                trend >= 0
                  ? 'text-emerald-700 bg-emerald-50/60 border-emerald-100'
                  : 'text-red-700 bg-red-50/60 border-red-100',
              ]"
            >
              <TrendingUp v-if="trend >= 0" class="h-3 w-3" :stroke-width="2.25" />
              <TrendingDown v-else class="h-3 w-3" :stroke-width="2.25" />
              {{ trend >= 0 ? '+' : '' }}{{ trend.toFixed(1) }}%
            </span>
          </div>
          <p class="text-[11.5px] text-gray-500 mt-2">{{ deltaLabel }}</p>
        </div>
        <SegmentedControl v-model="period" :options="periods" />
      </div>
    </template>

    <div class="-mx-2 flex-1 min-h-0 mt-3">
      <AreaChart
        :data="series"
        :categories="categories"
        :height="300"
        :x-formatter="xFormatter"
        :y-formatter="yFormatter"
        :hide-legend="true"
        :x-grid-line="false"
        :y-grid-line="true"
        :curve-type="CurveType.Natural"
      />
    </div>
  </BaseCard>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { TrendingDown, TrendingUp } from 'lucide-vue-next'

const { netWorth: mock } = useDashboardData()
const { compact, currencyCents } = useFormat()
const { accounts } = useAccounts()

const periods = ['1W', '1M', '3M', '6M', '1Y'] as const
const period = ref<string>('1Y')

// Live total from accounts store
const liveTotal = computed(() => accounts.value.reduce((s, a) => s + a.balance, 0))
const formatted = computed(() => currencyCents(liveTotal.value))

// Extend mock series to end with live total
const series = computed(() => {
  const base = mock.series.slice(0, -1)
  return [...base, { month: 'Now', netWorth: Math.round(liveTotal.value) }]
})

// Compute live trend vs prior month
const trend = computed(() => {
  const prev = mock.series[mock.series.length - 2]?.netWorth ?? mock.series[0]?.netWorth ?? 1
  return ((liveTotal.value - prev) / prev) * 100
})

const delta = computed(() => {
  const prev = mock.series[mock.series.length - 2]?.netWorth ?? 0
  return Math.round(liveTotal.value - prev)
})
const deltaLabel = computed(() => `${delta.value >= 0 ? '+' : '−'}$${Math.abs(delta.value).toLocaleString()} from last month`)

const categories = { netWorth: { name: 'Net Worth', color: '#0a0a0a' } }
const xFormatter = (i: number) => series.value[i]?.month ?? ''
const yFormatter = (v: number) => compact(v)
</script>

<template>
  <BaseCard>
    <template #header>
      <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3 w-full">
        <div>
          <p class="text-[11px] text-gray-400 font-medium uppercase tracking-wider">Total Net Worth</p>
          <div class="flex items-baseline gap-2.5 mt-2">
            <h2 class="text-[28px] sm:text-[32px] font-semibold text-gray-900 tracking-tight tabular-nums leading-none">
              {{ formatted }}
            </h2>
            <span class="inline-flex items-center gap-0.5 text-xs font-medium text-emerald-600">
              <TrendingUp class="h-3 w-3" :stroke-width="2" />
              +{{ netWorth.trend }}%
            </span>
          </div>
          <p class="text-[11px] text-gray-400 mt-2">{{ netWorth.deltaLabel }}</p>
        </div>
        <SegmentedControl v-model="period" :options="periods" />
      </div>
    </template>

    <div class="-mx-2 flex-1 min-h-0 mt-2">
      <AreaChart
        :data="netWorth.series"
        :categories="categories"
        :height="280"
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
import { ref } from 'vue'
import { TrendingUp } from 'lucide-vue-next'

const { netWorth } = useDashboardData()
const { compact, currencyCents } = useFormat()

const periods = ['1W', '1M', '3M', '6M', '1Y'] as const
const period = ref<string>('1Y')

const categories = { netWorth: { name: 'Net Worth', color: '#1a1a1a' } }
const xFormatter = (i: number) => netWorth.series[i]?.month ?? ''
const yFormatter = (v: number) => compact(v)
const formatted = currencyCents(netWorth.total)
</script>

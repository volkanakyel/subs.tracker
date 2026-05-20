<template>
  <BaseCard title="Monthly Spending" subtitle="Breakdown by category">
    <template #header>
      <SegmentedControl v-model="view" :options="views" />
    </template>

    <div class="flex-1 min-h-0">
      <BarChart
        :data="spending"
        :categories="categories"
        :y-axis="['amount']"
        :height="280"
        :x-formatter="xFormatter"
        :y-formatter="yFormatter"
        :hide-legend="true"
        :x-grid-line="false"
        :y-grid-line="true"
        :radius="6"
        :bar-padding="0.4"
      />
    </div>

    <div class="flex items-center justify-between mt-5 pt-4 border-t border-gray-50 text-[11px]">
      <span class="flex items-center gap-2 text-gray-500">
        <span class="h-2 w-2 rounded-full bg-gray-900" />
        This month
      </span>
      <span class="text-gray-400">
        Total <span class="font-medium text-gray-800 tabular-nums ml-1">${{ total.toLocaleString() }}</span>
      </span>
    </div>
  </BaseCard>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

const { spending } = useDashboardData()

const views = ['Week', 'Month', 'Year'] as const
const view = ref<string>('Month')

const categories = { amount: { name: 'Spending', color: '#1a1a1a' } }
const xFormatter = (i: number) => spending[i]?.category ?? ''
const yFormatter = (v: number) => `$${v}`
const total = computed(() => spending.reduce((s, r) => s + r.amount, 0))
</script>

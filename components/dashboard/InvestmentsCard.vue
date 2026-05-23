<template>
  <BaseCard title="Investments" subtitle="Portfolio allocation">
    <template #header>
      <span class="text-[15px] font-semibold text-gray-900 tabular-nums">{{ totalFormatted }}</span>
    </template>

    <div class="flex items-center justify-center -mt-2">
      <DonutChart
        :data="donutData"
        :categories="donutCategories"
        :radius="68"
        :height="150"
        :hide-legend="true"
        :arc-width="12"
      />
    </div>

    <div class="mt-5 space-y-2.5 flex-1">
      <div
        v-for="h in investments.holdings"
        :key="h.name"
        class="flex items-center justify-between"
      >
        <div class="flex items-center gap-2.5">
          <span class="h-2 w-2 rounded-full" :style="{ backgroundColor: h.color }" />
          <span class="text-[13px] text-gray-600">{{ h.name }}</span>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-[13px] font-medium text-gray-900 tabular-nums">${{ h.value.toLocaleString() }}</span>
          <span class="text-[11px] text-gray-500 tabular-nums w-8 text-right">{{ h.percentage }}%</span>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const { investments } = useDashboardData()
const { currency } = useFormat()

const totalFormatted = currency(investments.total)
const donutData = investments.holdings.map((h) => h.percentage)
const donutCategories = computed(() =>
  Object.fromEntries(investments.holdings.map((h) => [h.name, { name: h.name, color: h.color }]))
)
</script>

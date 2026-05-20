<template>
  <BaseCard title="Financial Goals">
    <template #header>
      <button class="text-[11px] text-gray-400 font-medium hover:text-gray-800 transition-colors">View all</button>
    </template>

    <div class="space-y-4 flex-1">
      <div v-for="(g, i) in goals" :key="g.name">
        <div class="flex items-center justify-between mb-1.5">
          <div class="flex items-center gap-2">
            <div class="h-6 w-6 rounded-md bg-gray-50 flex items-center justify-center">
              <component :is="g.icon" class="h-3 w-3 text-gray-700" :stroke-width="2" />
            </div>
            <span class="text-[13px] text-gray-700 font-medium">{{ g.name }}</span>
          </div>
          <span class="text-[11px] text-gray-400 tabular-nums">{{ g.percentage }}%</span>
        </div>
        <div class="relative h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
          <div
            class="absolute left-0 top-0 h-full rounded-full transition-[width] duration-500"
            :style="{ width: `${g.percentage}%`, backgroundColor: barColor(i) }"
          />
        </div>
        <div class="flex items-center justify-between mt-1.5 text-[10px] text-gray-400 tabular-nums">
          <span>${{ g.current.toLocaleString() }}</span>
          <span>${{ g.target.toLocaleString() }}</span>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script lang="ts" setup>
const { goals } = useDashboardData()

const barShades = ['#1a1a1a', '#4a4a4a', '#7a7a7a', '#a8a8a8']
const barColor = (i: number) => barShades[i] ?? '#a8a8a8'
</script>

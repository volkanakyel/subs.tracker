<template>
  <BaseCard title="Subscriptions" :subtitle="`${active.length} active`">
    <template #header>
      <div class="text-right">
        <p class="text-[15px] font-semibold text-gray-900 tabular-nums leading-none">${{ totalMonthly.toFixed(2) }}</p>
        <p class="text-[10px] text-gray-500 mt-1">per month</p>
      </div>
    </template>

    <div class="space-y-0.5 flex-1">
      <div
        v-for="sub in topFive"
        :key="sub.name"
        class="flex items-center justify-between py-2"
      >
        <div class="flex items-center gap-3">
          <div class="h-8 w-8 rounded bg-gray-50 flex items-center justify-center overflow-hidden">
            <img :src="sub.icon" :alt="sub.name" class="h-4 w-4 object-contain" />
          </div>
          <div>
            <p class="text-[13px] text-gray-800 font-medium leading-tight">{{ sub.name }}</p>
            <p class="text-[10px] text-gray-500 mt-0.5">{{ renewalLabel(sub.nextRenewal) }}</p>
          </div>
        </div>
        <span class="text-[13px] font-medium text-gray-900 tabular-nums">${{ sub.price.toFixed(2) }}</span>
      </div>
    </div>
  </BaseCard>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const { subscriptions } = useSubscriptions()

const active = computed(() => subscriptions.value.filter((s) => s.status === 'active'))
const topFive = computed(() => active.value.slice(0, 5))

const totalMonthly = computed(() =>
  active.value.reduce((sum, s) => sum + (s.cycle === 'yearly' ? s.price / 12 : s.price), 0)
)

const renewalLabel = (iso: string) => {
  const d = new Date(iso)
  return `Renews ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
}
</script>

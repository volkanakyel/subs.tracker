<template>
  <BaseCard title="Recent Transactions">
    <template #header>
      <NuxtLink to="/transactions" class="text-[11px] text-gray-500 font-medium hover:text-gray-800 transition-colors">
        See all
      </NuxtLink>
    </template>

    <div class="overflow-x-auto flex-1 -mx-1">
      <table class="w-full">
        <thead>
          <tr class="border-b border-gray-100">
            <th class="text-left text-[10px] label-mono text-gray-500 pb-3 px-1">Transaction</th>
            <th class="text-left text-[10px] label-mono text-gray-500 pb-3 px-1">Category</th>
            <th class="text-left text-[10px] label-mono text-gray-500 pb-3 px-1">Date</th>
            <th class="text-right text-[10px] label-mono text-gray-500 pb-3 px-1">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="tx in recent"
            :key="tx.id"
            class="border-b border-gray-50 last:border-0"
          >
            <td class="py-3 px-1">
              <div class="flex items-center gap-3">
                <div class="h-7 w-7 rounded bg-gray-50 flex items-center justify-center">
                  <component :is="txIcon(tx.iconKey)" class="h-3.5 w-3.5 text-gray-600" :stroke-width="1.75" />
                </div>
                <div>
                  <p class="text-[13px] text-gray-800 font-medium leading-tight">{{ tx.name }}</p>
                  <p v-if="tx.description" class="text-[10px] text-gray-500 mt-0.5">{{ tx.description }}</p>
                </div>
              </div>
            </td>
            <td class="py-3 px-1">
              <span class="inline-flex text-[10px] px-2 py-0.5 rounded-sm bg-gray-50 text-gray-500 font-medium">
                {{ tx.category }}
              </span>
            </td>
            <td class="py-3 px-1 text-[12px] text-gray-500 tabular-nums">{{ dateLabel(tx.date) }}</td>
            <td class="py-3 px-1 text-right">
              <span
                class="text-[13px] font-medium tabular-nums"
                :class="tx.amount >= 0 ? 'text-emerald-600' : 'text-gray-900'"
              >
                {{ tx.amount >= 0 ? '+' : '−' }}${{ Math.abs(tx.amount).toFixed(2) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </BaseCard>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { txIcon } from '~/composables/useTransactions'

const { transactions } = useTransactions()

const recent = computed(() =>
  transactions.value
    .slice()
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 8)
)

const dateLabel = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>

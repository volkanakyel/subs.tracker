<template>
  <BaseCard title="Recent Transactions">
    <template #header>
      <button class="text-[11px] text-gray-400 font-medium hover:text-gray-800 transition-colors">See all</button>
    </template>

    <div class="overflow-x-auto flex-1 -mx-1">
      <table class="w-full">
        <thead>
          <tr class="border-b border-gray-100">
            <th class="text-left text-[10px] font-medium text-gray-400 uppercase tracking-wider pb-3 px-1">Transaction</th>
            <th class="text-left text-[10px] font-medium text-gray-400 uppercase tracking-wider pb-3 px-1">Category</th>
            <th class="text-left text-[10px] font-medium text-gray-400 uppercase tracking-wider pb-3 px-1">Date</th>
            <th class="text-right text-[10px] font-medium text-gray-400 uppercase tracking-wider pb-3 px-1">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="tx in transactions"
            :key="tx.name"
            class="border-b border-gray-50 last:border-0"
          >
            <td class="py-3 px-1">
              <div class="flex items-center gap-3">
                <div class="h-7 w-7 rounded-md bg-gray-50 flex items-center justify-center">
                  <component :is="tx.icon" class="h-3.5 w-3.5 text-gray-600" :stroke-width="1.75" />
                </div>
                <div>
                  <p class="text-[13px] text-gray-800 font-medium leading-tight">{{ tx.name }}</p>
                  <p class="text-[10px] text-gray-400 mt-0.5">{{ tx.description }}</p>
                </div>
              </div>
            </td>
            <td class="py-3 px-1">
              <span class="inline-flex text-[10px] px-2 py-0.5 rounded-full bg-gray-50 text-gray-500 font-medium">
                {{ tx.category }}
              </span>
            </td>
            <td class="py-3 px-1 text-[12px] text-gray-500 tabular-nums">{{ tx.date }}</td>
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
const { transactions } = useDashboardData()
</script>

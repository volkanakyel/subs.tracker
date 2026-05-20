<template>
  <BaseCard>
    <template #header>
      <div class="flex items-center justify-between w-full">
        <div>
          <h3 class="text-[14px] font-semibold text-gray-900 tracking-tight">{{ calendar.month }}</h3>
          <p class="text-[11px] text-gray-400 mt-0.5">{{ calendar.year }}</p>
        </div>
        <div class="flex items-center gap-0.5">
          <button class="h-6 w-6 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors">
            <ChevronLeft class="h-3 w-3" :stroke-width="2" />
          </button>
          <button class="h-6 w-6 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors">
            <ChevronRight class="h-3 w-3" :stroke-width="2" />
          </button>
        </div>
      </div>
    </template>

    <div class="grid grid-cols-7 text-center">
      <div
        v-for="d in dayHeaders"
        :key="d"
        class="py-1.5 text-[9px] font-semibold text-gray-300 uppercase tracking-widest select-none"
      >
        {{ d }}
      </div>
      <div v-for="day in days" :key="day" class="py-[3px]">
        <button
          :class="[
            'relative h-7 w-7 mx-auto rounded-md text-[11px] flex items-center justify-center transition-colors',
            day === calendar.today
              ? 'bg-gray-900 text-white font-semibold'
              : day < calendar.today
                ? 'text-gray-300'
                : calendar.billDays.includes(day)
                  ? 'text-gray-800 font-medium'
                  : 'text-gray-500 hover:bg-gray-50',
          ]"
        >
          {{ day }}
          <span
            v-if="calendar.billDays.includes(day) && day !== calendar.today"
            class="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-[3px] w-[3px] rounded-full bg-gray-900"
          />
        </button>
      </div>
    </div>

    <div class="my-4 h-px bg-gray-100" />

    <div>
      <p class="text-[9px] font-semibold text-gray-300 uppercase tracking-widest mb-2.5 select-none">Upcoming</p>
      <div class="space-y-1">
        <div
          v-for="(bill, i) in calendar.upcoming"
          :key="bill.name"
          class="flex items-center gap-2.5 py-1 px-1.5 -mx-1.5 rounded-md hover:bg-gray-50 transition-colors"
        >
          <span class="h-1.5 w-1.5 rounded-full" :style="{ backgroundColor: billShades[i] }" />
          <span class="text-[12px] text-gray-700 font-medium truncate flex-1">{{ bill.name }}</span>
          <span class="text-[10px] text-gray-400 tabular-nums">Feb {{ bill.day }}</span>
          <span class="text-[12px] font-medium text-gray-900 tabular-nums w-14 text-right">${{ bill.amount.toFixed(2) }}</span>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script lang="ts" setup>
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const { calendar } = useDashboardData()

const dayHeaders = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const days = Array.from({ length: calendar.daysInMonth }, (_, i) => i + 1)
const billShades = ['#1a1a1a', '#4a4a4a', '#7a7a7a', '#a8a8a8', '#c8c8c8']
</script>

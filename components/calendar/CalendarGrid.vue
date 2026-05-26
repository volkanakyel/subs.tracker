<template>
  <BaseCard :padded="false">
    <header class="flex items-center justify-between px-5 pt-5 pb-4">
      <div class="flex items-baseline gap-2">
        <h2 class="text-[15px] font-semibold text-gray-900 tracking-tight">{{ monthLabel }}</h2>
        <span class="text-[11px] text-gray-500 tabular-nums">{{ year }}</span>
      </div>
      <div class="flex items-center gap-1.5">
        <button
          class="h-7 px-2.5 rounded text-[11px] font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
          @click="$emit('today')"
        >
          Today
        </button>
        <button
          class="h-7 w-7 flex items-center justify-center rounded text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors"
          aria-label="Previous month"
          @click="$emit('prev')"
        >
          <ChevronLeft class="h-3.5 w-3.5" :stroke-width="2" />
        </button>
        <button
          class="h-7 w-7 flex items-center justify-center rounded text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors"
          aria-label="Next month"
          @click="$emit('next')"
        >
          <ChevronRight class="h-3.5 w-3.5" :stroke-width="2" />
        </button>
      </div>
    </header>

    <div class="grid grid-cols-7 px-3 pb-2">
      <div
        v-for="d in dayHeaders"
        :key="d"
        class="text-[9px] label-mono text-gray-400 text-center py-1.5 select-none"
      >
        {{ d }}
      </div>
    </div>

    <Transition :name="`slide-${direction}`" mode="out-in">
      <div :key="`${year}-${month}`" class="grid grid-cols-7 gap-1 px-3 pb-3">
        <button
          v-for="(cell, i) in cells"
          :key="i"
          :disabled="!cell.day"
          :class="cellClasses(cell)"
          @click="cell.day && $emit('select', cell.iso!)"
        >
          <span v-if="cell.day" class="relative z-[1] block text-[11px] tabular-nums leading-none">
            {{ cell.day }}
          </span>

          <div
            v-if="cell.day && cell.events.length"
            class="absolute left-0 right-0 bottom-1.5 flex items-center justify-center gap-1"
          >
            <span
              v-for="(ev, k) in cell.events.slice(0, 3)"
              :key="ev.id + k"
              class="h-1 w-1 rounded-full"
              :style="{ backgroundColor: dotColor(ev.type, cell.isToday) }"
            />
            <span
              v-if="cell.events.length > 3"
              class="text-[8px] font-semibold tabular-nums"
              :class="cell.isToday ? 'text-white/80' : 'text-gray-400'"
            >
              +{{ cell.events.length - 3 }}
            </span>
          </div>
        </button>
      </div>
    </Transition>

    <footer class="flex items-center gap-4 px-5 py-3 border-t border-gray-100">
      <span class="flex items-center gap-1.5 text-[10.5px] text-gray-500">
        <span class="h-1.5 w-1.5 rounded-full bg-gray-900" /> Bill
      </span>
      <span class="flex items-center gap-1.5 text-[10.5px] text-gray-500">
        <span class="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Income
      </span>
      <span class="flex items-center gap-1.5 text-[10.5px] text-gray-500">
        <span class="h-1.5 w-1.5 rounded-full bg-gray-300" /> Reminder
      </span>
    </footer>
  </BaseCard>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import type { CalendarEvent, CalendarEventType } from '~/composables/useCalendarEvents'

const props = defineProps<{
  year: number
  month: number
  selectedDate: string
  todayIso: string
  events: CalendarEvent[]
  direction: 'forward' | 'back'
}>()

defineEmits<{
  (e: 'select', iso: string): void
  (e: 'prev'): void
  (e: 'next'): void
  (e: 'today'): void
}>()

const dayHeaders = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const monthLabel = computed(() =>
  new Date(props.year, props.month, 1).toLocaleDateString('en-US', { month: 'long' })
)

const cells = computed(() => {
  const first = new Date(props.year, props.month, 1)
  const startWeekday = first.getDay()
  const daysInMonth = new Date(props.year, props.month + 1, 0).getDate()

  const arr: {
    day: number | null
    iso: string | null
    events: CalendarEvent[]
    isToday: boolean
    isPast: boolean
    isSelected: boolean
  }[] = []

  for (let i = 0; i < startWeekday; i++) {
    arr.push({ day: null, iso: null, events: [], isToday: false, isPast: false, isSelected: false })
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const iso = toIso(props.year, props.month, d)
    const events = props.events.filter((e) => e.date === iso)
    arr.push({
      day: d,
      iso,
      events,
      isToday: iso === props.todayIso,
      isPast: iso < props.todayIso,
      isSelected: iso === props.selectedDate,
    })
  }
  return arr
})

const toIso = (y: number, m: number, d: number) => {
  const mm = String(m + 1).padStart(2, '0')
  const dd = String(d).padStart(2, '0')
  return `${y}-${mm}-${dd}`
}

const cellClasses = (cell: typeof cells.value[number]) => {
  const base = 'relative aspect-square w-full flex items-start justify-end p-1.5 rounded transition-colors'
  if (!cell.day) return `${base} pointer-events-none`
  if (cell.isToday) return `${base} metallic-accent text-white font-semibold`
  if (cell.isSelected) return `${base} bg-[#F2F3F5] text-[#3F4248] font-medium ring-1 ring-[#6E727A]/40`
  if (cell.isPast) return `${base} text-gray-300 hover:bg-gray-50`
  return `${base} text-gray-700 hover:bg-gray-50`
}

const dotColor = (type: CalendarEventType, onDark: boolean) => {
  if (onDark) return 'rgba(255,255,255,0.85)'
  switch (type) {
    case 'income':   return '#10b981'
    case 'bill':     return '#1a1a1a'
    case 'reminder': return '#cbd5e1'
  }
}
</script>

<style scoped>
.slide-forward-enter-active,
.slide-back-enter-active {
  transition: opacity 0.22s ease, transform 0.22s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.slide-forward-leave-active,
.slide-back-leave-active {
  transition: opacity 0.14s ease, transform 0.14s ease;
}
.slide-forward-enter-from {
  opacity: 0;
  transform: translateX(12px);
}
.slide-forward-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}
.slide-back-enter-from {
  opacity: 0;
  transform: translateX(-12px);
}
.slide-back-leave-to {
  opacity: 0;
  transform: translateX(8px);
}
</style>

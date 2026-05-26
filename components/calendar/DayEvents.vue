<template>
  <BaseCard :padded="false">
    <header class="flex items-start justify-between px-5 pt-5 pb-3">
      <div>
        <p class="text-[10px] label-mono text-gray-400">{{ weekday }}</p>
        <h3 class="text-[18px] font-semibold text-gray-900 tracking-tight tabular-nums leading-tight mt-1">
          {{ dayLabel }}
        </h3>
      </div>
      <button
        class="inline-flex items-center gap-1 h-7 px-2.5 rounded btn-metallic text-[11px] font-medium"
        @click="$emit('add')"
      >
        <Plus class="h-3 w-3" :stroke-width="2.25" />
        Add
      </button>
    </header>

    <div class="h-px bg-gray-100 mx-5" />

    <div class="px-2 py-2 min-h-[160px]">
      <TransitionGroup name="event" tag="div">
        <div
          v-for="ev in events"
          :key="ev.id"
          class="group flex items-start gap-3 px-3 py-2.5 rounded-md hover:bg-gray-50/70 transition-colors"
        >
          <span
            class="mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0"
            :style="{ backgroundColor: dotColor(ev.type) }"
          />
          <div class="flex-1 min-w-0">
            <div class="flex items-baseline justify-between gap-2">
              <p class="text-[13px] font-medium text-gray-900 truncate leading-tight">{{ ev.title }}</p>
              <span
                v-if="ev.amount"
                class="text-[12.5px] font-semibold tabular-nums flex-shrink-0"
                :class="ev.type === 'income' ? 'text-emerald-600' : 'text-gray-900'"
              >
                {{ ev.type === 'income' ? '+' : '−' }}${{ ev.amount.toFixed(2) }}
              </span>
            </div>
            <p v-if="ev.note" class="text-[11px] text-gray-500 mt-0.5 truncate">{{ ev.note }}</p>
          </div>

          <div class="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              class="h-6 w-6 flex items-center justify-center rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Edit"
              @click="$emit('edit', ev)"
            >
              <Pencil class="h-3 w-3" :stroke-width="2" />
            </button>
            <button
              class="h-6 w-6 flex items-center justify-center rounded text-gray-400 hover:text-red-600 hover:bg-red-50/60 transition-colors"
              aria-label="Delete"
              @click="$emit('delete', ev)"
            >
              <Trash2 class="h-3 w-3" :stroke-width="2" />
            </button>
          </div>
        </div>
      </TransitionGroup>

      <div v-if="!events.length" class="px-3 py-10 text-center">
        <p class="text-[12px] text-gray-500 font-medium">Nothing scheduled</p>
        <p class="text-[11px] text-gray-500 mt-1">Click Add to create an event for this day.</p>
      </div>
    </div>

    <div v-if="events.length" class="h-px bg-gray-100 mx-5" />
    <footer v-if="events.length" class="flex items-center justify-between px-5 py-3 text-[11px]">
      <span class="text-gray-400">{{ events.length }} event{{ events.length === 1 ? '' : 's' }}</span>
      <span class="tabular-nums">
        <span class="text-gray-400">Net</span>
        <span
          class="font-semibold ml-1.5"
          :class="net >= 0 ? 'text-emerald-600' : 'text-gray-900'"
        >
          {{ net >= 0 ? '+' : '−' }}${{ Math.abs(net).toFixed(2) }}
        </span>
      </span>
    </footer>
  </BaseCard>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { Pencil, Plus, Trash2 } from 'lucide-vue-next'
import type { CalendarEvent, CalendarEventType } from '~/composables/useCalendarEvents'

const props = defineProps<{ date: string; events: CalendarEvent[] }>()
defineEmits<{
  (e: 'add'): void
  (e: 'edit', event: CalendarEvent): void
  (e: 'delete', event: CalendarEvent): void
}>()

const parsed = computed(() => {
  const [y, m, d] = props.date.split('-').map(Number)
  return new Date(y, m - 1, d)
})
const weekday = computed(() =>
  parsed.value.toLocaleDateString('en-US', { weekday: 'long' })
)
const dayLabel = computed(() =>
  parsed.value.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
)

const net = computed(() =>
  props.events.reduce((sum, e) => sum + (e.type === 'income' ? e.amount : -e.amount), 0)
)

const dotColor = (type: CalendarEventType) => {
  switch (type) {
    case 'income':   return '#10b981'
    case 'bill':     return '#1a1a1a'
    case 'reminder': return '#cbd5e1'
  }
}
</script>

<style scoped>
.event-enter-active {
  transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.event-leave-active {
  transition: opacity 0.16s ease;
  position: absolute;
  width: calc(100% - 0.5rem);
}
.event-enter-from {
  opacity: 0;
  transform: translateY(4px);
}
.event-leave-to {
  opacity: 0;
}
</style>

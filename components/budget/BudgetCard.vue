<template>
  <div
    class="group relative h-full rounded-lg bg-white border border-gray-100/80 p-5 flex flex-col transition-colors hover:border-gray-200/80"
  >
    <header class="flex items-start justify-between gap-2">
      <div class="flex items-center gap-3 min-w-0">
        <div
          class="h-9 w-9 rounded-md bg-gray-50 flex items-center justify-center flex-shrink-0"
        >
          <component :is="icon" class="h-4 w-4 text-gray-700" :stroke-width="1.75" />
        </div>
        <div class="min-w-0">
          <p class="text-[13px] text-gray-900 font-medium truncate leading-tight">{{ budget.name }}</p>
          <p class="text-[11px] text-gray-400 mt-0.5 truncate">
            ${{ budget.spent.toLocaleString() }} of ${{ budget.limit.toLocaleString() }}
          </p>
        </div>
      </div>

      <div ref="menuRef" class="relative">
        <button
          class="h-7 w-7 flex items-center justify-center rounded-md text-gray-300 hover:text-gray-700 hover:bg-gray-50 opacity-0 group-hover:opacity-100 focus:opacity-100 data-[open=true]:opacity-100 transition-all"
          :data-open="open"
          aria-label="More options"
          @click.stop="open = !open"
        >
          <MoreHorizontal class="h-3.5 w-3.5" :stroke-width="2" />
        </button>

        <Transition name="menu">
          <div
            v-if="open"
            data-popover
            class="absolute right-0 top-8 z-10 w-40 rounded-lg border border-gray-100 bg-white shadow-[0_8px_24px_-12px_rgba(0,0,0,0.12)] py-1 origin-top-right"
          >
            <button
              class="w-full flex items-center gap-2 px-3 py-1.5 text-[12px] text-gray-700 hover:bg-gray-50 transition-colors"
              @click="emit('edit', budget); open = false"
            >
              <Pencil class="h-3 w-3" :stroke-width="2" />
              Edit
            </button>
            <div class="h-px bg-gray-100 my-1" />
            <button
              class="w-full flex items-center gap-2 px-3 py-1.5 text-[12px] text-red-600 hover:bg-red-50/60 transition-colors"
              @click="emit('delete', budget); open = false"
            >
              <Trash2 class="h-3 w-3" :stroke-width="2" />
              Delete
            </button>
          </div>
        </Transition>
      </div>
    </header>

    <div class="mt-6 flex items-baseline justify-between gap-2">
      <p
        class="text-[24px] font-semibold tracking-tight tabular-nums leading-none"
        :class="status === 'over' ? 'text-red-600' : 'text-gray-900'"
      >
        ${{ Math.abs(remaining).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}
      </p>
      <span
        class="text-[10.5px] font-semibold uppercase tracking-widest"
        :class="statusColor"
      >
        {{ statusLabel }}
      </span>
    </div>
    <p class="text-[11px] text-gray-400 mt-2">
      {{ remaining >= 0 ? 'left to spend' : 'over budget' }}
    </p>

    <div class="mt-5">
      <div class="relative h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
        <div
          class="absolute left-0 top-0 h-full rounded-full transition-[width] duration-700 ease-out"
          :style="{ width: `${Math.min(pct, 100)}%`, backgroundColor: barColor }"
        />
        <div
          v-if="pct > 100"
          class="absolute right-0 top-0 h-full w-1 bg-red-600 animate-pulse"
        />
      </div>
      <div class="flex items-center justify-between mt-2 text-[10px] text-gray-400 tabular-nums">
        <span>{{ pct.toFixed(0) }}%</span>
        <span>${{ budget.limit.toLocaleString() }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-vue-next'
import { budgetPct, budgetRemaining, budgetStatus, iconFor, type Budget } from '~/composables/useBudgets'

const props = defineProps<{ budget: Budget }>()
const emit = defineEmits<{
  (e: 'edit', b: Budget): void
  (e: 'delete', b: Budget): void
}>()

const open = ref(false)
const menuRef = ref<HTMLElement | null>(null)
useClickOutside(menuRef, () => (open.value = false))

const icon = computed(() => iconFor(props.budget.iconKey))
const pct = computed(() => budgetPct(props.budget))
const remaining = computed(() => budgetRemaining(props.budget))
const status = computed(() => budgetStatus(props.budget))

const statusLabel = computed(() => {
  if (status.value === 'over') return 'Over'
  if (status.value === 'close') return 'Close'
  return 'On track'
})

const statusColor = computed(() => {
  if (status.value === 'over') return 'text-red-600'
  if (status.value === 'close') return 'text-amber-600'
  return 'text-emerald-600'
})

const barColor = computed(() => {
  if (status.value === 'over') return '#dc2626'
  if (status.value === 'close') return '#1a1a1a'
  return '#1a1a1a'
})
</script>

<style scoped>
.menu-enter-active,
.menu-leave-active {
  transition: opacity 0.12s ease, transform 0.12s ease;
}
.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: scale(0.96) translateY(-2px);
}
</style>

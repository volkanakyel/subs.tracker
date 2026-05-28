<template>
  <div
    class="group grid grid-cols-[1.6fr_80px_100px_110px_130px_140px_32px] items-center gap-4 px-4 py-3 rounded-md hover:bg-gray-50/70 transition-colors"
  >
    <div class="flex items-center gap-3 min-w-0">
      <div
        class="h-9 w-9 rounded flex items-center justify-center flex-shrink-0 text-[10px] font-semibold tracking-wide tabular-nums"
        :style="{ backgroundColor: badgeBg, color: badgeFg }"
      >
        {{ holding.symbol.slice(0, 4) }}
      </div>
      <div class="min-w-0">
        <p class="text-[13px] text-gray-900 font-medium truncate leading-tight">{{ holding.name }}</p>
        <p class="text-[11px] text-gray-500 mt-0.5 truncate">{{ typeLabel }} · {{ holding.symbol }}</p>
      </div>
    </div>

    <span class="text-[12px] text-gray-600 tabular-nums">{{ formatShares(holding.shares) }}</span>

    <span class="text-[12px] text-gray-600 tabular-nums">${{ holding.avgCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>

    <span class="text-[12px] text-gray-900 font-medium tabular-nums">${{ holding.currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>

    <span class="text-[13px] font-semibold text-gray-900 tabular-nums">${{ value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>

    <div class="text-right">
      <p
        class="text-[12.5px] font-semibold tabular-nums leading-tight"
        :class="gain >= 0 ? 'text-emerald-600' : 'text-red-600'"
      >
        {{ gain >= 0 ? '+' : '−' }}${{ Math.abs(gain).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
      </p>
      <p
        class="text-[10.5px] tabular-nums mt-0.5"
        :class="gain >= 0 ? 'text-emerald-600/80' : 'text-red-600/80'"
      >
        {{ gain >= 0 ? '+' : '' }}{{ pct.toFixed(2) }}%
      </p>
    </div>

    <div ref="menuRef" class="relative justify-self-end">
      <button
        class="h-7 w-7 flex items-center justify-center rounded text-gray-300 hover:text-gray-700 hover:bg-gray-100 opacity-0 group-hover:opacity-100 focus:opacity-100 data-[open=true]:opacity-100 transition-all"
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
          class="absolute right-0 top-8 z-10 w-40 rounded-md border border-gray-100 bg-white shadow-[0_8px_24px_-12px_rgba(0,0,0,0.12)] py-1 origin-top-right"
        >
          <button
            class="w-full flex items-center gap-2 px-3 py-1.5 text-[12px] text-gray-700 hover:bg-gray-50 transition-colors"
            @click="emit('edit', holding); open = false"
          >
            <Pencil class="h-3 w-3" :stroke-width="2" />
            Edit
          </button>
          <div class="h-px bg-gray-100 my-1" />
          <button
            class="w-full flex items-center gap-2 px-3 py-1.5 text-[12px] text-red-600 hover:bg-red-50/60 transition-colors"
            @click="emit('delete', holding); open = false"
          >
            <Trash2 class="h-3 w-3" :stroke-width="2" />
            Delete
          </button>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-vue-next'
import { HOLDING_TYPES, costBasis, gainLoss, gainPct, marketValue, type Holding } from '~/composables/useInvestments'

const props = defineProps<{ holding: Holding }>()
const emit = defineEmits<{
  (e: 'edit', h: Holding): void
  (e: 'delete', h: Holding): void
}>()

const open = ref(false)
const menuRef = ref<HTMLElement | null>(null)
useClickOutside(menuRef, () => (open.value = false))

const value = computed(() => marketValue(props.holding))
const gain = computed(() => gainLoss(props.holding))
const pct = computed(() => gainPct(props.holding))
const _cost = computed(() => costBasis(props.holding))

const typeLabel = computed(
  () => HOLDING_TYPES.find((t) => t.value === props.holding.type)?.label ?? props.holding.type
)

const typeShades: Record<Holding['type'], [string, string]> = {
  stock:  ['#111111', '#ffffff'],
  etf:    ['#3d3d3d', '#ffffff'],
  crypto: ['#6b6b6b', '#ffffff'],
  bond:   ['#e5e5e5', '#1a1a1a'],
  cash:   ['#f1f1f1', '#1a1a1a'],
}
const badgeBg = computed(() => typeShades[props.holding.type][0])
const badgeFg = computed(() => typeShades[props.holding.type][1])

const formatShares = (n: number) => {
  if (n < 1) return n.toFixed(4)
  if (n < 10) return n.toFixed(2)
  return n.toLocaleString('en-US', { maximumFractionDigits: 2 })
}
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

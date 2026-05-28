<template>
  <div
    class="group grid grid-cols-[1.4fr_110px_140px_120px_140px_32px] items-center gap-4 px-4 py-3 rounded-md hover:bg-gray-50/70 transition-colors"
  >
    <div class="flex items-center gap-3 min-w-0">
      <div class="h-8 w-8 rounded bg-gray-50 flex items-center justify-center flex-shrink-0">
        <component :is="icon" class="h-3.5 w-3.5 text-gray-700" :stroke-width="1.75" />
      </div>
      <div class="min-w-0">
        <p class="text-[13px] text-gray-900 font-medium truncate leading-tight">{{ tx.name }}</p>
        <p v-if="tx.description" class="text-[11px] text-gray-500 mt-0.5 truncate">{{ tx.description }}</p>
      </div>
    </div>

    <span class="inline-flex text-[10.5px] px-2 py-0.5 rounded-sm bg-gray-50 text-gray-500 font-medium justify-self-start">
      {{ tx.category }}
    </span>

    <span class="text-[12px] text-gray-500 tabular-nums">{{ dateLabel }}</span>

    <span class="text-[11px] text-gray-500 tabular-nums">{{ relativeLabel }}</span>

    <span
      class="text-[13px] font-semibold tabular-nums text-right"
      :class="tx.amount >= 0 ? 'text-emerald-600' : 'text-gray-900'"
    >
      {{ tx.amount >= 0 ? '+' : '−' }}${{ Math.abs(tx.amount).toFixed(2) }}
    </span>

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
            @click="emit('edit', tx); open = false"
          >
            <Pencil class="h-3 w-3" :stroke-width="2" />
            Edit
          </button>
          <div class="h-px bg-gray-100 my-1" />
          <button
            class="w-full flex items-center gap-2 px-3 py-1.5 text-[12px] text-red-600 hover:bg-red-50/60 transition-colors"
            @click="emit('delete', tx); open = false"
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
import { txIcon, type Transaction } from '~/composables/useTransactions'

const props = defineProps<{ tx: Transaction }>()
const emit = defineEmits<{
  (e: 'edit', tx: Transaction): void
  (e: 'delete', tx: Transaction): void
}>()

const open = ref(false)
const menuRef = ref<HTMLElement | null>(null)
useClickOutside(menuRef, () => (open.value = false))

const icon = computed(() => txIcon(props.tx.iconKey))

const parsed = computed(() => {
  const [y, m, d] = props.tx.date.split('-').map(Number)
  return new Date(y, m - 1, d)
})

const dateLabel = computed(() =>
  parsed.value.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
)

const relativeLabel = computed(() => {
  const today = new Date(2026, 1, 8)
  const diff = Math.round((today.getTime() - parsed.value.getTime()) / (1000 * 60 * 60 * 24))
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  if (diff > 0 && diff < 7) return `${diff} days ago`
  if (diff < 0 && diff > -7) return `in ${Math.abs(diff)} days`
  return parsed.value.toLocaleDateString('en-US', { weekday: 'short' })
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

<template>
  <div
    class="group grid grid-cols-[1fr_110px_120px_140px_100px_32px] items-center gap-4 px-4 py-3 rounded-lg hover:bg-gray-50/70 transition-colors"
  >
    <div class="flex items-center gap-3 min-w-0">
      <div class="h-9 w-9 rounded-md bg-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0">
        <img :src="sub.icon" :alt="sub.name" class="h-5 w-5 object-contain" />
      </div>
      <div class="min-w-0">
        <p class="text-[13px] text-gray-900 font-medium truncate leading-tight">{{ sub.name }}</p>
        <p class="text-[11px] text-gray-400 mt-0.5">Since {{ sinceLabel }}</p>
      </div>
    </div>

    <span class="text-[11px] text-gray-500 font-medium">{{ sub.category }}</span>

    <span
      class="inline-flex items-center gap-1.5 text-[11px] font-medium"
      :class="sub.status === 'active' ? 'text-gray-700' : 'text-gray-400'"
    >
      <span
        class="h-1.5 w-1.5 rounded-full"
        :class="sub.status === 'active' ? 'bg-emerald-500' : 'bg-gray-300'"
      />
      {{ cycleLabel }}
    </span>

    <span class="text-[12px] text-gray-600 tabular-nums">{{ renewalLabel }}</span>

    <span class="text-[13px] font-semibold text-gray-900 tabular-nums text-right">
      ${{ sub.price.toFixed(2) }}
    </span>

    <div ref="menuRef" class="relative justify-self-end">
      <button
        class="h-7 w-7 flex items-center justify-center rounded-md text-gray-300 hover:text-gray-700 hover:bg-gray-100 opacity-0 group-hover:opacity-100 focus:opacity-100 data-[open=true]:opacity-100 transition-all"
        :data-open="open"
        aria-label="More options"
        @click.stop="open = !open"
      >
        <MoreHorizontal class="h-3.5 w-3.5" :stroke-width="2" />
      </button>

      <Transition name="menu">
        <div
          v-if="open"
          class="absolute right-0 top-8 z-10 w-40 rounded-lg border border-gray-100 bg-white shadow-[0_8px_24px_-12px_rgba(0,0,0,0.12)] py-1 origin-top-right"
        >
          <button
            class="w-full flex items-center gap-2 px-3 py-1.5 text-[12px] text-gray-700 hover:bg-gray-50 transition-colors"
            @click="emit('edit', sub); open = false"
          >
            <Pencil class="h-3 w-3" :stroke-width="2" />
            Edit
          </button>
          <button
            class="w-full flex items-center gap-2 px-3 py-1.5 text-[12px] text-gray-700 hover:bg-gray-50 transition-colors"
            @click="emit('toggle', sub); open = false"
          >
            <Pause v-if="sub.status === 'active'" class="h-3 w-3" :stroke-width="2" />
            <Play v-else class="h-3 w-3" :stroke-width="2" />
            {{ sub.status === 'active' ? 'Pause' : 'Resume' }}
          </button>
          <div class="h-px bg-gray-100 my-1" />
          <button
            class="w-full flex items-center gap-2 px-3 py-1.5 text-[12px] text-red-600 hover:bg-red-50/60 transition-colors"
            @click="emit('delete', sub); open = false"
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
import { MoreHorizontal, Pause, Pencil, Play, Trash2 } from 'lucide-vue-next'
import type { Subscription } from '~/composables/useSubscriptions'

const props = defineProps<{ sub: Subscription }>()
const emit = defineEmits<{
  (e: 'edit', sub: Subscription): void
  (e: 'toggle', sub: Subscription): void
  (e: 'delete', sub: Subscription): void
}>()

const open = ref(false)
const menuRef = ref<HTMLElement | null>(null)
useClickOutside(menuRef, () => (open.value = false))

const cycleLabel = computed(() => {
  if (props.sub.status === 'paused') return 'Paused'
  return props.sub.cycle === 'yearly' ? 'Yearly' : 'Monthly'
})

const renewalLabel = computed(() => {
  if (props.sub.status === 'paused') return '—'
  const d = new Date(props.sub.nextRenewal)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
})

const sinceLabel = computed(() =>
  new Date(props.sub.startedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
)
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

<template>
  <div
    class="card-shine group relative h-full rounded-md bg-white border border-gray-100/70 p-6 flex flex-col transition-colors hover:border-gray-200/80 overflow-hidden"
  >
    <header class="flex items-start justify-between gap-2">
      <div class="flex items-center gap-3 min-w-0">
        <div
          class="h-9 w-9 rounded flex items-center justify-center flex-shrink-0"
          :class="complete ? 'metallic-accent text-white' : 'bg-gray-50 text-gray-700'"
        >
          <component :is="icon" class="h-4 w-4" :stroke-width="1.75" />
        </div>
        <div class="min-w-0">
          <p class="text-[13px] text-gray-900 font-medium truncate leading-tight">{{ goal.name }}</p>
          <p class="text-[11px] text-gray-500 mt-0.5 truncate">{{ deadlineLabel }}</p>
        </div>
      </div>

      <div ref="menuRef" class="relative">
        <button
          class="h-7 w-7 flex items-center justify-center rounded text-gray-300 hover:text-gray-700 hover:bg-gray-50 opacity-0 group-hover:opacity-100 focus:opacity-100 data-[open=true]:opacity-100 transition-all"
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
            class="absolute right-0 top-8 z-10 w-44 rounded-md border border-gray-100 bg-white shadow-[0_8px_24px_-12px_rgba(0,0,0,0.12)] py-1 origin-top-right"
          >
            <button
              class="w-full flex items-center gap-2 px-3 py-1.5 text-[12px] text-gray-700 hover:bg-gray-50 transition-colors"
              @click="emit('contribute', goal); open = false"
            >
              <PlusCircle class="h-3 w-3" :stroke-width="2" />
              Contribute
            </button>
            <button
              class="w-full flex items-center gap-2 px-3 py-1.5 text-[12px] text-gray-700 hover:bg-gray-50 transition-colors"
              @click="emit('edit', goal); open = false"
            >
              <Pencil class="h-3 w-3" :stroke-width="2" />
              Edit
            </button>
            <div class="h-px bg-gray-100 my-1" />
            <button
              class="w-full flex items-center gap-2 px-3 py-1.5 text-[12px] text-red-600 hover:bg-red-50/60 transition-colors"
              @click="emit('delete', goal); open = false"
            >
              <Trash2 class="h-3 w-3" :stroke-width="2" />
              Delete
            </button>
          </div>
        </Transition>
      </div>
    </header>

    <div class="mt-6 flex items-baseline justify-between gap-2">
      <p class="text-[24px] font-semibold text-gray-900 tracking-tight tabular-nums leading-none">
        ${{ goal.current.toLocaleString() }}
      </p>
      <span
        class="text-[11px] font-semibold tabular-nums"
        :class="complete ? 'text-emerald-600' : 'text-gray-500'"
      >
        {{ pct.toFixed(0) }}%
      </span>
    </div>
    <p class="text-[11px] text-gray-500 mt-1.5 tabular-nums">
      of ${{ goal.target.toLocaleString() }} target
    </p>

    <!-- Progress ring + bar combined -->
    <div class="mt-5">
      <div class="relative h-2 w-full rounded-full bg-gray-100 overflow-hidden">
        <div
          class="absolute left-0 top-0 h-full rounded-full transition-[width] duration-700 ease-out"
          :style="{ width: `${pct}%`, backgroundColor: complete ? '#10b981' : '#1a1a1a' }"
        />
      </div>
    </div>

    <footer class="mt-auto pt-5 flex items-center justify-between gap-3">
      <span class="text-[11px] text-gray-500 tabular-nums">
        <span v-if="complete" class="text-emerald-600 font-semibold">Goal reached</span>
        <span v-else>
          <span class="font-medium text-gray-700">${{ remaining.toLocaleString() }}</span> to go
        </span>
      </span>

      <button
        v-if="!complete"
        class="inline-flex items-center gap-1 h-7 px-2.5 rounded bg-gray-50 hover:bg-gray-900 hover:text-white text-gray-700 text-[11px] font-medium transition-colors"
        @click="emit('contribute', goal)"
      >
        <Plus class="h-3 w-3" :stroke-width="2.25" />
        Add
      </button>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { MoreHorizontal, Pencil, Plus, PlusCircle, Trash2 } from 'lucide-vue-next'
import { daysUntil, goalComplete, goalIcon, goalPct, goalRemaining, type Goal } from '~/composables/useGoals'

const props = defineProps<{ goal: Goal }>()
const emit = defineEmits<{
  (e: 'edit', g: Goal): void
  (e: 'delete', g: Goal): void
  (e: 'contribute', g: Goal): void
}>()

const open = ref(false)
const menuRef = ref<HTMLElement | null>(null)
useClickOutside(menuRef, () => (open.value = false))

const icon = computed(() => goalIcon(props.goal.iconKey))
const pct = computed(() => goalPct(props.goal))
const remaining = computed(() => goalRemaining(props.goal))
const complete = computed(() => goalComplete(props.goal))

const deadlineLabel = computed(() => {
  if (!props.goal.deadline) return 'No deadline'
  const days = daysUntil(props.goal.deadline) ?? 0
  if (days < 0) return 'Past due'
  if (days === 0) return 'Due today'
  if (days < 31) return `${days} days left`
  const months = Math.round(days / 30)
  return months < 12 ? `${months} months left` : `${(months / 12).toFixed(1)} years left`
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

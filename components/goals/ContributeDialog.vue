<template>
  <Teleport to="body">
    <Transition name="backdrop">
      <div
        v-if="open"
        class="fixed inset-0 z-40 bg-gray-900/30 backdrop-blur-[2px]"
        @click="$emit('update:open', false)"
      />
    </Transition>

    <Transition name="dialog">
      <div
        v-if="open && goal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
        role="dialog"
        aria-modal="true"
      >
        <div class="w-full max-w-[400px] rounded-lg bg-white border border-gray-100 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.25)] pointer-events-auto p-5">
          <div class="flex items-center gap-3">
            <div class="h-9 w-9 rounded bg-gray-50 flex items-center justify-center flex-shrink-0">
              <component :is="icon" class="h-4 w-4 text-gray-700" :stroke-width="1.75" />
            </div>
            <div class="min-w-0 flex-1">
              <h3 class="text-[14px] font-semibold text-gray-900 tracking-tight truncate">{{ goal.name }}</h3>
              <p class="text-[11px] text-gray-500 mt-0.5 tabular-nums">
                ${{ goal.current.toLocaleString() }} of ${{ goal.target.toLocaleString() }}
              </p>
            </div>
          </div>

          <div class="mt-4 space-y-3">
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[14px] text-gray-400">$</span>
              <input
                ref="inputRef"
                v-model.number="amount"
                type="number"
                step="1"
                min="1"
                placeholder="0"
                class="w-full rounded border border-gray-200/70 bg-white py-2.5 pl-7 pr-3 text-[18px] font-semibold text-gray-900 tabular-nums focus:border-[#6E727A]/50 focus:ring-2 focus:ring-[#6E727A]/15 focus:outline-none transition-all"
                @keydown.enter="submit"
              />
            </div>

            <div class="flex items-center gap-1.5">
              <button
                v-for="preset in presets"
                :key="preset"
                type="button"
                class="flex-1 h-7 rounded border border-gray-200/70 bg-white text-[11.5px] font-medium text-gray-600 hover:border-gray-300 hover:text-gray-900 tabular-nums transition-colors"
                @click="amount = preset"
              >
                ${{ preset }}
              </button>
            </div>

            <!-- Preview -->
            <div class="rounded bg-gray-50/70 border border-gray-100 p-3">
              <div class="flex items-center justify-between text-[11px] mb-2">
                <span class="text-gray-500">After contribution</span>
                <span class="tabular-nums font-medium" :class="willComplete ? 'text-emerald-600' : 'text-gray-900'">
                  {{ previewPct.toFixed(0) }}%
                </span>
              </div>
              <div class="relative h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                <div
                  class="absolute left-0 top-0 h-full rounded-full bg-gray-100"
                  :style="{ width: `${currentPct}%` }"
                />
                <div
                  class="absolute left-0 top-0 h-full rounded-full transition-[width] duration-500 ease-out"
                  :style="{ width: `${previewPct}%`, backgroundColor: willComplete ? '#10b981' : '#1a1a1a' }"
                />
              </div>
              <p v-if="willComplete" class="text-[10.5px] text-emerald-600 font-medium mt-2">
                This contribution reaches your goal 🎯
              </p>
            </div>
          </div>

          <div class="flex items-center justify-end gap-2 mt-5">
            <button
              type="button"
              class="h-8 px-3.5 rounded text-[12px] font-medium text-gray-600 hover:text-gray-900 transition-colors"
              @click="$emit('update:open', false)"
            >
              Cancel
            </button>
            <button
              type="button"
              class="h-8 px-3.5 rounded btn-metallic text-[12px] font-medium disabled:opacity-40 disabled:cursor-not-allowed"
              :disabled="!isValid"
              @click="submit"
            >
              Contribute
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
import { computed, nextTick, ref, watch } from 'vue'
import { goalIcon, type Goal } from '~/composables/useGoals'

const props = defineProps<{ open: boolean; goal: Goal | null }>()
const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'contribute', amount: number): void
}>()

const amount = ref<number>(0)
const inputRef = ref<HTMLInputElement | null>(null)
const presets = [50, 100, 250, 500]

watch(
  () => [props.open, props.goal],
  async () => {
    if (!props.open) return
    amount.value = 0
    await nextTick()
    inputRef.value?.focus()
  },
  { immediate: true }
)

const icon = computed(() => (props.goal ? goalIcon(props.goal.iconKey) : null))

const currentPct = computed(() =>
  props.goal && props.goal.target ? (props.goal.current / props.goal.target) * 100 : 0
)
const previewPct = computed(() => {
  if (!props.goal || !props.goal.target) return 0
  return Math.min(100, ((props.goal.current + (Number(amount.value) || 0)) / props.goal.target) * 100)
})
const willComplete = computed(() => {
  if (!props.goal) return false
  return props.goal.current + (Number(amount.value) || 0) >= props.goal.target
})

const isValid = computed(() => Number(amount.value) > 0)

const submit = () => {
  if (!isValid.value) return
  emit('contribute', Number(amount.value))
}
</script>

<style scoped>
.backdrop-enter-active,
.backdrop-leave-active {
  transition: opacity 0.18s ease;
}
.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}
.dialog-enter-active {
  transition: opacity 0.22s ease, transform 0.22s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.dialog-leave-active {
  transition: opacity 0.16s ease, transform 0.16s ease;
}
.dialog-enter-from {
  opacity: 0;
  transform: translateY(8px) scale(0.98);
}
.dialog-leave-to {
  opacity: 0;
  transform: translateY(4px) scale(0.98);
}
</style>

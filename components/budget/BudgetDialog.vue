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
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
        role="dialog"
        aria-modal="true"
      >
        <div class="w-full max-w-[460px] rounded-xl bg-white border border-gray-100 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.25)] pointer-events-auto">
          <header class="flex items-center justify-between px-5 pt-5 pb-1">
            <div>
              <h2 class="text-[15px] font-semibold text-gray-900 tracking-tight">
                {{ isEdit ? 'Edit budget' : 'New budget' }}
              </h2>
              <p class="text-[11px] text-gray-400 mt-0.5">
                {{ isEdit ? 'Adjust the limit or spent so far.' : 'Set a monthly limit for a category.' }}
              </p>
            </div>
            <button
              class="h-7 w-7 flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-colors"
              aria-label="Close"
              @click="$emit('update:open', false)"
            >
              <X class="h-3.5 w-3.5" :stroke-width="2" />
            </button>
          </header>

          <form class="px-5 py-4 space-y-3.5" @submit.prevent="submit">
            <Field label="Name">
              <input
                v-model="form.name"
                type="text"
                required
                placeholder="Groceries"
                class="form-input"
              />
            </Field>

            <Field label="Icon">
              <div class="grid grid-cols-8 gap-2">
                <button
                  v-for="opt in icons"
                  :key="opt.key"
                  type="button"
                  :class="[
                    'h-9 w-full flex items-center justify-center rounded-md border transition-all',
                    form.iconKey === opt.key
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-600 border-gray-200/70 hover:border-gray-300',
                  ]"
                  :aria-label="opt.label"
                  @click="form.iconKey = opt.key"
                >
                  <component :is="opt.icon" class="h-4 w-4" :stroke-width="1.75" />
                </button>
              </div>
            </Field>

            <div class="grid grid-cols-2 gap-3">
              <Field label="Monthly limit">
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] text-gray-400">$</span>
                  <input
                    v-model.number="form.limit"
                    type="number"
                    step="1"
                    min="0"
                    required
                    placeholder="0"
                    class="form-input pl-6 tabular-nums"
                  />
                </div>
              </Field>
              <Field label="Spent so far">
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] text-gray-400">$</span>
                  <input
                    v-model.number="form.spent"
                    type="number"
                    step="1"
                    min="0"
                    placeholder="0"
                    class="form-input pl-6 tabular-nums"
                  />
                </div>
              </Field>
            </div>

            <!-- Live preview -->
            <div class="rounded-md bg-gray-50/70 border border-gray-100 p-3">
              <div class="flex items-center justify-between mb-2">
                <span class="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Preview</span>
                <span class="text-[11px] tabular-nums font-medium" :class="previewStatusColor">
                  {{ previewPct.toFixed(0) }}% · {{ previewStatusLabel }}
                </span>
              </div>
              <div class="relative h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                <div
                  class="absolute left-0 top-0 h-full rounded-full transition-[width] duration-300 ease-out"
                  :style="{ width: `${Math.min(previewPct, 100)}%`, backgroundColor: previewBarColor }"
                />
              </div>
              <div class="flex items-center justify-between mt-2 text-[10.5px] text-gray-500 tabular-nums">
                <span>
                  <span :class="previewRemaining < 0 ? 'text-red-600 font-semibold' : ''">
                    {{ previewRemaining < 0 ? '−' : '' }}${{ Math.abs(previewRemaining).toLocaleString() }}
                  </span>
                  {{ previewRemaining < 0 ? 'over' : 'left' }}
                </span>
                <span>limit ${{ (Number(form.limit) || 0).toLocaleString() }}</span>
              </div>
            </div>
          </form>

          <footer class="flex items-center justify-between px-5 py-4 border-t border-gray-100">
            <button
              v-if="isEdit"
              type="button"
              class="text-[12px] text-red-600 font-medium hover:text-red-700 transition-colors"
              @click="$emit('delete')"
            >
              Delete
            </button>
            <span v-else />

            <div class="flex items-center gap-2">
              <button
                type="button"
                class="h-8 px-3.5 rounded-md text-[12px] font-medium text-gray-600 hover:text-gray-900 transition-colors"
                @click="$emit('update:open', false)"
              >
                Cancel
              </button>
              <button
                type="button"
                class="h-8 px-3.5 rounded-md bg-gray-900 text-white text-[12px] font-medium hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                :disabled="!isValid"
                @click="submit"
              >
                {{ isEdit ? 'Save changes' : 'Add budget' }}
              </button>
            </div>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
import { computed, reactive, watch } from 'vue'
import { X } from 'lucide-vue-next'
import { BUDGET_ICONS, type Budget, type BudgetIconKey } from '~/composables/useBudgets'

const props = defineProps<{ open: boolean; budget?: Budget | null }>()
const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'save', value: Budget | Omit<Budget, 'id'>): void
  (e: 'delete'): void
}>()

const icons = BUDGET_ICONS
const isEdit = computed(() => !!props.budget)

const blank = () => ({
  name: '',
  iconKey: 'other' as BudgetIconKey,
  limit: 0,
  spent: 0,
})

const form = reactive(blank())

watch(
  () => [props.open, props.budget],
  () => {
    if (!props.open) return
    Object.assign(form, blank())
    const b = props.budget
    if (b) {
      form.name = b.name
      form.iconKey = b.iconKey
      form.limit = b.limit
      form.spent = b.spent
    }
  },
  { immediate: true }
)

const previewPct = computed(() => {
  const limit = Number(form.limit) || 0
  const spent = Number(form.spent) || 0
  return limit ? (spent / limit) * 100 : 0
})
const previewRemaining = computed(() => (Number(form.limit) || 0) - (Number(form.spent) || 0))
const previewStatus = computed(() => {
  if (previewPct.value >= 100) return 'over'
  if (previewPct.value >= 70) return 'close'
  return 'under'
})
const previewStatusLabel = computed(() => {
  if (previewStatus.value === 'over') return 'Over'
  if (previewStatus.value === 'close') return 'Close'
  return 'On track'
})
const previewStatusColor = computed(() => {
  if (previewStatus.value === 'over') return 'text-red-600'
  if (previewStatus.value === 'close') return 'text-amber-600'
  return 'text-emerald-600'
})
const previewBarColor = computed(() => (previewStatus.value === 'over' ? '#dc2626' : '#1a1a1a'))

const isValid = computed(() => form.name.trim() && (Number(form.limit) || 0) > 0)

const submit = () => {
  if (!isValid.value) return
  const base = {
    name: form.name.trim(),
    iconKey: form.iconKey,
    limit: Number(form.limit) || 0,
    spent: Number(form.spent) || 0,
  }
  if (props.budget) emit('save', { ...props.budget, ...base })
  else emit('save', base)
}
</script>

<style scoped>
.form-input {
  width: 100%;
  border: 1px solid rgba(229, 231, 235, 0.7);
  background: white;
  border-radius: 6px;
  padding: 7px 10px;
  font-size: 12.5px;
  color: #1f2937;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.form-input::placeholder {
  color: #9ca3af;
}
.form-input:focus {
  border-color: #d1d5db;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.04);
}

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

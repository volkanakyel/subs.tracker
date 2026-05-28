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
        <div class="w-full max-w-[460px] rounded-lg bg-white border border-gray-100 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.25)] pointer-events-auto">
          <header class="flex items-center justify-between px-5 pt-5 pb-1">
            <div>
              <h2 class="text-[15px] font-semibold text-gray-900 tracking-tight">
                {{ isEdit ? 'Edit goal' : 'New goal' }}
              </h2>
              <p class="text-[11px] text-gray-500 mt-0.5">
                {{ isEdit ? 'Update the details below.' : 'Define what you’re saving for and how much.' }}
              </p>
            </div>
            <button
              class="h-7 w-7 flex items-center justify-center rounded text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-colors"
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
                placeholder="Emergency Fund"
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
                    'h-9 w-full flex items-center justify-center rounded border transition-all',
                    form.iconKey === opt.key
                      ? 'btn-metallic border-transparent'
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
              <Field label="Target amount">
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] text-gray-500">$</span>
                  <input
                    v-model.number="form.target"
                    type="number"
                    step="1"
                    min="0"
                    required
                    placeholder="0"
                    class="form-input pl-6 tabular-nums"
                  />
                </div>
              </Field>
              <Field label="Saved so far">
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] text-gray-500">$</span>
                  <input
                    v-model.number="form.current"
                    type="number"
                    step="1"
                    min="0"
                    placeholder="0"
                    class="form-input pl-6 tabular-nums"
                  />
                </div>
              </Field>
            </div>

            <Field label="Deadline" hint="Optional · used to suggest a monthly contribution">
              <input v-model="form.deadline" type="date" class="form-input" />
            </Field>

            <Field label="Note" hint="Optional">
              <input
                v-model="form.note"
                type="text"
                placeholder="Lisbon, summer trip"
                class="form-input"
              />
            </Field>

            <div class="rounded bg-gray-50/70 border border-gray-100 p-3 space-y-2">
              <div class="flex items-center justify-between text-[11.5px]">
                <span class="text-gray-500">Progress</span>
                <span class="tabular-nums font-medium" :class="previewPct >= 100 ? 'text-emerald-600' : 'text-gray-900'">
                  {{ previewPct.toFixed(0) }}%
                </span>
              </div>
              <div class="relative h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                <div
                  class="absolute left-0 top-0 h-full rounded-full transition-[width] duration-300 ease-out"
                  :style="{ width: `${Math.min(previewPct, 100)}%`, backgroundColor: previewPct >= 100 ? '#10b981' : '#1a1a1a' }"
                />
              </div>
              <div class="flex items-center justify-between text-[10.5px] text-gray-500 tabular-nums">
                <span>${{ previewRemaining.toLocaleString() }} to go</span>
                <span v-if="suggestion">~${{ suggestion.toLocaleString() }} / month</span>
                <span v-else />
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
                {{ isEdit ? 'Save changes' : 'Add goal' }}
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
import { GOAL_ICONS, monthsUntil, type Goal, type GoalIconKey } from '~/composables/useGoals'

const props = defineProps<{ open: boolean; goal?: Goal | null }>()
const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'save', value: Goal | Omit<Goal, 'id'>): void
  (e: 'delete'): void
}>()

const icons = GOAL_ICONS
const isEdit = computed(() => !!props.goal)

const blank = () => ({
  name: '',
  iconKey: 'shield' as GoalIconKey,
  current: 0,
  target: 0,
  deadline: '',
  note: '',
})

const form = reactive(blank())

watch(
  () => [props.open, props.goal],
  () => {
    if (!props.open) return
    Object.assign(form, blank())
    const g = props.goal
    if (g) {
      form.name = g.name
      form.iconKey = g.iconKey
      form.current = g.current
      form.target = g.target
      form.deadline = g.deadline ?? ''
      form.note = g.note ?? ''
    }
  },
  { immediate: true }
)

const previewPct = computed(() => {
  const t = Number(form.target) || 0
  const c = Number(form.current) || 0
  return t ? (c / t) * 100 : 0
})
const previewRemaining = computed(() => Math.max(0, (Number(form.target) || 0) - (Number(form.current) || 0)))

const suggestion = computed(() => {
  if (!form.deadline) return null
  const m = monthsUntil(form.deadline)
  if (!m || m <= 0) return null
  return Math.ceil(previewRemaining.value / m)
})

const isValid = computed(() => form.name.trim() && (Number(form.target) || 0) > 0)

const submit = () => {
  if (!isValid.value) return
  const base: Omit<Goal, 'id'> = {
    name: form.name.trim(),
    iconKey: form.iconKey,
    current: Number(form.current) || 0,
    target: Number(form.target) || 0,
    deadline: form.deadline || undefined,
    note: form.note.trim() || undefined,
  }
  if (props.goal) emit('save', { ...props.goal, ...base })
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
  border-color: #D8DBDF;
  box-shadow: 0 0 0 3px rgba(110, 114, 122, 0.18);
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

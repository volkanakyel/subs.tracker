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
                {{ isEdit ? 'Edit transaction' : 'New transaction' }}
              </h2>
              <p class="text-[11px] text-gray-500 mt-0.5">
                {{ isEdit ? 'Update the details below.' : 'Record an expense or income.' }}
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
            <Field label="Direction">
              <SegmentedControl v-model="form.direction" :options="directionOptions" />
            </Field>

            <Field label="Name">
              <input
                v-model="form.name"
                type="text"
                required
                placeholder="Whole Foods"
                class="form-input"
              />
            </Field>

            <div class="grid grid-cols-2 gap-3">
              <Field label="Category">
                <select v-model="form.category" class="form-input">
                  <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
                </select>
              </Field>
              <Field label="Date">
                <input v-model="form.date" type="date" required class="form-input" />
              </Field>
            </div>

            <Field label="Amount">
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[14px] font-semibold"
                  :class="form.direction === 'Income' ? 'text-emerald-600' : 'text-gray-700'"
                >
                  {{ form.direction === 'Income' ? '+' : '−' }}$
                </span>
                <input
                  v-model.number="form.amount"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  placeholder="0.00"
                  class="form-input pl-10 tabular-nums font-semibold"
                />
              </div>
            </Field>

            <Field label="Icon">
              <div class="grid grid-cols-11 gap-1.5">
                <button
                  v-for="opt in icons"
                  :key="opt.key"
                  type="button"
                  :class="[
                    'h-8 w-full flex items-center justify-center rounded border transition-all',
                    form.iconKey === opt.key
                      ? 'btn-metallic border-transparent'
                      : 'bg-white text-gray-600 border-gray-200/70 hover:border-gray-300',
                  ]"
                  :aria-label="opt.label"
                  @click="form.iconKey = opt.key"
                >
                  <component :is="opt.icon" class="h-3.5 w-3.5" :stroke-width="1.75" />
                </button>
              </div>
            </Field>

            <Field label="Description" hint="Optional">
              <input
                v-model="form.description"
                type="text"
                placeholder="Groceries"
                class="form-input"
              />
            </Field>
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
                {{ isEdit ? 'Save changes' : 'Add transaction' }}
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
import { TX_CATEGORIES, TX_ICONS, type Transaction, type TxCategory, type TxIconKey } from '~/composables/useTransactions'

const props = defineProps<{ open: boolean; transaction?: Transaction | null; defaultDate?: string }>()
const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'save', value: Transaction | Omit<Transaction, 'id'>): void
  (e: 'delete'): void
}>()

const categories = TX_CATEGORIES
const icons = TX_ICONS
const directionOptions = ['Expense', 'Income']
const isEdit = computed(() => !!props.transaction)

const blank = () => ({
  direction: 'Expense',
  name: '',
  description: '',
  category: 'Food' as TxCategory,
  iconKey: 'other' as TxIconKey,
  date: props.defaultDate ?? new Date().toISOString().slice(0, 10),
  amount: 0,
})

const form = reactive(blank())

watch(
  () => [props.open, props.transaction, props.defaultDate],
  () => {
    if (!props.open) return
    Object.assign(form, blank())
    const t = props.transaction
    if (t) {
      form.direction = t.amount >= 0 ? 'Income' : 'Expense'
      form.name = t.name
      form.description = t.description ?? ''
      form.category = t.category
      form.iconKey = t.iconKey
      form.date = t.date
      form.amount = Math.abs(t.amount)
    }
  },
  { immediate: true }
)

const isValid = computed(() => form.name.trim() && form.date && (Number(form.amount) || 0) >= 0)

const submit = () => {
  if (!isValid.value) return
  const signed = (Number(form.amount) || 0) * (form.direction === 'Income' ? 1 : -1)
  const base: Omit<Transaction, 'id'> = {
    name: form.name.trim(),
    description: form.description.trim() || undefined,
    category: form.category,
    iconKey: form.iconKey,
    date: form.date,
    amount: signed,
  }
  if (props.transaction) emit('save', { ...props.transaction, ...base })
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

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
                {{ isEdit ? 'Edit holding' : 'New holding' }}
              </h2>
              <p class="text-[11px] text-gray-500 mt-0.5">
                {{ isEdit ? 'Update the details below.' : 'Track a new position in your portfolio.' }}
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
            <div class="grid grid-cols-[120px_1fr] gap-3">
              <Field label="Symbol">
                <input
                  v-model="form.symbol"
                  type="text"
                  required
                  placeholder="AAPL"
                  maxlength="8"
                  class="form-input uppercase tabular-nums"
                />
              </Field>
              <Field label="Name">
                <input
                  v-model="form.name"
                  type="text"
                  required
                  placeholder="Apple Inc."
                  class="form-input"
                />
              </Field>
            </div>

            <Field label="Type">
              <select v-model="form.type" class="form-input">
                <option v-for="t in types" :key="t.value" :value="t.value">{{ t.label }}</option>
              </select>
            </Field>

            <div class="grid grid-cols-3 gap-3">
              <Field label="Shares">
                <input
                  v-model.number="form.shares"
                  type="number"
                  step="0.0001"
                  min="0"
                  required
                  placeholder="0"
                  class="form-input tabular-nums"
                />
              </Field>
              <Field label="Avg cost">
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] text-gray-500">$</span>
                  <input
                    v-model.number="form.avgCost"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="0.00"
                    class="form-input pl-6 tabular-nums"
                  />
                </div>
              </Field>
              <Field label="Price">
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] text-gray-500">$</span>
                  <input
                    v-model.number="form.currentPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="0.00"
                    class="form-input pl-6 tabular-nums"
                  />
                </div>
              </Field>
            </div>

            <div
              class="flex items-center justify-between rounded bg-gray-50/70 border border-gray-100 px-3 py-2 text-[11.5px]"
            >
              <span class="text-gray-500">Market value</span>
              <span class="font-semibold text-gray-900 tabular-nums">
                ${{ preview.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
              </span>
              <span class="text-gray-300">·</span>
              <span class="text-gray-500">Gain/loss</span>
              <span
                class="font-semibold tabular-nums"
                :class="preview.gain >= 0 ? 'text-emerald-600' : 'text-red-600'"
              >
                {{ preview.gain >= 0 ? '+' : '−' }}${{ Math.abs(preview.gain).toFixed(2) }}
                ({{ preview.gain >= 0 ? '+' : '' }}{{ preview.pct.toFixed(2) }}%)
              </span>
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
                {{ isEdit ? 'Save changes' : 'Add holding' }}
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
import { HOLDING_TYPES, type Holding, type HoldingType } from '~/composables/useInvestments'

const props = defineProps<{ open: boolean; holding?: Holding | null }>()
const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'save', value: Holding | Omit<Holding, 'id'>): void
  (e: 'delete'): void
}>()

const types = HOLDING_TYPES
const isEdit = computed(() => !!props.holding)
const today = new Date().toISOString().slice(0, 10)

const blank = () => ({
  symbol: '',
  name: '',
  type: 'stock' as HoldingType,
  shares: 0,
  avgCost: 0,
  currentPrice: 0,
})

const form = reactive(blank())

watch(
  () => [props.open, props.holding],
  () => {
    if (!props.open) return
    Object.assign(form, blank())
    const h = props.holding
    if (h) {
      form.symbol = h.symbol
      form.name = h.name
      form.type = h.type
      form.shares = h.shares
      form.avgCost = h.avgCost
      form.currentPrice = h.currentPrice
    }
  },
  { immediate: true }
)

const preview = computed(() => {
  const value = (Number(form.shares) || 0) * (Number(form.currentPrice) || 0)
  const cost = (Number(form.shares) || 0) * (Number(form.avgCost) || 0)
  const gain = value - cost
  const pct = cost ? (gain / cost) * 100 : 0
  return { value, gain, pct }
})

const isValid = computed(
  () => form.symbol.trim() && form.name.trim() && form.shares >= 0 && form.avgCost >= 0 && form.currentPrice >= 0
)

const submit = () => {
  if (!isValid.value) return
  const base = {
    symbol: form.symbol.trim().toUpperCase(),
    name: form.name.trim(),
    type: form.type,
    shares: Number(form.shares) || 0,
    avgCost: Number(form.avgCost) || 0,
    currentPrice: Number(form.currentPrice) || 0,
    updatedAt: today,
  }
  if (props.holding) emit('save', { ...props.holding, ...base })
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

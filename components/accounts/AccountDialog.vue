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
        <div class="w-full max-w-[440px] rounded-xl bg-white border border-gray-100 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.25)] pointer-events-auto">
          <header class="flex items-center justify-between px-5 pt-5 pb-1">
            <div>
              <h2 class="text-[15px] font-semibold text-gray-900 tracking-tight">
                {{ isEdit ? 'Edit account' : 'New account' }}
              </h2>
              <p class="text-[11px] text-gray-400 mt-0.5">
                {{ isEdit ? 'Update the details below.' : 'Link a new account to track its balance.' }}
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
            <Field label="Account name">
              <input
                v-model="form.name"
                type="text"
                required
                placeholder="Everyday Checking"
                class="form-input"
              />
            </Field>

            <Field label="Institution">
              <input
                v-model="form.institution"
                type="text"
                required
                placeholder="Chase, Marcus, Fidelity…"
                class="form-input"
              />
            </Field>

            <div class="grid grid-cols-2 gap-3">
              <Field label="Type">
                <select v-model="form.type" class="form-input">
                  <option v-for="t in types" :key="t.value" :value="t.value">{{ t.label }}</option>
                </select>
              </Field>

              <Field label="Last 4 digits">
                <input
                  v-model="form.last4"
                  type="text"
                  maxlength="4"
                  pattern="[0-9]*"
                  placeholder="4827"
                  class="form-input tabular-nums"
                />
              </Field>
            </div>

            <Field label="Balance" :hint="form.type === 'credit' ? 'Use a negative value for amount owed.' : undefined">
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] text-gray-400">$</span>
                <input
                  v-model.number="form.balance"
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  class="form-input pl-6"
                />
              </div>
            </Field>

            <label class="flex items-center gap-2.5 pt-1 cursor-pointer select-none">
              <input v-model="form.isPrimary" type="checkbox" class="form-check" />
              <span class="text-[12px] text-gray-700">Set as primary account</span>
            </label>
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
                {{ isEdit ? 'Save changes' : 'Add account' }}
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
import { ACCOUNT_TYPES, type Account, type AccountType } from '~/composables/useAccounts'

const props = defineProps<{ open: boolean; account?: Account | null }>()
const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'save', value: Account | Omit<Account, 'id'>): void
  (e: 'delete'): void
}>()

const types = ACCOUNT_TYPES
const isEdit = computed(() => !!props.account)

const today = new Date().toISOString().slice(0, 10)

const blank = () => ({
  name: '',
  institution: '',
  type: 'checking' as AccountType,
  balance: 0,
  last4: '',
  isPrimary: false,
  updatedAt: today,
})

const form = reactive(blank())

watch(
  () => [props.open, props.account],
  () => {
    if (!props.open) return
    Object.assign(form, blank())
    const a = props.account
    if (a) {
      form.name = a.name
      form.institution = a.institution
      form.type = a.type
      form.balance = a.balance
      form.last4 = a.last4
      form.isPrimary = a.isPrimary
      form.updatedAt = a.updatedAt
    }
  },
  { immediate: true }
)

const isValid = computed(
  () => form.name.trim() && form.institution.trim() && typeof form.balance === 'number'
)

const submit = () => {
  if (!isValid.value) return
  const base = {
    name: form.name.trim(),
    institution: form.institution.trim(),
    type: form.type,
    balance: Number(form.balance) || 0,
    last4: form.last4.trim() || '——',
    isPrimary: form.isPrimary,
    updatedAt: today,
  }
  if (props.account) emit('save', { ...props.account, ...base })
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
.form-check {
  width: 14px;
  height: 14px;
  border-radius: 3px;
  border: 1px solid #d1d5db;
  accent-color: #111827;
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

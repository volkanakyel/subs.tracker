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
        <div class="w-full max-w-[440px] rounded-lg bg-white border border-gray-100 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.25)] pointer-events-auto">
          <header class="flex items-center justify-between px-5 pt-5 pb-1">
            <div>
              <h2 class="text-[15px] font-semibold text-gray-900 tracking-tight">
                {{ isEdit ? 'Edit event' : 'New event' }}
              </h2>
              <p class="text-[11px] text-gray-500 mt-0.5">
                {{ isEdit ? 'Update the details below.' : 'Add a bill, income, or reminder.' }}
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
            <Field label="Title">
              <input
                v-model="form.title"
                type="text"
                required
                placeholder="Electric bill"
                class="form-input"
              />
            </Field>

            <Field label="Type">
              <SegmentedControl v-model="form.typeLabel" :options="typeOptions" />
            </Field>

            <div class="grid grid-cols-2 gap-3">
              <Field label="Date">
                <input v-model="form.date" type="date" required class="form-input" />
              </Field>

              <Field
                label="Amount"
                :hint="form.typeLabel === 'Reminder' ? 'Optional · leave 0 if not relevant' : undefined"
              >
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] text-gray-500">$</span>
                  <input
                    v-model.number="form.amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    class="form-input pl-6"
                  />
                </div>
              </Field>
            </div>

            <Field label="Note" hint="Optional">
              <input
                v-model="form.note"
                type="text"
                placeholder="ConEdison · account #4827"
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
                {{ isEdit ? 'Save changes' : 'Add event' }}
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
import type { CalendarEvent, CalendarEventType } from '~/composables/useCalendarEvents'

const props = defineProps<{
  open: boolean
  event?: CalendarEvent | null
  defaultDate?: string
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'save', value: CalendarEvent | Omit<CalendarEvent, 'id'>): void
  (e: 'delete'): void
}>()

const typeOptions = ['Bill', 'Income', 'Reminder']
const isEdit = computed(() => !!props.event)

const blank = () => ({
  title: '',
  typeLabel: 'Bill',
  date: props.defaultDate ?? new Date().toISOString().slice(0, 10),
  amount: 0,
  note: '',
})

const form = reactive(blank())

watch(
  () => [props.open, props.event, props.defaultDate],
  () => {
    if (!props.open) return
    Object.assign(form, blank())
    const e = props.event
    if (e) {
      form.title = e.title
      form.typeLabel = e.type === 'bill' ? 'Bill' : e.type === 'income' ? 'Income' : 'Reminder'
      form.date = e.date
      form.amount = e.amount
      form.note = e.note ?? ''
    }
  },
  { immediate: true }
)

const isValid = computed(() => form.title.trim() && form.date)

const submit = () => {
  if (!isValid.value) return
  const type: CalendarEventType =
    form.typeLabel === 'Income' ? 'income' : form.typeLabel === 'Reminder' ? 'reminder' : 'bill'
  const base = {
    title: form.title.trim(),
    type,
    date: form.date,
    amount: Number(form.amount) || 0,
    note: form.note.trim() || undefined,
  }
  if (props.event) emit('save', { ...props.event, ...base })
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

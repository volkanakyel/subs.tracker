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
        <div
          class="w-full max-w-[440px] rounded-xl bg-white border border-gray-100 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.25)] pointer-events-auto"
        >
          <header class="flex items-center justify-between px-5 pt-5 pb-1">
            <div>
              <h2 class="text-[15px] font-semibold text-gray-900 tracking-tight">
                {{ isEdit ? 'Edit subscription' : 'New subscription' }}
              </h2>
              <p class="text-[11px] text-gray-400 mt-0.5">
                {{ isEdit ? 'Update the details below.' : 'Track a new recurring charge.' }}
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
                placeholder="Netflix"
                class="form-input"
              />
            </Field>

            <div class="grid grid-cols-2 gap-3">
              <Field label="Price">
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] text-gray-400">$</span>
                  <input
                    v-model.number="form.price"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="9.99"
                    class="form-input pl-6"
                  />
                </div>
              </Field>

              <Field label="Cycle">
                <SegmentedControl v-model="form.cycle" :options="cycleOptions" />
              </Field>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <Field label="Category">
                <select v-model="form.category" class="form-input">
                  <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
                </select>
              </Field>

              <Field label="Next renewal">
                <input v-model="form.nextRenewal" type="date" required class="form-input" />
              </Field>
            </div>

            <Field label="Icon URL" hint="Optional · path to an SVG in /public">
              <input
                v-model="form.icon"
                type="text"
                placeholder="/icons/netflix.svg"
                class="form-input"
              />
            </Field>

            <Field label="Status">
              <SegmentedControl v-model="form.status" :options="statusOptions" />
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
                {{ isEdit ? 'Save changes' : 'Add subscription' }}
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
import { CATEGORIES, type Subscription, type SubscriptionCycle, type SubscriptionStatus } from '~/composables/useSubscriptions'

const props = defineProps<{
  open: boolean
  subscription?: Subscription | null
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'save', value: Subscription | Omit<Subscription, 'id'>): void
  (e: 'delete'): void
}>()

const categories = CATEGORIES
const cycleOptions = ['Monthly', 'Yearly']
const statusOptions = ['Active', 'Paused']

const isEdit = computed(() => !!props.subscription)

const today = new Date().toISOString().slice(0, 10)

const blank = () => ({
  name: '',
  price: 0,
  cycle: 'Monthly',
  category: CATEGORIES[0] as string,
  nextRenewal: today,
  startedAt: today,
  status: 'Active',
  icon: '',
})

const form = reactive(blank())

watch(
  () => [props.open, props.subscription],
  () => {
    if (!props.open) return
    const s = props.subscription
    Object.assign(form, blank())
    if (s) {
      form.name = s.name
      form.price = s.price
      form.cycle = s.cycle === 'yearly' ? 'Yearly' : 'Monthly'
      form.category = s.category
      form.nextRenewal = s.nextRenewal
      form.startedAt = s.startedAt
      form.status = s.status === 'paused' ? 'Paused' : 'Active'
      form.icon = s.icon
    }
  },
  { immediate: true }
)

const isValid = computed(() => form.name.trim() && form.price >= 0 && form.nextRenewal)

const submit = () => {
  if (!isValid.value) return
  const base = {
    name: form.name.trim(),
    price: Number(form.price) || 0,
    cycle: (form.cycle.toLowerCase() as SubscriptionCycle),
    category: form.category,
    nextRenewal: form.nextRenewal,
    startedAt: form.startedAt,
    status: (form.status.toLowerCase() as SubscriptionStatus),
    icon: form.icon.trim(),
  }
  if (props.subscription) {
    emit('save', { ...props.subscription, ...base })
  } else {
    emit('save', base)
  }
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

<template>
  <div class="min-h-screen bg-[#f8f9fb] antialiased font-sans">
    <DashboardSidebar />

    <div class="lg:ml-[240px] min-h-screen pb-24 lg:pb-0">
      <DashboardTopbar
        title="Subscriptions"
        subtitle="Track every recurring charge in one place"
      />

      <main class="max-w-[1240px] mx-auto px-5 sm:px-7 lg:px-10 py-6 lg:py-8 space-y-5">
        <!-- Summary -->
        <MotionItem :delay="0.04">
          <BaseCard :padded="false">
            <div class="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-gray-100 p-2">
              <StatTile
                label="Monthly"
                :value="`$${monthlyTotal.toFixed(2)}`"
                :hint="`${activeCount} active subscription${activeCount === 1 ? '' : 's'}`"
              />
              <StatTile
                label="Yearly projection"
                :value="`$${yearlyTotal.toFixed(0)}`"
                hint="Based on current cycles"
              />
              <StatTile
                label="Next renewal"
                :value="nextRenewal.label"
                :hint="nextRenewal.hint"
              />
              <StatTile
                label="Highest"
                :value="highest ? `$${highest.price.toFixed(2)}` : '—'"
                :hint="highest?.name ?? 'No active subscriptions'"
              />
            </div>
          </BaseCard>
        </MotionItem>

        <!-- Toolbar -->
        <MotionItem :delay="0.10">
          <div class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-2">
            <div class="relative flex-1 max-w-sm">
              <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" :stroke-width="2" />
              <input
                v-model="query"
                class="w-full rounded-md border border-gray-200/70 bg-white py-2 pl-9 pr-3 text-[12.5px] text-gray-700 placeholder-gray-400 focus:border-gray-300 focus:ring-2 focus:ring-gray-100 focus:outline-none transition-all"
                placeholder="Search subscriptions…"
              />
            </div>

            <div class="flex items-center gap-2 sm:ml-auto">
              <SegmentedControl v-model="filter" :options="filterOptions" />
              <button
                class="inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-gray-900 text-white text-[11.5px] font-medium hover:bg-gray-800 transition-colors"
                @click="openCreate"
              >
                <Plus class="h-3.5 w-3.5" :stroke-width="2.25" />
                Add
              </button>
            </div>
          </div>
        </MotionItem>

        <!-- List -->
        <MotionItem :delay="0.16">
          <BaseCard :padded="false">
            <div class="px-4 pt-4 pb-2 grid grid-cols-[1fr_110px_120px_140px_100px_32px] gap-4 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              <span>Service</span>
              <span>Category</span>
              <span>Cycle</span>
              <span>Next renewal</span>
              <span class="text-right">Price</span>
              <span />
            </div>

            <div class="px-2 pb-2 min-h-[120px]">
              <TransitionGroup name="row" tag="div">
                <SubscriptionRow
                  v-for="sub in filtered"
                  :key="sub.id"
                  :sub="sub"
                  @edit="openEdit"
                  @toggle="onToggle"
                  @delete="confirmDelete"
                />
              </TransitionGroup>

              <div v-if="!filtered.length" class="px-4 py-16 text-center">
                <p class="text-[13px] text-gray-500 font-medium">No subscriptions match</p>
                <p class="text-[11px] text-gray-400 mt-1">Try a different search, filter, or add one.</p>
              </div>
            </div>
          </BaseCard>
        </MotionItem>
      </main>
    </div>

    <!-- Edit / Add dialog -->
    <SubscriptionDialog
      :open="dialogOpen"
      :subscription="editing"
      @update:open="dialogOpen = $event"
      @save="onSave"
      @delete="confirmDelete(editing!)"
    />

    <!-- Delete confirmation -->
    <Teleport to="body">
      <Transition name="backdrop">
        <div
          v-if="pendingDelete"
          class="fixed inset-0 z-40 bg-gray-900/30 backdrop-blur-[2px]"
          @click="pendingDelete = null"
        />
      </Transition>
      <Transition name="dialog">
        <div
          v-if="pendingDelete"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
        >
          <div class="w-full max-w-[380px] rounded-xl bg-white border border-gray-100 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.25)] pointer-events-auto p-5">
            <h3 class="text-[14px] font-semibold text-gray-900 tracking-tight">Delete subscription?</h3>
            <p class="text-[12px] text-gray-500 mt-1.5">
              <span class="font-medium text-gray-700">{{ pendingDelete.name }}</span> will be removed from your tracked subscriptions. This can't be undone.
            </p>
            <div class="flex items-center justify-end gap-2 mt-5">
              <button
                class="h-8 px-3.5 rounded-md text-[12px] font-medium text-gray-600 hover:text-gray-900 transition-colors"
                @click="pendingDelete = null"
              >
                Cancel
              </button>
              <button
                class="h-8 px-3.5 rounded-md bg-red-600 text-white text-[12px] font-medium hover:bg-red-700 transition-colors"
                @click="onDelete"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { Plus, Search } from 'lucide-vue-next'
import type { Subscription } from '~/composables/useSubscriptions'

const { subscriptions, add, update, remove, togglePause } = useSubscriptions()

const filterOptions = ['All', 'Monthly', 'Yearly', 'Paused'] as const
const filter = ref<string>('All')
const query = ref('')

const dialogOpen = ref(false)
const editing = ref<Subscription | null>(null)
const pendingDelete = ref<Subscription | null>(null)

const openCreate = () => {
  editing.value = null
  dialogOpen.value = true
}
const openEdit = (sub: Subscription) => {
  editing.value = sub
  dialogOpen.value = true
}
const onToggle = (sub: Subscription) => togglePause(sub.id)
const confirmDelete = (sub: Subscription) => {
  dialogOpen.value = false
  pendingDelete.value = sub
}
const onDelete = () => {
  if (pendingDelete.value) remove(pendingDelete.value.id)
  pendingDelete.value = null
  editing.value = null
}
const onSave = (value: Subscription | Omit<Subscription, 'id'>) => {
  if ('id' in value) update(value.id, value)
  else add(value)
  dialogOpen.value = false
  editing.value = null
}

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return subscriptions.value
    .filter((s) => {
      if (filter.value === 'Monthly' && (s.cycle !== 'monthly' || s.status !== 'active')) return false
      if (filter.value === 'Yearly' && (s.cycle !== 'yearly' || s.status !== 'active')) return false
      if (filter.value === 'Paused' && s.status !== 'paused') return false
      if (!q) return true
      return s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)
    })
    .slice()
    .sort((a, b) => b.price - a.price)
})

const active = computed(() => subscriptions.value.filter((s) => s.status === 'active'))
const activeCount = computed(() => active.value.length)

const monthlyTotal = computed(() =>
  active.value.reduce((sum, s) => sum + (s.cycle === 'yearly' ? s.price / 12 : s.price), 0)
)
const yearlyTotal = computed(() =>
  active.value.reduce((sum, s) => sum + (s.cycle === 'yearly' ? s.price : s.price * 12), 0)
)

const highest = computed<Subscription | null>(() => {
  if (!active.value.length) return null
  return active.value.reduce((max, s) => (s.price > max.price ? s : max))
})

const nextRenewal = computed(() => {
  const sorted = active.value
    .slice()
    .sort((a, b) => new Date(a.nextRenewal).getTime() - new Date(b.nextRenewal).getTime())
  const next = sorted[0]
  if (!next) return { label: '—', hint: '' }
  const d = new Date(next.nextRenewal)
  const today = new Date()
  const days = Math.max(0, Math.round((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))
  return {
    label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    hint: `${next.name} · in ${days} day${days === 1 ? '' : 's'}`,
  }
})

useHead({ title: 'Subscriptions · FinanceHub' })
</script>

<style scoped>
.row-enter-active {
  transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.row-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
  position: absolute;
  width: calc(100% - 1rem);
}
.row-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.row-leave-to {
  opacity: 0;
  transform: translateX(8px);
}
.row-move {
  transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
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

<template>
  <div class="min-h-screen bg-[#f8f9fb] antialiased font-sans">
    <DashboardSidebar />

    <div class="lg:ml-[240px] min-h-screen pb-24 lg:pb-0">
      <DashboardTopbar
        title="Goals"
        subtitle="Save toward what matters most"
      />

      <main class="max-w-[1240px] mx-auto px-5 sm:px-7 lg:px-10 py-6 lg:py-8 space-y-5">
        <!-- Summary -->
        <MotionItem :delay="0.04">
          <BaseCard :padded="false">
            <div class="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-gray-100 p-2">
              <StatTile
                label="Saved"
                :value="`$${totalSaved.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`"
                :hint="`${goals.length} goal${goals.length === 1 ? '' : 's'}`"
              />
              <StatTile
                label="Target"
                :value="`$${totalTarget.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`"
                hint="Combined target"
              />
              <StatTile
                label="Progress"
                :value="`${overallPct.toFixed(0)}%`"
                :hint="`$${totalRemaining.toLocaleString()} to go`"
              />
              <StatTile
                label="Completed"
                :value="`${completedCount} / ${goals.length}`"
                :hint="completedCount === goals.length && goals.length > 0 ? 'All reached' : 'Goals achieved'"
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
                class="w-full rounded border border-gray-200/70 bg-white py-2 pl-9 pr-3 text-[12.5px] text-gray-700 placeholder-gray-400 focus:border-gray-300 focus:ring-2 focus:ring-gray-100 focus:outline-none transition-all"
                placeholder="Search goals…"
              />
            </div>

            <div class="flex items-center gap-2 sm:ml-auto">
              <SegmentedControl v-model="filter" :options="filterOptions" />
              <button
                class="inline-flex items-center gap-1.5 h-8 px-3 rounded bg-gray-900 text-white text-[11.5px] font-medium hover:bg-gray-800 transition-colors"
                @click="openCreate"
              >
                <Plus class="h-3.5 w-3.5" :stroke-width="2.25" />
                Add
              </button>
            </div>
          </div>
        </MotionItem>

        <!-- Grid -->
        <MotionItem :delay="0.14">
          <TransitionGroup
            name="card"
            tag="div"
            class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5"
          >
            <GoalCard
              v-for="g in filtered"
              :key="g.id"
              :goal="g"
              @edit="openEdit"
              @delete="confirmDelete"
              @contribute="openContribute"
            />
          </TransitionGroup>

          <div
            v-if="!filtered.length"
            class="rounded-md bg-white border border-gray-100/80 px-4 py-16 text-center"
          >
            <p class="text-[13px] text-gray-500 font-medium">No goals match</p>
            <p class="text-[11px] text-gray-400 mt-1">Try a different search, filter, or add one.</p>
          </div>
        </MotionItem>
      </main>
    </div>

    <GoalDialog
      :open="dialogOpen"
      :goal="editing"
      @update:open="dialogOpen = $event"
      @save="onSave"
      @delete="confirmDelete(editing!)"
    />

    <ContributeDialog
      :open="contributeOpen"
      :goal="contributing"
      @update:open="contributeOpen = $event"
      @contribute="onContribute"
    />

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
          <div class="w-full max-w-[380px] rounded-lg bg-white border border-gray-100 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.25)] pointer-events-auto p-5">
            <h3 class="text-[14px] font-semibold text-gray-900 tracking-tight">Delete goal?</h3>
            <p class="text-[12px] text-gray-500 mt-1.5">
              <span class="font-medium text-gray-700">{{ pendingDelete.name }}</span> will be removed. You'll lose the saved progress tracking. This can't be undone.
            </p>
            <div class="flex items-center justify-end gap-2 mt-5">
              <button
                class="h-8 px-3.5 rounded text-[12px] font-medium text-gray-600 hover:text-gray-900 transition-colors"
                @click="pendingDelete = null"
              >
                Cancel
              </button>
              <button
                class="h-8 px-3.5 rounded bg-red-600 text-white text-[12px] font-medium hover:bg-red-700 transition-colors"
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
import { goalComplete, goalPct, type Goal } from '~/composables/useGoals'

const { goals, add, update, remove, contribute } = useGoals()

const filterOptions = ['All', 'Active', 'Almost there', 'Complete'] as const
const filter = ref<string>('All')
const query = ref('')

const dialogOpen = ref(false)
const editing = ref<Goal | null>(null)

const contributeOpen = ref(false)
const contributing = ref<Goal | null>(null)

const pendingDelete = ref<Goal | null>(null)

const openCreate = () => {
  editing.value = null
  dialogOpen.value = true
}
const openEdit = (g: Goal) => {
  editing.value = g
  dialogOpen.value = true
}
const openContribute = (g: Goal) => {
  contributing.value = g
  contributeOpen.value = true
}
const confirmDelete = (g: Goal) => {
  dialogOpen.value = false
  pendingDelete.value = g
}
const onDelete = () => {
  if (pendingDelete.value) remove(pendingDelete.value.id)
  pendingDelete.value = null
  editing.value = null
}
const onSave = (value: Goal | Omit<Goal, 'id'>) => {
  if ('id' in value) update(value.id, value)
  else add(value)
  dialogOpen.value = false
  editing.value = null
}
const onContribute = (amount: number) => {
  if (contributing.value) contribute(contributing.value.id, amount)
  contributeOpen.value = false
  contributing.value = null
}

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return goals.value
    .filter((g) => {
      const pct = goalPct(g)
      if (filter.value === 'Active' && goalComplete(g)) return false
      if (filter.value === 'Almost there' && (pct < 70 || goalComplete(g))) return false
      if (filter.value === 'Complete' && !goalComplete(g)) return false
      if (!q) return true
      return g.name.toLowerCase().includes(q) || (g.note ?? '').toLowerCase().includes(q)
    })
    .slice()
    .sort((a, b) => {
      const ac = goalComplete(a) ? 1 : 0
      const bc = goalComplete(b) ? 1 : 0
      if (ac !== bc) return ac - bc
      return goalPct(b) - goalPct(a)
    })
})

const totalSaved = computed(() => goals.value.reduce((s, g) => s + g.current, 0))
const totalTarget = computed(() => goals.value.reduce((s, g) => s + g.target, 0))
const totalRemaining = computed(() => Math.max(0, totalTarget.value - totalSaved.value))
const overallPct = computed(() => (totalTarget.value ? (totalSaved.value / totalTarget.value) * 100 : 0))
const completedCount = computed(() => goals.value.filter(goalComplete).length)

useHead({ title: 'Goals · FinanceHub' })
</script>

<style scoped>
.card-enter-active {
  transition: opacity 0.28s ease, transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.card-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
  position: absolute;
}
.card-enter-from {
  opacity: 0;
  transform: translateY(8px) scale(0.98);
}
.card-leave-to {
  opacity: 0;
  transform: scale(0.96);
}
.card-move {
  transition: transform 0.32s cubic-bezier(0.2, 0.8, 0.2, 1);
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

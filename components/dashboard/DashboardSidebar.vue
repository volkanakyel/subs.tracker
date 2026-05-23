<template>
  <aside class="hidden lg:flex fixed left-0 top-0 z-30 w-[260px] h-screen bg-white border-r border-black/[0.07] flex-col overflow-hidden">
    <div class="relative flex items-center justify-between gap-2 px-5 pt-5 pb-4">
      <div class="flex items-center gap-2.5">
        <span class="metallic-accent h-7 w-7 rounded-md flex items-center justify-center text-white text-[10px] font-semibold tracking-tight">FH</span>
        <div class="flex flex-col">
          <span class="text-[13.5px] font-semibold text-gray-900 tracking-[-0.012em] leading-none">FinanceHub</span>
          <span class="label-mono text-[8.5px] text-gray-500 mt-1">Personal · v2.4</span>
        </div>
      </div>
      <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm nested-surface label-mono text-[9px] text-[#3F4248]">
        <span class="h-1 w-1 rounded-full bg-emerald-500" />
        Pro
      </span>
    </div>

    <div class="mx-5 hairline mb-4" />

    <!-- Workspace tile -->
    <div class="mx-3 mb-4 rounded-md card-shine bg-[#f6f5f1] border border-gray-200/60 px-3.5 py-3">
      <div class="flex items-center justify-between gap-2">
        <p class="label-mono text-[9px] text-gray-500">Net worth</p>
        <span class="numbered-index text-[9px]">#01</span>
      </div>
      <p class="text-[19px] font-semibold text-gray-900 tabular-nums tracking-[-0.02em] mt-1.5">${{ netWorth.toLocaleString('en-US', { maximumFractionDigits: 0 }) }}</p>
      <div class="flex items-center justify-between mt-1.5">
        <span class="text-[10px] tabular-nums text-emerald-700 font-medium">+{{ netWorthTrend }}%</span>
        <span class="label-mono text-[8.5px] text-gray-400">vs last month</span>
      </div>
      <div class="bar-track mt-2.5">
        <div class="bar-fill transition-[width] duration-700 ease-out" :style="{ width: `${netWorthProgress}%` }" />
      </div>
    </div>

    <nav class="px-3 flex-1 overflow-y-auto">
      <SidebarSection label="Overview" :items="mainItems" />
      <SidebarSection label="Tracking" :items="trackingItems" class="mt-5" />
    </nav>

    <!-- Status row -->
    <div class="mx-5 mb-3 flex items-center justify-between">
      <span class="inline-flex items-center gap-1.5 text-[10px] text-gray-600">
        <span class="relative h-1.5 w-1.5 rounded-full bg-emerald-500 text-emerald-500 pulse-dot" />
        All synced
      </span>
      <span class="label-mono text-[9px] text-gray-500">2m ago</span>
    </div>

    <div class="mx-3 hairline mb-2" />

    <div class="px-3 pb-3 pt-1">
      <div ref="profileRef" class="relative">
        <div
          :class="[
            'flex items-center gap-3 rounded-md p-1.5 transition-colors',
            menuOpen ? 'bg-gray-100/80' : 'hover:bg-gray-50',
          ]"
        >
          <button
            class="flex items-center gap-3 flex-1 min-w-0 text-left focus:outline-none"
            :data-open="menuOpen"
            aria-label="Account menu"
            @click.stop="menuOpen = !menuOpen"
          >
            <div class="h-9 w-9 rounded-full metallic-accent flex items-center justify-center text-white text-[10.5px] font-semibold tracking-wide shrink-0">
              {{ user.initials }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-[12.5px] font-medium text-gray-900 truncate leading-tight">{{ user.name }}</p>
              <p class="label-mono text-[9px] text-gray-500 truncate mt-0.5">{{ user.email }}</p>
            </div>
          </button>

          <button
            :class="[
              'h-7 w-7 flex items-center justify-center rounded transition-colors',
              menuOpen ? 'bg-white text-gray-800 shadow-[0_1px_2px_rgba(0,0,0,0.05)]' : 'text-gray-500 hover:bg-white hover:text-gray-800',
            ]"
            :data-open="menuOpen"
            aria-label="Settings"
            @click.stop="menuOpen = !menuOpen"
          >
            <Settings class="h-3.5 w-3.5" :stroke-width="1.75" />
          </button>
        </div>

        <Popover
          :open="menuOpen"
          :width="240"
          placement="top-left"
          teleport
          :anchor="profileRef"
        >
          <UserMenu @select="menuOpen = false" />
        </Popover>
      </div>
    </div>
  </aside>

  <nav class="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-t border-gray-200">
    <div class="flex items-center justify-around px-2 pt-2 pb-safe">
      <NuxtLink
        v-for="item in navigation.mobile"
        :key="item.label"
        :to="item.to"
        :class="[
          'flex flex-col items-center gap-1 px-3 py-1.5 rounded min-w-[56px] transition-colors',
          isActive(item.to) ? 'text-gray-900' : 'text-gray-500 active:text-gray-800',
        ]"
      >
        <div
          :class="[
            'flex items-center justify-center h-8 w-8 rounded transition-colors',
            isActive(item.to) ? 'bg-gray-100' : '',
          ]"
        >
          <component :is="item.icon" class="h-[18px] w-[18px]" :stroke-width="isActive(item.to) ? 2 : 1.5" />
        </div>
        <span class="text-[9px] font-medium leading-none">{{ item.label }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { Settings } from 'lucide-vue-next'

const { navigation, user } = useDashboardData()
const { accounts } = useAccounts()
const { transactions } = useTransactions()
const { subscriptions } = useSubscriptions()
const { goals } = useGoals()
const { holdings } = useInvestments()
const { events } = useCalendarEvents()
const { budgets } = useBudgets()

const route = useRoute()
const isActive = (to: string) => (to === '/' ? route.path === '/' : route.path.startsWith(to))

const menuOpen = ref(false)
const profileRef = ref<HTMLElement | null>(null)
useClickOutside(profileRef, () => (menuOpen.value = false))

const countFor = (to: string): string | undefined => {
  switch (to) {
    case '/accounts':      return String(accounts.value.length)
    case '/transactions':  return String(transactions.value.length)
    case '/investments':   return String(holdings.value.length)
    case '/subscriptions': return String(subscriptions.value.filter((s) => s.status === 'active').length)
    case '/goals':         return String(goals.value.filter((g) => g.current < g.target).length)
    case '/budget':        return String(budgets.value.length)
    case '/calendar':      return String(events.value.length)
    default:               return undefined
  }
}

const enrich = (items: typeof navigation.main) =>
  items.map((item) => ({ ...item, badge: item.badge ?? countFor(item.to) }))

const mainItems = computed(() => enrich(navigation.main))
const trackingItems = computed(() => enrich(navigation.tracking))

const netWorth = computed(() => accounts.value.reduce((s, a) => s + a.balance, 0))
const netWorthTrend = 5.3
const netWorthProgress = computed(() => Math.min(100, Math.max(8, (netWorth.value / 60000) * 100)))
</script>

<style scoped>
.pb-safe {
  padding-bottom: max(0.5rem, env(safe-area-inset-bottom));
}
</style>

<template>
  <header class="relative z-10 px-6 sm:px-8 lg:px-10 pt-8 lg:pt-12 pb-10 border-b border-black/[0.07]">
    <div class="flex items-start justify-between gap-6">
      <div class="min-w-0 flex-1">
        <div class="flex items-center gap-2 mb-3">
          <span class="label-mono text-[10px] text-gray-500">
            <span v-if="title">Workspace · {{ title }}</span>
            <span v-else>{{ formattedDate }}</span>
          </span>
          <span class="numbered-index text-[10px]">#01</span>
        </div>
        <h1 class="display-headline text-[32px] sm:text-[40px] lg:text-[44px] text-gray-900 truncate">
          {{ title ?? defaultTitle }}
        </h1>
        <p class="text-[13px] text-gray-600 mt-2.5 max-w-[640px]">{{ subtitle ?? "Here's your financial overview" }}</p>
      </div>

      <div class="flex items-center gap-2 flex-shrink-0 pt-1">
        <!-- Live status pill -->
        <span class="hidden lg:inline-flex items-center gap-2 h-9 px-3 rounded-md border border-gray-200 bg-[#f6f5f1] text-[11px] text-gray-700 font-medium">
          <span class="relative h-1.5 w-1.5 rounded-full bg-emerald-500 text-emerald-500 pulse-dot" />
          Live
          <span class="text-gray-300">·</span>
          <span class="label-mono text-[9px] text-gray-500">Synced 2m</span>
        </span>

        <div class="relative hidden md:block">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" :stroke-width="2" />
          <input
            class="w-48 lg:w-56 h-9 rounded-md border border-gray-200 bg-[#f6f5f1] pl-8.5 pr-10 text-[12.5px] text-gray-800 placeholder-gray-500 focus:bg-white focus:border-[#6E727A]/60 focus:ring-2 focus:ring-[#6E727A]/15 focus:outline-none transition-all"
            placeholder="Search…"
            style="padding-left: 2.125rem"
          />
          <kbd class="absolute right-2.5 top-1/2 -translate-y-1/2 hidden lg:inline-flex items-center h-[19px] px-1.5 rounded-sm border border-gray-200 bg-white text-[9px] font-semibold tabular-nums text-gray-500">⌘K</kbd>
        </div>

        <button class="md:hidden h-9 w-9 flex items-center justify-center rounded-md bg-[#f6f5f1] border border-gray-200 hover:border-gray-300 transition-colors">
          <Search class="h-3.5 w-3.5 text-gray-700" :stroke-width="2" />
        </button>

        <!-- Notifications -->
        <div ref="notifRef" class="relative">
          <button
            class="relative h-9 w-9 flex items-center justify-center rounded-md bg-[#f6f5f1] border border-gray-200 hover:border-gray-300 transition-colors data-[open=true]:border-gray-400 data-[open=true]:bg-white"
            :data-open="openPanel === 'notifications'"
            aria-label="Notifications"
            @click.stop="toggle('notifications')"
          >
            <Bell class="h-3.5 w-3.5 text-gray-700" :stroke-width="2" />
            <span
              v-if="unreadCount"
              class="absolute -top-1 -right-1 inline-flex items-center justify-center h-[15px] min-w-[15px] px-1 rounded-full metallic-accent text-white text-[9px] font-semibold tabular-nums ring-2 ring-white"
            >
              {{ unreadCount }}
            </span>
          </button>

          <Popover :open="openPanel === 'notifications'" :width="360">
            <NotificationCenter />
          </Popover>
        </div>

        <!-- User -->
        <div ref="userRef" class="relative">
          <button
            class="h-9 w-9 rounded-full metallic-accent flex items-center justify-center text-white text-[10.5px] font-semibold tracking-wide ring-offset-2 ring-offset-white transition-all data-[open=true]:ring-2 data-[open=true]:ring-gray-300"
            :data-open="openPanel === 'user'"
            aria-label="Account menu"
            @click.stop="toggle('user')"
          >
            {{ user.initials }}
          </button>

          <Popover :open="openPanel === 'user'" :width="240">
            <UserMenu @select="onMenuSelect" />
          </Popover>
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Bell, Search } from 'lucide-vue-next'

defineProps<{ title?: string; subtitle?: string }>()

const { user } = useDashboardData()
const { unreadCount } = useNotifications()

const openPanel = ref<'notifications' | 'user' | null>(null)
const notifRef = ref<HTMLElement | null>(null)
const userRef = ref<HTMLElement | null>(null)

const toggle = (panel: 'notifications' | 'user') => {
  openPanel.value = openPanel.value === panel ? null : panel
}

useClickOutside(notifRef, (e) => {
  if (openPanel.value !== 'notifications') return
  if (userRef.value && e.target instanceof Node && userRef.value.contains(e.target)) return
  openPanel.value = null
})
useClickOutside(userRef, (e) => {
  if (openPanel.value !== 'user') return
  if (notifRef.value && e.target instanceof Node && notifRef.value.contains(e.target)) return
  openPanel.value = null
})

const onMenuSelect = (_label: string) => {
  openPanel.value = null
}

const defaultTitle = 'Good morning, Sibel'
const formattedDate = new Date().toLocaleDateString('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
})
</script>

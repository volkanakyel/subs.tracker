<template>
  <header class="sticky top-0 z-20 bg-[#f8f9fb]/85 backdrop-blur-xl border-b border-gray-100/60">
    <div class="flex items-center justify-between gap-4 px-5 sm:px-7 lg:px-10 py-4">
      <div class="min-w-0">
        <div class="flex items-center gap-2">
          <h1 class="text-[15px] font-semibold text-gray-900 tracking-tight truncate">
            {{ title ?? defaultTitle }}
          </h1>
          <span v-if="!title" class="hidden sm:inline-flex text-[11px] text-gray-400 font-medium tabular-nums">
            · {{ formattedDate }}
          </span>
        </div>
        <p class="text-[11px] text-gray-400 mt-0.5">{{ subtitle ?? "Here's your financial overview" }}</p>
      </div>

      <div class="flex items-center gap-1.5 flex-shrink-0">
        <div class="relative hidden md:block">
          <Search class="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" :stroke-width="2" />
          <input
            class="w-44 lg:w-52 rounded-md border border-gray-200/70 bg-white py-1.5 pl-7 pr-3 text-[12px] text-gray-700 placeholder-gray-400 focus:border-gray-300 focus:ring-2 focus:ring-gray-100 focus:outline-none transition-all"
            placeholder="Search…"
          />
        </div>

        <button class="md:hidden h-8 w-8 flex items-center justify-center rounded-md bg-white border border-gray-100 hover:border-gray-200 transition-colors">
          <Search class="h-3.5 w-3.5 text-gray-500" :stroke-width="2" />
        </button>

        <button class="relative h-8 w-8 flex items-center justify-center rounded-md bg-white border border-gray-100 hover:border-gray-200 transition-colors">
          <Bell class="h-3.5 w-3.5 text-gray-500" :stroke-width="2" />
          <span class="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-gray-900 ring-2 ring-white" />
        </button>

        <div class="h-8 w-8 rounded-full bg-gray-900 flex items-center justify-center text-white text-[10px] font-semibold tracking-wide">
          {{ user.initials }}
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { Bell, Search } from 'lucide-vue-next'

defineProps<{ title?: string; subtitle?: string }>()

const { user } = useDashboardData()
const defaultTitle = 'Good morning, Sibel'
const formattedDate = new Date().toLocaleDateString('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
})
</script>

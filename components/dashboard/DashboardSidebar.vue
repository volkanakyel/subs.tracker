<template>
  <aside class="hidden lg:flex fixed left-0 top-0 z-30 w-[240px] h-screen bg-white border-r border-gray-100 flex-col">
    <div class="flex items-center gap-2 px-6 pt-6 pb-8">
      <img src="/icons/logo.png" alt="logo" class="h-5 w-5 object-cover" />
      <span class="text-[14px] font-semibold text-gray-900 tracking-tight">FinanceHub</span>
    </div>

    <nav class="px-3 flex-1 overflow-y-auto">
      <SidebarSection label="Overview" :items="navigation.main" />
      <SidebarSection label="Tracking" :items="navigation.tracking" class="mt-6" />
    </nav>

    <div class="px-4 pb-5 pt-4 border-t border-gray-100">
      <div class="flex items-center gap-3 px-1">
        <div class="h-8 w-8 rounded-full bg-gray-900 flex items-center justify-center text-white text-[10px] font-semibold tracking-wide">
          {{ user.initials }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-[12px] font-medium text-gray-900 truncate leading-tight">{{ user.name }}</p>
          <p class="text-[10px] text-gray-400 truncate mt-0.5">{{ user.email }}</p>
        </div>
        <button class="h-7 w-7 flex items-center justify-center rounded-md hover:bg-gray-50 text-gray-400 transition-colors">
          <Settings class="h-3.5 w-3.5" :stroke-width="1.75" />
        </button>
      </div>
    </div>
  </aside>

  <nav class="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/85 backdrop-blur-xl border-t border-gray-100">
    <div class="flex items-center justify-around px-2 pt-2 pb-safe">
      <NuxtLink
        v-for="item in navigation.mobile"
        :key="item.label"
        :to="item.to"
        :class="[
          'flex flex-col items-center gap-1 px-3 py-1.5 rounded-md min-w-[56px] transition-colors',
          isActive(item.to) ? 'text-gray-900' : 'text-gray-400 active:text-gray-700',
        ]"
      >
        <div
          :class="[
            'flex items-center justify-center h-8 w-8 rounded-md transition-colors',
            isActive(item.to) ? 'bg-gray-50' : '',
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
import { Settings } from 'lucide-vue-next'
import { useRoute } from 'vue-router'

const { navigation, user } = useDashboardData()
const route = useRoute()
const isActive = (to: string) => (to === '/' ? route.path === '/' : route.path.startsWith(to))
</script>

<style scoped>
.pb-safe {
  padding-bottom: max(0.5rem, env(safe-area-inset-bottom));
}
</style>

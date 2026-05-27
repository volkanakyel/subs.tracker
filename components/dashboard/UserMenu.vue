<template>
  <div class="py-1.5">
    <div class="flex items-center gap-3 px-3 py-2">
      <div class="h-9 w-9 rounded-full metallic-accent flex items-center justify-center text-white text-[11px] font-semibold tracking-wide flex-shrink-0">
        {{ user.initials }}
      </div>
      <div class="min-w-0">
        <p class="text-[12.5px] font-medium text-gray-900 truncate leading-tight">{{ user.name }}</p>
        <p class="text-[10.5px] text-gray-500 truncate mt-0.5">{{ user.email }}</p>
      </div>
    </div>

    <div class="h-px bg-gray-100 my-1" />

    <button
      v-for="item in items"
      :key="item.label"
      class="w-full flex items-center gap-2.5 px-3 py-1.5 text-[12px] text-gray-700 hover:bg-gray-50 transition-colors"
      @click="$emit('select', item.label)"
    >
      <component :is="item.icon" class="h-3.5 w-3.5 text-gray-500" :stroke-width="1.75" />
      <span>{{ item.label }}</span>
      <span
        v-if="item.shortcut"
        class="ml-auto text-[9px] font-medium text-gray-300 tabular-nums tracking-wider"
      >
        {{ item.shortcut }}
      </span>
    </button>

    <div class="h-px bg-gray-100 my-1" />

    <button
      class="w-full flex items-center gap-2.5 px-3 py-1.5 text-[12px] text-gray-700 hover:bg-gray-50 transition-colors"
      @click="$emit('select', 'Sign out')"
    >
      <LogOut class="h-3.5 w-3.5 text-gray-500" :stroke-width="1.75" />
      <span>Sign out</span>
    </button>
  </div>
</template>

<script lang="ts" setup>
import { CircleUser, HelpCircle, LogOut, Moon, Settings } from 'lucide-vue-next'

defineEmits<{ (e: 'select', label: string): void }>()

const { user } = useDashboardData()

const items = [
  { label: 'Profile',  icon: CircleUser,  shortcut: '⌘P' },
  { label: 'Settings', icon: Settings,    shortcut: '⌘,' },
  { label: 'Theme',    icon: Moon,        shortcut: '' },
  { label: 'Help',     icon: HelpCircle,  shortcut: '?' },
]
</script>

<template>
  <div>
    <p class="label-mono px-3 mb-2 text-[10px] text-gray-400">{{ label }}</p>
    <NuxtLink
      v-for="item in items"
      :key="item.label"
      :to="item.to"
      :class="[
        'flex items-center gap-3 px-3 py-2 mb-0.5 rounded text-[12.5px] transition-colors',
        isActive(item.to)
          ? 'metallic-accent text-white font-medium'
          : 'text-gray-500 hover:text-gray-900 hover:bg-white/60',
      ]"
    >
      <component :is="item.icon" class="h-4 w-4" :stroke-width="1.75" />
      <span>{{ item.label }}</span>
      <span
        v-if="item.badge"
        :class="[
          'ml-auto text-[9px] font-medium px-1.5 py-0.5 rounded-full tabular-nums',
          isActive(item.to) ? 'bg-white/15 text-white' : 'bg-gray-100 text-gray-500',
        ]"
      >
        {{ item.badge }}
      </span>
    </NuxtLink>
  </div>
</template>

<script lang="ts" setup>
import type { Component } from 'vue'
import { useRoute } from 'vue-router'

defineProps<{
  label: string
  items: { label: string; icon: Component; to: string; badge?: string }[]
}>()

const route = useRoute()
const isActive = (to: string) => (to === '/' ? route.path === '/' : route.path.startsWith(to))
</script>

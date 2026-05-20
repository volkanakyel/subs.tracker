<template>
  <div class="flex flex-col gap-2 px-5 py-4 first:pl-0 last:pr-0 flex-1 min-w-0">
    <p class="text-[10px] font-semibold uppercase tracking-widest text-gray-400">{{ label }}</p>
    <p class="text-[20px] font-semibold text-gray-900 tracking-tight tabular-nums leading-none truncate">{{ value }}</p>
    <p v-if="hint" class="text-[11px] text-gray-400 truncate">{{ hint }}</p>
  </div>
</template>

<script lang="ts" setup>
defineProps<{ label: string; value: string; hint?: string }>()
</script>

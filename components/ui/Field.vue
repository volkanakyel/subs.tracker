<template>
  <label class="block">
    <span class="block text-[10px] label-mono text-gray-400 mb-1.5">{{ label }}</span>
    <slot />
    <span v-if="hint" class="block text-[10px] text-gray-500 mt-1">{{ hint }}</span>
  </label>
</template>

<script lang="ts" setup>
defineProps<{ label: string; hint?: string }>()
</script>

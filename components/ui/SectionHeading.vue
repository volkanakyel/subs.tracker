<template>
  <div class="flex items-baseline justify-between gap-3 mb-6">
    <div class="flex items-center gap-2.5">
      <span v-if="eyebrow" class="label-mono text-[10px] text-gray-500">{{ eyebrow }}</span>
      <h2 class="text-[17px] font-semibold text-gray-900 tracking-[-0.018em]">{{ title }}</h2>
    </div>
    <span v-if="index" class="numbered-index">#{{ index }}</span>
  </div>
</template>

<script lang="ts" setup>
defineProps<{ title: string; eyebrow?: string; index?: string }>()
</script>

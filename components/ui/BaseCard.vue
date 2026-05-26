<template>
  <section :class="['inner-card h-full flex flex-col overflow-hidden', padded ? 'p-5 sm:p-6' : '']">
    <header v-if="title || $slots.header || eyebrow" class="flex items-start justify-between gap-3 mb-5">
      <div v-if="title || eyebrow" class="min-w-0">
        <p v-if="eyebrow" class="label-mono text-[10px] text-gray-500 mb-2">{{ eyebrow }}</p>
        <h3 v-if="title" class="text-[15px] font-semibold text-gray-900 tracking-[-0.014em] leading-tight">{{ title }}</h3>
        <p v-if="subtitle" class="text-[12px] text-gray-500 mt-1">{{ subtitle }}</p>
      </div>
      <slot name="header" />
    </header>
    <slot />
  </section>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    eyebrow?: string
    padded?: boolean
  }>(),
  { padded: true }
)
</script>

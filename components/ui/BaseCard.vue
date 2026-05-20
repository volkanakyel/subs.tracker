<template>
  <section :class="['h-full rounded-lg bg-white border border-gray-100/80 flex flex-col', padded ? 'p-5 sm:p-6' : '']">
    <header v-if="title || $slots.header" class="flex items-start justify-between gap-3 mb-5">
      <div v-if="title" class="min-w-0">
        <h3 class="text-[14px] font-semibold text-gray-900 tracking-tight">{{ title }}</h3>
        <p v-if="subtitle" class="text-[11px] text-gray-400 mt-0.5">{{ subtitle }}</p>
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
    padded?: boolean
  }>(),
  { padded: true }
)
</script>

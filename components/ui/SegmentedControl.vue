<template>
  <div class="inline-flex items-center gap-0.5 bg-gray-100/70 rounded p-0.5 border border-gray-200/60">
    <button
      v-for="opt in options"
      :key="opt"
      :class="[
        'text-[11px] px-2.5 py-1 rounded-[3px] transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6E727A]/30',
        modelValue === opt
          ? 'bg-white text-gray-900 font-medium shadow-[0_1px_2px_rgba(0,0,0,0.06),inset_0_0_0_1px_rgba(0,0,0,0.02)]'
          : 'text-gray-500 hover:text-gray-800'
      ]"
      @click="$emit('update:modelValue', opt)"
    >
      {{ opt }}
    </button>
  </div>
</template>

<script lang="ts" setup>
defineProps<{ options: readonly string[]; modelValue: string }>()
defineEmits<{ (e: 'update:modelValue', value: string): void }>()
</script>

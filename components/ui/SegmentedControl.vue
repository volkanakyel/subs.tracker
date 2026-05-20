<template>
  <div class="inline-flex items-center gap-0.5 bg-gray-50 rounded-md p-0.5">
    <button
      v-for="opt in options"
      :key="opt"
      :class="[
        'text-[11px] px-2.5 py-1 rounded-[5px] transition-colors duration-150',
        modelValue === opt
          ? 'bg-white text-gray-900 font-medium shadow-[0_1px_2px_rgba(0,0,0,0.04)]'
          : 'text-gray-400 hover:text-gray-700'
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

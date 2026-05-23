<template>
  <div
    class="card-shine group relative h-full rounded-md bg-white border border-gray-100/70 p-6 flex flex-col transition-colors hover:border-gray-200/80 overflow-hidden"
  >
    <header class="flex items-start justify-between gap-2">
      <div class="flex items-center gap-3 min-w-0">
        <div
          class="h-9 w-9 rounded flex items-center justify-center flex-shrink-0"
          :class="account.isPrimary ? 'metallic-accent text-white' : 'bg-gray-50 text-gray-700'"
        >
          <component :is="icon" class="h-4 w-4" :stroke-width="1.75" />
        </div>
        <div class="min-w-0">
          <p class="text-[13px] text-gray-900 font-medium truncate leading-tight">{{ account.name }}</p>
          <p class="text-[11px] text-gray-500 mt-0.5 truncate">{{ account.institution }}</p>
        </div>
      </div>

      <div ref="menuRef" class="relative">
        <button
          class="h-7 w-7 flex items-center justify-center rounded text-gray-300 hover:text-gray-700 hover:bg-gray-50 opacity-0 group-hover:opacity-100 focus:opacity-100 data-[open=true]:opacity-100 transition-all"
          :data-open="open"
          aria-label="More options"
          @click.stop="open = !open"
        >
          <MoreHorizontal class="h-3.5 w-3.5" :stroke-width="2" />
        </button>

        <Transition name="menu">
          <div
            v-if="open"
            class="absolute right-0 top-8 z-10 w-44 rounded-md border border-gray-100 bg-white shadow-[0_8px_24px_-12px_rgba(0,0,0,0.12)] py-1 origin-top-right"
          >
            <button
              class="w-full flex items-center gap-2 px-3 py-1.5 text-[12px] text-gray-700 hover:bg-gray-50 transition-colors"
              @click="emit('edit', account); open = false"
            >
              <Pencil class="h-3 w-3" :stroke-width="2" />
              Edit
            </button>
            <button
              v-if="!account.isPrimary"
              class="w-full flex items-center gap-2 px-3 py-1.5 text-[12px] text-gray-700 hover:bg-gray-50 transition-colors"
              @click="emit('setPrimary', account); open = false"
            >
              <Star class="h-3 w-3" :stroke-width="2" />
              Set as primary
            </button>
            <div class="h-px bg-gray-100 my-1" />
            <button
              class="w-full flex items-center gap-2 px-3 py-1.5 text-[12px] text-red-600 hover:bg-red-50/60 transition-colors"
              @click="emit('delete', account); open = false"
            >
              <Trash2 class="h-3 w-3" :stroke-width="2" />
              Delete
            </button>
          </div>
        </Transition>
      </div>
    </header>

    <div class="mt-6 flex items-baseline gap-2">
      <p
        class="text-[24px] font-semibold tracking-tight tabular-nums leading-none"
        :class="isLiability ? 'text-gray-900' : 'text-gray-900'"
      >
        {{ isLiability ? '−' : '' }}${{ Math.abs(account.balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
      </p>
    </div>

    <p class="text-[11px] text-gray-500 mt-2">
      {{ isLiability ? 'Current balance' : 'Available' }}
    </p>

    <footer class="flex items-center justify-between mt-auto pt-5">
      <div class="flex items-center gap-1.5 text-[11px] text-gray-500 tabular-nums">
        <span class="h-1 w-1 rounded-full bg-gray-300" />
        <span class="h-1 w-1 rounded-full bg-gray-300" />
        <span class="h-1 w-1 rounded-full bg-gray-300" />
        <span class="h-1 w-1 rounded-full bg-gray-300" />
        <span class="ml-1.5">{{ account.last4 }}</span>
      </div>
      <span
        v-if="account.isPrimary"
        class="text-[10px] label-mono text-[#6E727A]"
      >
        Primary
      </span>
      <span
        v-else
        class="text-[10px] label-mono text-gray-300"
      >
        {{ typeLabel }}
      </span>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import {
  CreditCard,
  Landmark,
  MoreHorizontal,
  Pencil,
  PiggyBank,
  Star,
  Trash2,
  TrendingUp,
  Wallet,
} from 'lucide-vue-next'
import { ACCOUNT_TYPES, type Account } from '~/composables/useAccounts'

const props = defineProps<{ account: Account }>()
const emit = defineEmits<{
  (e: 'edit', a: Account): void
  (e: 'delete', a: Account): void
  (e: 'setPrimary', a: Account): void
}>()

const open = ref(false)
const menuRef = ref<HTMLElement | null>(null)
useClickOutside(menuRef, () => (open.value = false))

const isLiability = computed(() => props.account.type === 'credit' && props.account.balance < 0)

const icon = computed(() => {
  switch (props.account.type) {
    case 'checking': return Landmark
    case 'savings': return PiggyBank
    case 'credit': return CreditCard
    case 'investment': return TrendingUp
    case 'cash': return Wallet
  }
})

const typeLabel = computed(
  () => ACCOUNT_TYPES.find((t) => t.value === props.account.type)?.label ?? props.account.type
)
</script>

<style scoped>
.menu-enter-active,
.menu-leave-active {
  transition: opacity 0.12s ease, transform 0.12s ease;
}
.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: scale(0.96) translateY(-2px);
}
</style>

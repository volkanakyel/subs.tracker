<template>
  <div class="flex flex-col max-h-[440px]">
    <header class="flex items-center justify-between px-4 pt-4 pb-3">
      <div class="flex items-center gap-2">
        <h3 class="text-[13px] font-semibold text-gray-900 tracking-tight">Notifications</h3>
        <span
          v-if="unreadCount"
          class="inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-full bg-[#6E727A] text-white text-[10px] font-semibold tabular-nums"
        >
          {{ unreadCount }}
        </span>
      </div>
      <button
        :disabled="!unreadCount"
        class="text-[11px] font-medium text-gray-500 hover:text-gray-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        @click="markAllRead"
      >
        Mark all read
      </button>
    </header>

    <div class="h-px bg-gray-100" />

    <div class="flex-1 overflow-y-auto py-1">
      <TransitionGroup name="item" tag="div">
        <button
          v-for="n in notifications"
          :key="n.id"
          class="group w-full text-left flex items-start gap-3 px-4 py-3 hover:bg-gray-50/70 transition-colors"
          @click="markRead(n.id)"
        >
          <div class="relative h-8 w-8 rounded bg-gray-50 flex items-center justify-center flex-shrink-0">
            <component :is="iconFor(n.iconKey)" class="h-3.5 w-3.5 text-gray-700" :stroke-width="1.75" />
            <span
              v-if="!n.read"
              class="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-[#6E727A] ring-2 ring-white"
            />
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex items-baseline justify-between gap-2">
              <p
                class="text-[12.5px] font-medium truncate leading-tight"
                :class="n.read ? 'text-gray-600' : 'text-gray-900'"
              >
                {{ n.title }}
              </p>
              <span class="text-[10px] text-gray-500 tabular-nums flex-shrink-0">{{ n.time }}</span>
            </div>
            <p class="text-[11px] text-gray-500 mt-0.5 leading-snug line-clamp-2">{{ n.body }}</p>
          </div>
        </button>
      </TransitionGroup>

      <div v-if="!notifications.length" class="px-4 py-12 text-center">
        <p class="text-[12px] text-gray-500 font-medium">You're all caught up</p>
        <p class="text-[11px] text-gray-500 mt-1">No new notifications.</p>
      </div>
    </div>

    <div class="h-px bg-gray-100" />
    <button class="w-full text-center text-[11px] font-medium text-gray-600 hover:text-gray-900 py-2.5 transition-colors">
      View all
    </button>
  </div>
</template>

<script lang="ts" setup>
import { notificationIcon as iconFor } from '~/composables/useNotifications'

const { notifications, unreadCount, markAllRead, markRead } = useNotifications()
</script>

<style scoped>
.item-enter-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.item-leave-active {
  transition: opacity 0.14s ease;
  position: absolute;
}
.item-enter-from {
  opacity: 0;
  transform: translateY(4px);
}
.item-leave-to {
  opacity: 0;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

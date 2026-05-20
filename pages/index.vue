<template>
  <div class="min-h-screen bg-[#f8f9fb] antialiased font-sans">
    <DashboardLoader @done="isLoaded = true" />

    <template v-if="isLoaded">
      <DashboardSidebar />

      <div class="lg:ml-[240px] min-h-screen pb-24 lg:pb-0">
        <DashboardTopbar />

        <main class="max-w-[1240px] mx-auto px-5 sm:px-7 lg:px-10 py-6 lg:py-8 space-y-5">
          <section class="grid grid-cols-12 gap-5">
            <MotionItem :delay="0.06" class="col-span-12 lg:col-span-8 h-full">
              <NetWorthCard />
            </MotionItem>

            <div class="col-span-12 lg:col-span-4 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 lg:grid-rows-3 gap-5">
              <MotionItem
                v-for="(s, i) in quickStats"
                :key="s.label"
                :delay="0.14 + i * 0.06"
                :x="12"
                :y="0"
                class="h-full"
              >
                <QuickStatCard v-bind="s" />
              </MotionItem>
            </div>
          </section>

          <section class="grid grid-cols-12 gap-5">
            <MotionItem :delay="0.34" class="col-span-12 lg:col-span-7 h-full">
              <SpendingCard />
            </MotionItem>
            <MotionItem :delay="0.40" class="col-span-12 lg:col-span-5 h-full">
              <InvestmentsCard />
            </MotionItem>
          </section>

          <section class="grid grid-cols-12 gap-5">
            <MotionItem :delay="0.46" class="col-span-12 sm:col-span-6 xl:col-span-4 h-full">
              <GoalsCard />
            </MotionItem>
            <MotionItem :delay="0.52" class="col-span-12 sm:col-span-6 xl:col-span-4 h-full">
              <SubscriptionsCard />
            </MotionItem>
            <MotionItem :delay="0.58" class="col-span-12 xl:col-span-4 h-full">
              <CalendarCard />
            </MotionItem>
          </section>

          <section>
            <MotionItem :delay="0.64">
              <TransactionsCard />
            </MotionItem>
          </section>
        </main>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const isLoaded = ref(false)
const { quickStats } = useDashboardData()
</script>

<template>
  <div class="min-h-screen bg-white antialiased font-sans">
    <DashboardLoader @done="isLoaded = true" />

    <template v-if="isLoaded">
      <DashboardSidebar />

      <div class="lg:ml-[260px] min-h-screen pb-24 lg:pb-0">
        <DashboardTopbar />

        <main>
          <!-- Quick stats banner -->
          <MotionItem :delay="0.06">
            <div class="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-black/[0.07] border-b border-black/[0.07]">
              <QuickStatCard
                v-for="(s, i) in quickStats"
                :key="s.label"
                v-bind="s"
                :index="i + 1"
              />
            </div>
          </MotionItem>

          <!-- Net worth -->
          <MotionItem :delay="0.16">
            <section class="px-6 sm:px-8 lg:px-10 py-9 border-b border-black/[0.07]">
              <NetWorthCard />
            </section>
          </MotionItem>

          <!-- Spending + Investments -->
          <section class="grid lg:grid-cols-[1.4fr_1fr] divide-y lg:divide-y-0 lg:divide-x divide-black/[0.07] border-b border-black/[0.07]">
            <MotionItem :delay="0.30">
              <div class="px-6 sm:px-8 lg:px-10 py-9 h-full">
                <SpendingCard />
              </div>
            </MotionItem>
            <MotionItem :delay="0.38">
              <div class="px-6 sm:px-8 lg:px-10 py-9 h-full">
                <InvestmentsCard />
              </div>
            </MotionItem>
          </section>

          <!-- Goals / Subscriptions / Calendar -->
          <section class="grid md:grid-cols-2 xl:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-black/[0.07] border-b border-black/[0.07]">
            <MotionItem :delay="0.46">
              <div class="px-6 sm:px-8 lg:px-10 py-9 h-full">
                <GoalsCard />
              </div>
            </MotionItem>
            <MotionItem :delay="0.52">
              <div class="px-6 sm:px-8 lg:px-10 py-9 h-full">
                <SubscriptionsCard />
              </div>
            </MotionItem>
            <MotionItem :delay="0.58">
              <div class="px-6 sm:px-8 lg:px-10 py-9 h-full md:col-span-2 xl:col-span-1">
                <CalendarCard />
              </div>
            </MotionItem>
          </section>

          <!-- Transactions -->
          <MotionItem :delay="0.64">
            <section class="px-6 sm:px-8 lg:px-10 py-9">
              <TransactionsCard />
            </section>
          </MotionItem>
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

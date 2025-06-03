<template>
    <div class="px-4 py-6 flex flex-col items-center space-y-10">
        <!-- Widgets -->
        <div class="flex flex-wrap justify-center gap-6 w-full max-w-[1200px]">
            <WidgetCard icon="CurrencyDollarIcon" title="Earnings" value="$2,483" change="+ $248" />
            <WidgetCard icon="UserGroupIcon" title="Subscribers" value="290" change="+15" />
            <WidgetCard icon="UserPlusIcon" title="New Subscribers" value="32" change="" />
            <WidgetCard icon="ChartBarIcon" title="Revenue" value="498" change="+ $21" />
        </div>

        <!-- Chart Section -->
        <div class="flex flex-wrap justify-center gap-6 w-full max-w-[1200px]">
            <!-- Left column with Earnings + Subscribers -->
            <div class="flex flex-col gap-6 w-full md:w-[500px]">
                <ChartCard title="Earnings">
                <div class="h-52">
                    <LineChart />
                </div>
                </ChartCard>

                <ChartCard title="Subscribers">
                <div class="h-52">
                    <BarChart />
                </div>
                </ChartCard>
            </div>

            <!-- Donut & Recent Activity -->
            <div class="flex flex-col gap-6 w-full sm:w-[300px]">
                <ChartCard title="Renewal Rate">
                    <div class="h-52 flex justify-center items-center">
                        <DonutChart :value="85" />
                    </div>
                </ChartCard>

                <ChartCard title="Recent Activity">
                    <RecentActivity />
                </ChartCard>
            </div>
        </div>
    </div>
</template>

<script setup>
    import WidgetCard from '../components/AboDashboard/WidgetCard.vue';
    import ChartCard from '../components/AboDashboard/ChartCard.vue';
    import LineChart from '../components/AboDashboard/LineChart.vue';
    import BarChart from '../components/AboDashboard/BarChart.vue';
    import DonutChart from '../components/AboDashboard/DonutChart.vue';
    import RecentActivity from '../components/AboDashboard/RecentActivity.vue';
    import { CurrencyDollarIcon, UserGroupIcon, UserPlusIcon, ChartBarIcon } from '@heroicons/vue/24/outline';
</script>

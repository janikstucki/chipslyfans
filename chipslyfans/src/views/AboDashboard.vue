<template>
    <div class="flex flex-wrap gap-4">
        <WidgetCard icon="CurrencyDollarIcon" title="Earnings" value="$2,483" change="+ $248" />
        <WidgetCard icon="UserGroupIcon" title="Subscribers" value="290" change="+15" />
        <WidgetCard icon="UserPlusIcon" title="New Subscribers" value="32" change="" />
        <WidgetCard icon="ChartBarIcon" title="Revenue" value="498" change="+ $21" />
    </div>
</template>

<script setup>
    import { CurrencyDollarIcon, UserGroupIcon, UserPlusIcon, ChartBarIcon } from '@heroicons/vue/24/outline';
</script>

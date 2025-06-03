<template>
    <div class="flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md w-full max-w-xs">
        <component :is="iconComponent" class="h-8 w-8 text-blue-600" />
        <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ title }}</p>
            <p class="text-xl font-bold text-gray-900 dark:text-white">{{ value }}</p>
            <p v-if="change" class="text-xs text-green-500">{{ change }}</p>
        </div>
    </div>
</template>

<script setup>
    defineProps({
        icon: String,
        title: String,
        value: String,
        change: String,
    });

    const iconComponent = computed(() => {
        return {
        CurrencyDollarIcon,
        UserGroupIcon,
        UserPlusIcon,
        ChartBarIcon,
        }[icon];
    });
</script>

<template>
    <div class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md w-[360px]">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">{{ title }}</h3>
        <slot />
    </div>
</template>

<script setup>
defineProps({ title: String })
</script>

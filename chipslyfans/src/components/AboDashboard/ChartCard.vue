<template>
    <div class="h-full">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">{{ title }}</h3>
        <slot />
    </div>
</template>

<script setup>
defineProps({ title: String })
</script>


<style scoped>
:deep(canvas) {
    height: 100% !important;
}
</style>
<!-- src/views/PaymentSuccess.vue -->
<template>
    <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <DotLottieVue style="height: 500px; width: 500px" autoplay loop src="https://lottie.host/2b1bbb9d-5b6f-4c34-b071-c8c2147dcb2f/xP9RBLAfoU.lottie" />
        <div class="mt-4 text-center">
            <CheckCircleIcon class="w-20 h-20 text-emerald-500 mx-auto" />
            <h1 class="mt-2 text-4xl font-extrabold text-gray-900">{{ t('payment.success_title') }}</h1>
            <p class="mt-2 text-gray-600 max-w-md">
                {{ t('payment.success_message') }}
            </p>
        </div>
        <router-link
            to="/"
            class="mt-6 inline-block bg-blue-600 text-white text-lg font-semibold px-8 py-3 rounded-lg hover:bg-blue-500 transition">
            {{ t('payment.back_to_home') }}
        </router-link>
    </div>
</template>

<script setup>
    import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
    import { CheckCircleIcon } from '@heroicons/vue/24/solid'
    import { useI18n } from 'vue-i18n';
    const { t } = useI18n();
</script>

<style scoped>
.CheckCircleIcon:hover {
    transform: scale(1.05);
    transition: transform 0.2s;
}
</style>

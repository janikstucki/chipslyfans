<template>
  <button 
    @click="router.push('/')"
    class="bg-white rounded-full p-1 shadow-md border border-gray-200 hover:bg-gray-100 z-10 margin-4">
    <ArrowUturnLeftIcon  class="h-4 w-4 text-gray-600" />
  </button>
  <div class="flex max-w-7xl mx-auto py-10 px-6">
    <!-- Sidebar -->
    <aside class="w-64 space-y-4 pr-8 border-r">
      <RouterLink
        v-for="item in menu"
        :key="item.label"
        :to="item.to"
        class="block px-4 py-2 rounded-md font-medium">
        {{ item.label }}
      </RouterLink>

    </aside>

    <!-- Content -->
    <section class="flex-1">
      <RouterView />
    </section>
  </div>
</template>

<script setup>
import {useRouter} from 'vue-router';
import { ArrowUturnLeftIcon } from '@heroicons/vue/24/outline';

const router = useRouter();
const menu = [
  { label: 'My Profile', to: '' },
  { label: 'Security', to: 'security' },
  { label: 'Notifications', to: 'notifications' },
  { label: 'Billing', to: 'billing' },
  { label: 'Delete Account', to: 'delete-account' }
];
</script>


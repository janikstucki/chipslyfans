<template>
  <div class="p-4">
    <!-- Back Button -->
    <button 
      @click="router.push('/')"
      class="bg-white rounded-full p-2 shadow-md border border-gray-200 hover:bg-gray-100 z-10 mb-4">
      <ArrowUturnLeftIcon class="h-5 w-5 text-gray-600" />
    </button>

    <div class="flex flex-col lg:flex-row max-w-7xl mx-auto py-6 px-4">
      <!-- Sidebar -->
      <aside class="w-full lg:w-64 mb-6 lg:mb-0 lg:pr-8 border-b lg:border-b-0 lg:border-r">
        <nav class="flex lg:flex-col gap-2">
          <RouterLink
            v-for="item in menu"
            :key="item.label"
            :to="item.to"
            class="px-4 py-2 rounded-md font-medium text-center lg:text-left"
            :class="{
              'bg-blue-100 text-blue-700': isActiveTab(item.to),
              'text-gray-700 hover:bg-gray-100': !isActiveTab(item.to)
            }"
          >
            {{ item.label }}
          </RouterLink>
        </nav>
      </aside>

      <!-- Child View -->
      <section class="flex-1">
        <RouterView />
      </section>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import { ArrowUturnLeftIcon } from '@heroicons/vue/24/outline';

const router = useRouter();
const route = useRoute();

const menu = [
  { label: 'My Profile', to: `/user/${route.params.id}/settings` },
  { label: 'Security', to: `/user/${route.params.id}/settings/security` },
  { label: 'Notifications', to: `/user/${route.params.id}/settings/notifications` },
  { label: 'Billing', to: `/user/${route.params.id}/settings/billing` },
  { label: 'Delete Account', to: `/user/${route.params.id}/settings/delete-account` }
];

function isActiveTab(path) {
  const currentPath = route.path.endsWith('/') ? route.path.slice(0, -1) : route.path;
  const base = currentPath.split('/').pop();
  return base === path || (path.endsWith('/settings') && base === 'settings');
}
</script>

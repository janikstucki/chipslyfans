<template>
  <div class="flex max-w-7xl mx-auto py-10 px-6">
    <!-- Sidebar -->
    <aside class="w-64 space-y-4 pr-8 border-r">
      <RouterLink
        v-for="item in menu"
        :key="item.to"
        :to="item.to"
        class="block px-4 py-2 rounded-md font-medium"
        :class="$route.path.includes(item.to) ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-50'"
      >
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
const menu = [
  { label: 'My Profile', to: '' },
  { label: 'Security', to: 'security' },
  { label: 'Notifications', to: 'notifications' },
  { label: 'Billing', to: 'billing' },
  { label: 'Delete Account', to: 'delete-account' },
];
</script>

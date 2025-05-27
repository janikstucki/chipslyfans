<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const userId = route.params.id;

const isLoading = ref(true);
const notifications = ref({
  likes: true,
  comments: true,
  subscriptions: true,
  messages: true,
  postVisit: true,
  mentions: true,
  loginAlerts: true,
});

onMounted(async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/users/settings/${userId}/notifications`, {
      method: 'GET',
      credentials: 'include',
    });
    if (response.ok) {
      const data = await response.json();
      notifications.value = data.notifications;
    } else {
      console.error('Failed to fetch notifications');
    }
  } finally {
    isLoading.value = false;
  }
});

async function toggleNotification(key) {
  notifications.value[key] = !notifications.value[key];
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/users/settings/${userId}/notifications`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ [key]: notifications.value[key] }),
    });
    if (!response.ok) {
      console.error('Failed to update notification');
    }
  } catch (error) {
    console.error('Error updating notification:', error);
  }
}
</script>

<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-semibold mb-4">Notification Settings</h2>

    <div v-if="isLoading" class="flex justify-center items-center py-10">
      <div class="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
    </div>

    <div v-else class="bg-white shadow rounded-lg p-6 space-y-4">
      <div
        v-for="(value, key) in notifications"
        :key="key"
        class="flex justify-between items-center border-b last:border-none pb-4 last:pb-0"
      >
        <span class="capitalize">{{ key.replace(/([A-Z])/g, ' $1') }}</span>
        <button
          @click="toggleNotification(key)"
          :class="[
            'relative inline-flex h-6 w-11 items-center rounded-full transition',
            value ? 'bg-green-500' : 'bg-gray-300'
          ]"
        >
          <span
            :class="[
              'inline-block h-4 w-4 transform rounded-full bg-white transition',
              value ? 'translate-x-6' : 'translate-x-1'
            ]"
          />
        </button>
      </div>
    </div>
  </div>
</template>

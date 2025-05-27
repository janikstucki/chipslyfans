<template>
  <div>
    <h1 class="text-xl font-bold mb-4">{{ $t('notifications.inbox') }}</h1>
    <div class="p-6">
      <div v-if="isLoading" class="flex justify-center items-center py-10">
        <div class="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
      </div>
      <div v-else class="space-y-4">
        <div
          v-for="b in benachrichtigungen"
          :key="b.id"
          class="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 cursor-pointer transition"
          @click="readNotification(b.id)"
        >
          <div class="flex gap-3 items-center">
            <!-- Avatar -->
            <div
              class="w-10 h-10 rounded-full overflow-hidden bg-indigo-500 flex items-center justify-center text-white font-bold"
              @click.stop="$router.push({ name: 'UserDetail', params: { id: b.userId } })"
            >
              <img v-if="b.profilbild" :src="b.profilbild" class="w-full h-full object-cover" />
              <span v-else>{{ b.autor.charAt(0).toUpperCase() }}</span>
            </div>

            <!-- Inhalt -->
            <div class="flex-1">
              <div
                class="flex items-baseline gap-2"
                @click.stop="$router.push({ name: 'UserDetail', params: { id: b.userId } })"
              >
                <span class="font-medium text-gray-900">{{ b.autor }}</span>
                <span class="text-sm text-gray-500">{{ formatDate(b.datum) }}</span>
              </div>
              <p class="mt-1 text-gray-600">
                <span>
                  {{ $t(`notifications.${b.art}`, { title: b.post?.title || 'ohne Titel' }) }}
                </span>
              </p>
            </div>

            <!-- Icon -->
            <div class="relative">
              <component :is="b.Icon" class="w-6 h-6 text-gray-600" v-if="b.Icon" />
              <span v-if="!b.isRead" class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { formatDate as formatDateUtil } from '../utils/formatDate.js';
import { useI18n } from 'vue-i18n';
import {
  BanknotesIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  BookmarkIcon,
  ChatBubbleLeftRightIcon,
  EyeIcon,
  BellAlertIcon
} from '@heroicons/vue/24/outline';

const router = useRoute();
const { t } = useI18n();

function formatDate(dateString) {
  return formatDateUtil(dateString, t);
}

const isLoading = ref(false);
const benachrichtigungen = ref([]);

const iconMap = {
  like: HeartIcon,
  comment: ChatBubbleLeftIcon,
  visit: EyeIcon,
  share: BookmarkIcon,
  subscription: BanknotesIcon,
  message: ChatBubbleLeftRightIcon,
  mention: BellAlertIcon,
  login_alert: BellAlertIcon
};

onMounted(async () => {
  isLoading.value = true;
  try {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/interactions/my`, {
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    if (!res.ok) throw new Error('Fehler beim Laden');

    const data = await res.json();
    console.log('Benachrichtigungen:', data);

    benachrichtigungen.value = data.map((i) => ({
      id: i.id,
      autor: i.user?.username || 'Unbekannt',
      profilbild: i.user?.profilepicture || null,
      userId: i.user?.id || '',
      datum: i.createdAt,
      art: i.type,
      Icon: iconMap[i.type] || null,
      post: i.post,
      isRead: i.isRead
    }));

    benachrichtigungen.value.sort((a, b) => new Date(b.datum) - new Date(a.datum));
    isLoading.value = false;
  } catch (err) {
    console.error('Fehler beim Laden:', err);
  }
});

async function readNotification(id) {
  try {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/interactions/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
    benachrichtigungen.value = benachrichtigungen.value.map((b) =>
      b.id === id ? { ...b, isRead: true } : b
    );

    if (!res.ok) throw new Error('Fehler beim Lesen der Benachrichtigung');
  } catch (err) {
    console.error('Fehler beim Lesen der Benachrichtigung:', err);
  }
}
</script>

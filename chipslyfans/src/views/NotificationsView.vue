<template>
  <div>
    <h1 class="text-xl font-bold mb-4">Postfach</h1>
    <div class="p-6">
      <div class="space-y-4">
        <div 
          v-for="b in benachrichtigungen"
          :key="b.id"
          class="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 cursor-pointer transition">
          
          <div class="flex gap-3 items-center">
            <!-- Avatar -->
            <div class="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold">
              {{ b.autor.charAt(1) }}
            </div>

            <!-- Inhalt -->
            <div class="flex-1">
              <div class="flex items-baseline gap-2">
                <span class="font-medium text-gray-900">{{ b.autor }}</span>
                <span class="text-sm text-gray-500">{{ b.datum }}</span>
              </div>
              <p class="mt-1 text-gray-600">{{ b.inhalt }}</p>
            </div>

            <!-- Icon -->
            <component :is="b.Icon" class="w-6 h-6 text-gray-600" v-if="b.Icon" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import {
  BanknotesIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  BookmarkIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/vue/24/outline';

const benachrichtigungen = ref([]);

const iconMap = {
  like: HeartIcon,
  payment: BanknotesIcon,
  comment: ChatBubbleLeftIcon,
  message: ChatBubbleLeftRightIcon,
  abo: BanknotesIcon,
  collection: BookmarkIcon
};

onMounted(async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/interactions/my`, {
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include' // falls Auth-Cookie verwendet wird
    });

    if (!res.ok) throw new Error('Fehler beim Laden');

    const data = await res.json();

    benachrichtigungen.value = data.map((i) => ({
      id: i.id,
      autor: '@Chipsly#' + i.userId.slice(0, 5),
      datum: new Date(i.createdAt).toLocaleString('de-CH'),
      inhalt: getText(i),
      art: i.type,
      Icon: iconMap[i.type] || null,
      post: i.post // fallback, falls du Titel später brauchst
    }));
  } catch (err) {
    console.error('Fehler beim Laden:', err);
  }
});

function getText(i) {
  switch (i.type) {
    case 'like':
      return `Hat deinen Beitrag "${i.post?.title || 'ohne Titel'}" geliked`;
    case 'comment':
      return `Hat deinen Beitrag "${i.post?.title || 'ohne Titel'}" kommentiert`;
    case 'visit':
      return `Hat deinen Beitrag "${i.post?.title || 'ohne Titel'}" besucht`;
    case 'share':
      return `Hat deinen Beitrag "${i.post?.title || 'ohne Titel'}" geteilt`;
    default:
      return 'Unbekannte Aktion';
  }
}
</script>

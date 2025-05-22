<template>
  <div>
    <h1 class="text-xl font-bold mb-4">Postfach</h1>
    <div class="p-6">
      <div class="space-y-4">
        <div 
          v-for="b in benachrichtigungen"
          :key="b.id"
          class="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 cursor-pointer transition">
          
          <div class="flex gap-3 items-center" @click="$router.push({ name: 'UserDetail', params: { id: b.userId } })">
            <!-- Avatar -->
              <div class="w-10 h-10 rounded-full overflow-hidden bg-indigo-500 flex items-center justify-center text-white font-bold">
                <img v-if="b.profilbild" :src="b.profilbild" class="w-full h-full object-cover" />
                <span v-else>{{ b.autor.charAt(0).toUpperCase() }}</span>
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
import { useRoute } from 'vue-router';
import {
  BanknotesIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  BookmarkIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/vue/24/outline';



const router = useRoute();


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
      credentials: 'include' 
    });

    if (!res.ok) throw new Error('Fehler beim Laden');

    const data = await res.json();

    benachrichtigungen.value = data.map((i) => ({
      id: i.id,
      autor: i.user?.username || 'Unbekannt',
      profilbild: i.user?.profilepicture || null,
      userId: i.user?.id || '',
      datum: new Date(i.createdAt).toLocaleString('de-CH'),
      inhalt: getText(i),
      art: i.type,
      Icon: iconMap[i.type] || null,
      post: i.post
    }));

    // Sortieren nach Datum
    benachrichtigungen.value.sort((a, b) => new Date(b.datum) - new Date(a.datum));
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

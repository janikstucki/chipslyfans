<template>
    <div v-if="loading" class="text-center py-20 text-gray-500">Lade Profil...</div>

    <div v-if="user" class="max-w-5xl mx-auto px-4 py-8">
        <div class="flex flex-col items-center text-center space-y-4 mb-8">
            <div class="w-20 h-20 rounded-full overflow-hidden bg-indigo-500 flex items-center justify-center text-white text-3xl font-bold">
                <template v-if="user.profilepicture">
                    <img :src="user.profilepicture" alt="Profilepicture" class="w-full h-full object-cover" />
                </template>
                <template v-else>
                    {{ user.username?.charAt(0).toUpperCase() || '?' }}
                </template>
            </div>
    
            <h2 class="text-2xl font-bold text-gray-900">@{{ user.username }}</h2>
            <p class="text-gray-600">{{ user.bio || 'Keine Biografie vorhanden.' }}</p>
    
            <div class="flex items-center gap-4">
                <div v-if="!isSubscribed && user?.abonnement?.cost" class="text-lg font-semibold">
                    {{ user.abonnement.cost }} CHF / Monat
                </div>
        
                <button
                    v-if="!isSubscribed"
                    class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                    @click="handleSubscribe"
                >
                    Abonnieren
                </button>
        
                <button
                    v-else
                    class="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
                    @click="handleUnsubscribe"
                >
                    Kündigen
                </button>
            </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
                v-for="post in user.posts || []"
                :key="post.id"
                class="bg-white shadow-md rounded-lg overflow-hidden">
                <img
                    :src="post.images?.[0]?.url || '/post-placeholder.jpg'"
                    class="w-full h-48 object-cover"
                    alt="Post Image"
                />
                <div class="p-4">
                    <h3 class="font-semibold text-lg text-gray-900 mb-2">{{ post.title }}</h3>
                    <p class="text-sm text-gray-600">{{ post.content.slice(0, 80) }}...</p>
                </div>
            </div>
        </div>
    </div>
    <div v-if="!user">
        <div class="max-w-5xl mx-auto px-4 py-8 text-center">
            <h2 class="text-2xl font-bold text-gray-900">Benutzer nicht gefunden</h2>
            <p class="text-gray-600">Der angeforderte Benutzer existiert nicht oder ist nicht verfügbar.</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const user = ref(null);
const isSubscribed = ref(false);
const route = useRoute();
const loading = ref(true);
const handleSubscribe = () => {
    isSubscribed.value = true;
};

const handleUnsubscribe = () => {
    isSubscribed.value = false;
};

onMounted(async () => {
    const userId = route.params.id;
    try {
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/users/profile/${userId}`, {
            method: 'GET',
            credentials: 'include'
        });
        const data = await res.json();
    
        if (res.ok && data) {
            user.value = data;
            loading.value = false;
        } else {
            console.warn('User nicht gefunden oder Fehler:', data);
            loading.value = false;
        }
    } catch (err) {
        console.error('Fehler beim Laden des Users:', err);
        loading.value = false;
    }
});
</script>

<style scoped>
</style>

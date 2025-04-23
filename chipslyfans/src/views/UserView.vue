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
                    v-if="!isSubscribed && currentUserId !== user.id"
                    class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                    @click="handleSubscribe">
                    Abonnieren
                </button>
        
                <button
                    v-else-if="currentUserId !== user.id"
                    class="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
                    @click="handleUnsubscribe">
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
                    <p class="text-sm text-gray-600 mb-4">{{ post.content.slice(0, 80) }}...</p>
                    <div class="p-4 flex flex-col justify-between h-full">
                        <div class="text-right">
                            <span
                                :class="[
                                    'inline-block px-2 py-1 text-xs font-semibold rounded-full',
                                    post.visibility === 'public' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                ]"
                            >
                                {{ post.visibility === 'public' ? 'Öffentlich' : 'Privat' }}
                            </span>
                        </div>
                    </div>
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
import { t } from 'vue-i18n';

const user = ref(null);
const currentUserId = ref(null);
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
        // Fetch profile data
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/users/profile/${userId}`, {
            method: 'GET',
            credentials: 'include'
        });
        const data = await res.json();
        if (res.ok && data) {
            user.value = data;
            console.log('Benutzer:', user.value);
        } else {
            console.warn('User nicht gefunden oder Fehler:', data);
        }

        const resAuth = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/protected`, {
            credentials: 'include'
        });
        const authData = await resAuth.json();
        currentUserId.value = authData?.user.id;
        console.log('Aktueller Benutzer:', authData.user.id);

    } catch (err) {
        console.error('Fehler beim Laden des Users oder Auth:', err);
    } finally {
        loading.value = false;
    }
});
</script>

<style scoped>
</style>

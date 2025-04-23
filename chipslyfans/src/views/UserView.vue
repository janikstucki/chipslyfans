<template>
    <div v-if="loading" class="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <!-- Profilkopf -->
        <div class="flex flex-col items-center text-center space-y-4">
            <div class="w-20 h-20 rounded-full bg-gray-200 text-white text-3xl font-bold flex items-center justify-center animate-pulse">
                ?
            </div>
            <div class="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
            <div class="flex gap-4 mt-2">
                <div class="h-10 w-28 rounded-lg bg-gray-300 animate-pulse"></div>
                <div class="h-10 w-28 rounded-lg bg-gray-300 animate-pulse"></div>
            </div>
        </div>

        <!-- Post-Karten Skeleton -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="n in 6" :key="n" class="bg-white shadow-md rounded-lg overflow-hidden animate-pulse">
                <div class="w-full h-48 bg-gray-300"></div>
                    <div class="p-4 space-y-4 flex flex-col justify-between h-full">
                        <div>
                        <div class="h-5 bg-gray-300 rounded w-3/4"></div>
                        <div class="h-4 bg-gray-300 rounded w-full mt-2"></div>
                        </div>
                        <div class="flex justify-end pt-4">
                        <div class="h-5 w-16 rounded-full bg-gray-300"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

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
                class="bg-white shadow-md rounded-lg overflow-hidden"
                @click="onPostClick(post.id)">
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
                                {{ post.visibility === 'public' ? t('userview.posts.public') : t('userview.posts.sub_only') }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-if="loadingError">
        <div class="max-w-5xl mx-auto px-4 py-8 text-center">
            <h2 class="text-2xl font-bold text-gray-900">Benutzer nicht gefunden</h2>
            <p class="text-gray-600">Der angeforderte Benutzer existiert nicht oder ist nicht verfügbar.</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const router = useRouter();

const user = ref(null);
const currentUserId = ref(null);
const isSubscribed = ref(false);
const route = useRoute();
const loading = ref(true);
const loadingError = ref(false);

const handleSubscribe = async () => {
    isSubscribed.value = true;
    await fetch(`${import.meta.env.VITE_BASE_URL}/users/subscribe`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ abonnementId })
    });
};

const abonnementId = "5c4c684e-2080-11f0-80e8-0a0027000012"; // Beispiel-ID, sollte dynamisch sein



const handleUnsubscribe = () => {
    isSubscribed.value = false;

};

function onPostClick(postId){
    router.push({ name: 'PostDetail', params: { id: postId } })
}

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
            loadingError.value = true;
        }

        const resAuth = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/protected`, {
            credentials: 'include'
        });
        const authData = await resAuth.json();
        currentUserId.value = authData?.user.id;

        loading.value = false;
    } catch (err) {
        console.error('Fehler beim Laden des Users oder Auth:', err);
        loadingError.value = false;
    } 
});
</script>

<style scoped>
</style>

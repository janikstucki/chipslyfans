<template>
    <div class="max-w-5xl mx-auto px-4 py-8">
        <!-- Profile Header -->
        <div class="flex flex-col items-center text-center space-y-4 mb-8">
            <img
                :src="creator.profilepicture || '/placeholder.jpg'"
                alt="Profile Picture"
                class="w-32 h-32 rounded-full object-cover shadow-md"/>
            <h2 class="text-2xl font-bold text-gray-900">@{{ creator.username }}</h2>
            <p class="text-gray-600">{{ creator.bio || 'Keine Biografie vorhanden.' }}</p>
    
            <div class="flex items-center gap-4">
                <div v-if="!isSubscribed" class="text-lg font-semibold">
                    {{ creator.abonnement.cost }} CHF / Monat
                </div>
        
                <button
                    class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                    @click="handleSubscribe"
                    v-if="!isSubscribed">
                    Abonnieren
                </button>
        
                <button
                    class="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
                    @click="handleUnsubscribe"
                    v-else>
                    Kündigen
                </button>
            </div>
        </div>
    
        <!-- Public Posts -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
                v-for="post in posts"
                :key="post.id"
                class="bg-white shadow-md rounded-lg overflow-hidden">
                <img
                    :src="post.images?.[0] || '/post-placeholder.jpg'"
                    class="w-full h-48 object-cover"
                    alt="Post Image"/>
                <div class="p-4">
                    <h3 class="font-semibold text-lg text-gray-900 mb-2">{{ post.title }}</h3>
                    <p class="text-sm text-gray-600">{{ post.content.slice(0, 80) }}...</p>
                </div>
            </div>
        </div>
    </div>
</template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  
  // Test Data
const user = ref({})

const isSubscribed = ref(false);
const router = useRouter();
const route = useRoute();

const posts = ref([
    {
        id: '1',
        title: 'Erstes Shooting',
        content: 'Hier ist ein kleiner Einblick...',
        images: ['https://placecats.com/bella/300/200'],
        visibility: 'subscription',
    },
    {
        id: '2',
        title: 'Behind the Scenes',
        content: 'Was passiert wirklich?',
        images: ['https://placecats.com/300/200'],
        visibility: 'public',
    },
]);
const handleSubscribe = () => {
    console.log('Subscribed!');
    isSubscribed.value = true;
};
const handleUnsubscribe = () => {
    console.log('Unsubscribed!');
    isSubscribed.value = false;
};

onMounted(async () => {
    const userId = route.params.id; 
    try {
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/users/profile/${userId}`, {
            method: 'GET',
            credentials: 'include'
        })
        const data = await res.json()

        if (res.ok && data.success) {
            user.value = data.data
        } else {
        console.warn('User nicht gefunden oder Fehler:', data)
        }
    } catch (err) {
        console.error('Fehler beim Laden des Users:', err)
    }
})
</script>
  
<style scoped>

</style>

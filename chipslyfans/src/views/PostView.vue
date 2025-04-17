<!-- src/views/PostDetail.vue -->
<script setup>
    import { ref, onMounted } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { formatDate } from "../utils/formatDate.js"
    import {
        HeartIcon,
        ChatBubbleLeftEllipsisIcon,
        ShareIcon,
        BookmarkIcon,
        ChevronLeftIcon,
        ChevronRightIcon,
        ArrowUturnRightIcon
    } from '@heroicons/vue/24/outline'
    

    const post = ref(null)
    const router = useRouter()
    const route = useRoute()
    const currentImageIndex = ref(0)
    const showImageModal = ref(false)
    const fullImageUrl = ref('')
    
    
    
    function nextImage() {
        if (post.value?.images && currentImageIndex.value < post.value.images.length - 1) {
            currentImageIndex.value++
        }
    }
    
    function prevImage() {
        if (currentImageIndex.value > 0) {
            currentImageIndex.value--
        }
    }
    
    function openImageModal(url) {
        fullImageUrl.value = url
        showImageModal.value = true
    }
    function closeImageModal() {
        showImageModal.value = false
        fullImageUrl.value = ''
    }

    function onUserClick(userId) {
        router.push({ name: 'UserDetail', params: { id: userId } })
    }
    
    onMounted(async () => {
        const postId = route.params.id
        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/posts/${postId}`, {
                method: 'GET',
                credentials: 'include'
            })
            const data = await res.json()
    
            if (res.ok && data.success) {
                post.value = data.data
                console.log(post.value.author.id)
            } else {
            console.warn('Post nicht gefunden oder Fehler:', data)
            }
        } catch (err) {
            console.error('Fehler beim Laden des Posts:', err)
        }
    })
</script>

<template>
    <div v-if="post" class="w-full max-w-2xl mx-auto bg-white shadow-md rounded-lg overflow-hidden mt-6">
        <!-- Header -->
        <div @click="onUserClick(post.author.id)" class="flex items-center justify-between px-6 py-4 border-b">
            <div class="flex items-center space-x-3">
                <div class="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                    {{ post.author.username.charAt(0).toUpperCase() }}
                </div>
                <div>
                    <p class="font-semibold">{{ post.author.username }}</p>
                    <p class="text-sm text-gray-500">{{ formatDate(post.createdAt) }}</p>
                </div>
            </div>
        </div>
    
        <!-- Bild oder Karussell -->
        <div v-if="post.images && post.images.length" class="relative w-full h-[300px] bg-gray-100 overflow-hidden rounded-md">
            <img
                :src="post.images[currentImageIndex].url"
                alt="Post Bild"
                @click="openImageModal(post.images[currentImageIndex].url)"
                class="object-cover w-full h-full transition-all duration-300 cursor-zoom-in"/>

            <!-- Prev -->
            <button
                v-if="post.images.length > 1 && currentImageIndex > 0"
                @click="prevImage"
                class="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black text-white rounded-full p-2 shadow-md transition">
                <ChevronLeftIcon class="h-5 w-5" />
            </button>

            <!-- Next -->
            <button
                v-if="post.images.length > 1 && currentImageIndex < post.images.length - 1"
                @click="nextImage"
                class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black text-white rounded-full p-2 shadow-md transition">
                <ChevronRightIcon class="h-5 w-5" />
            </button>

            <!-- Count -->
            <div
                v-if="post.images.length > 1"
                class="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs bg-black/50 text-white px-2 py-0.5 rounded">
                {{ currentImageIndex + 1 }} / {{ post.images.length }}
            </div>
        </div>
        <!-- Body -->
        <div class="px-6 py-4">
            <h2 class="text-lg font-bold mb-2">{{ post.title }}</h2>
            <p class="text-gray-700 mb-4">{{ post.content }}</p>
    
            <!-- Tags -->
            <div class="flex flex-wrap gap-2 mb-4">
                <span v-for="(tag, index) in post.tags" :key="index" class="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                    #{{ tag }}
                </span>
            </div>
    
            <!-- Actions -->
            <div class="flex items-center justify-between text-gray-600 border-t border-b py-3 px-4">
                <!-- Like -->
                <button class="flex items-center space-x-2 hover:text-blue-600">
                    <HeartIcon class="h-5 w-5" />
                    <span>{{ post.likes.likeCount }}</span>
                </button>

                <!-- Kommentieren -->
                <button class="flex items-center space-x-2 hover:text-blue-600">
                    <ChatBubbleLeftEllipsisIcon class="h-5 w-5" />
                    <span>Kommentieren</span>
                </button>

                <!-- Teilen -->
                <button class="flex items-center space-x-2 hover:text-blue-600">
                    <ShareIcon class="h-5 w-5" />
                    <span>Teilen</span>
                </button>

                <!-- Speichern -->
                <button class="flex items-center space-x-2 hover:text-blue-600">
                    <BookmarkIcon class="h-5 w-5" />
                    <span>Speichern</span>
                </button>
            </div>
        </div>
    
        <div class="px-6 py-4">
            <h3 class="font-semibold text-sm text-gray-600 mb-2">Kommentare</h3>
            <p class="text-gray-400 italic">Kommentarfunktion kommt bald</p>
        </div>
    </div>
    <div v-else class="text-center text-gray-500 mt-10">
        Lade Beitrag...
    </div>
    <!-- Fullscreen Image -->
    <transition name="fade">
        <div
        v-if="showImageModal"
        @click.self="closeImageModal"
        class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center px-4">
            <div class="relative max-w-full max-h-full">
                <button
                @click="closeImageModal"
                class="absolute top-2 right-2 text-white bg-black/70 rounded-full p-2 hover:bg-black">
                <ArrowUturnRightIcon class="h-5 w-5"/>
                </button>
                <img :src="fullImageUrl" alt="Bild Vorschau" class="max-w-full max-h-screen rounded shadow-lg" />
            </div>
        </div>
    </transition>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>

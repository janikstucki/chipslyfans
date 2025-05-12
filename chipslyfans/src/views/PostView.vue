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
    
    const commentText = ref(''); 

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

    function submitComment() {
      console.log('comment:', commentText.value);
      commentText.value = '';
    };

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
                <button class="flex items-center space-x-2 hover:text-blue-600 relative group">
                    <!-- Social-Media-Icons (Tooltip) -->
                    <div class="absolute hidden group-hover:flex animate-pulse flex-col items-center bottom-full mb-2 left-0 right-0">
                        <!-- Tooltip-Inhalt -->
                        <div class="bg-gray-100 p-3 rounded-3xl shadow-lg shadow-gray-400/35 flex gap-3">
                            <!-- Twitter/X -->
                            <div class="p-2 bg-gray-50 rounded-full shadow-md shadow-gray-200 hover:bg-gray-700">
                                <a href="#"><svg class="h-6 w-6 fill-gray-700 hover:fill-white" viewBox="0 0 520 520"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/></svg></a>
                            </div>
                            <!-- Facebook -->
                            <div class="p-2 bg-gray-50 rounded-full shadow-md shadow-gray-200 hover:bg-sky-500">
                                <a href="#"><svg class="h-6 w-6 fill-gray-700 hover:fill-white" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
                            </div>
                            <!-- Instagram -->
                            <div class="p-2 bg-gray-50 rounded-full shadow-md shadow-gray-200 hover:bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500">
                                <a href="#"><svg class="h-6 w-6 fill-gray-700 hover:fill-white" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg></a>
                            </div>
                        </div>

                    </div>

    <!-- Sichtbarer Button -->
                 <button class="flex items-center space-x-2 hover:text-blue-600">
                    <ShareIcon class="h-5 w-5" />
                    <span>Teilen</span>
                </button> 
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
            <textarea v-model="commentText" rows="4" class="w-full min-h-20 px-4 py-3 bg-gray-100 border border-gray-400 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-indigo-600" placeholder="Write your contribution..."></textarea>
            
            <div class="flex justify-between mt-8"><div></div><button class="w-1/4 bg-gradient-to-l from-blue-700 to-indigo-400 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-300 transform transition-all duration-300 ease-in-out mb-1 hover:scale-[1.02]" :disabled="commentText.length < 1" @click="submitComment">Veröffentlichen</button><!--v-if--></div>
        </div>
    </div>
    <div v-else class="w-full max-w-2xl mx-auto bg-white shadow-md rounded-lg overflow-hidden mt-6 animate-pulse">
        <!-- Header -->
        <div class="flex items-center px-6 py-4 space-x-4 border-b">
            <div class="w-12 h-12 rounded-full bg-gray-300"></div>
            <div class="space-y-2">
                <div class="w-32 h-4 bg-gray-300 rounded"></div>
                <div class="w-24 h-3 bg-gray-200 rounded"></div>
            </div>
        </div>
        

        <!-- Bild -->
        <div class="w-full h-[300px] bg-gray-200"></div>

        <!-- Body -->
        <div class="px-6 py-4 space-y-4">
            <div class="w-2/3 h-5 bg-gray-300 rounded"></div>
            <div class="h-4 bg-gray-200 rounded w-full"></div>
            <div class="h-4 bg-gray-200 rounded w-5/6"></div>

            <!-- Tags -->
            <div class="flex gap-2 mt-4">
                <div class="h-6 w-16 bg-gray-200 rounded-full"></div>
                <div class="h-6 w-20 bg-gray-200 rounded-full"></div>
            </div>

            <!-- Actions -->
            <div class="flex justify-between border-t border-b py-3 px-2 text-gray-400">
                <div class="h-5 w-14 bg-gray-300 rounded"></div>
                <div class="h-5 w-20 bg-gray-300 rounded"></div>
                <div class="h-5 w-16 bg-gray-300 rounded"></div>
                <div class="h-5 w-20 bg-gray-300 rounded"></div>
            </div>
        </div>

        <!-- Kommentarplatzhalter -->
        <div class="px-6 py-4 space-y-2">
            <div class="h-4 w-24 bg-gray-300 rounded"></div>
            <div class="h-3 w-2/3 bg-gray-200 rounded"></div>
        </div>
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

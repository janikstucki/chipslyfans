<!-- src/views/PostDetail.vue -->
<template>
    <div v-if="post" class="w-full max-w-2xl mx-auto bg-white shadow-md rounded-lg overflow-hidden mt-6">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b">
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
    
        <!-- Bild -->
        <div v-if="post.images && post.images.length" class="w-full h-[300px] bg-gray-100">
            <img :src="post.images[0].url" alt="Post Bild" class="object-cover w-full h-full" />
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
            <div class="flex items-center justify-between text-gray-600 border-t border-b py-3">
                <button class="flex items-center space-x-2 hover:text-blue-600">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>{{ post.likes.likeCount }}</span>
                </button>
                <button class="flex items-center space-x-2 hover:text-blue-600">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    <span>Kommentieren</span>
                </button>
                <button class="flex items-center space-x-2 hover:text-blue-600">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M17 16l4-4m0 0l-4-4m4 4H7" />
                        </svg>
                        <span>Teilen</span>
                </button>
                <button class="flex items-center space-x-2 hover:text-blue-600">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M5 13l4 4L19 7" />
                    </svg>
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
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { formatDate } from '../utils/formatDate.js'

const post = ref(null)
const route = useRoute()

onMounted(async () => {
  const postId = route.params.id
  try {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/posts/${postId}`, {
      method: 'GET',
      credentials: 'include'
    })
    const data = await res.json()
    console.log(data.value)

    if (res.ok && data.success) {
      post.value = data.data
      console.log(post.value)
    } else {
      console.warn('Post nicht gefunden oder Fehler:', data)
    }
  } catch (err) {
    console.error('Fehler beim Laden des Posts:', err)
  }
})
</script>

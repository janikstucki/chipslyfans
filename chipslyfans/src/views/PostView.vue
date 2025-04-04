<!-- src/views/PostDetail.vue -->
<template>
    <div class="p-6 bg-white rounded-lg shadow">
        <h2 class="text-2xl font-bold mb-2">Beitrag von {{ post?.autor }}</h2>
        <p class="text-gray-500">{{ post?.datum }}</p>
        <p class="mt-4">{{ post?.inhalt }}</p>
        <div class="mt-4 text-gray-600">
            <span>{{ post?.likes }} Likes</span> • 
            <span>{{ post?.kommentare }} Kommentare</span>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import { useRoute } from 'vue-router'
    
    const route = useRoute()
    const post = ref(null)
    
    const posts = [
        { id: 1, autor: '@Chipsly#69420', datum: 'Vor 2 Stunden', inhalt: 'Lorem ipsum...', likes: '24k', kommentare: 323 },
        { id: 2, autor: '@Chipsly#69420', datum: 'Gestern', inhalt: 'Neuer Beitrag...', likes: '14k', kommentare: 124 },
    ]
    
    onMounted(() => {
        const postId = parseInt(route.params.id)
        post.value = posts.find(p => p.id === postId)
    })
</script>

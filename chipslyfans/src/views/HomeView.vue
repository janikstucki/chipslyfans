<template>
  <div class="app-container flex h-screen bg-gray-100">
    <!-- Sidebar (links) -->
    <div class="sidebar w-3/4 bg-white border-r border-gray-200 overflow-y-auto">
      <div class="p-6">
        <h2 class="text-xl font-bold mb-4">{{ $t('root.title') }}</h2>
        <div class="space-y-4">
          <div 
            v-for="(post, index) in posts" 
            :key="index"
            class="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 cursor-pointer transition"
            @click="navigateToPost(post.id)"
          >
            <div class="flex items-center space-x-3">
              <!-- <div class="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold">
                {{ post.autor.charAt(0) }}
              </div> -->
              <div>
                <!-- <h3 class="font-medium">{{ post.autor }}</h3> -->
                <p class="text-gray-500 text-sm">{{ formatDate(post.createdAt) }}</p>
              </div>
            </div>
            <p class="mt-2 text-md line-clamp-2">{{ post.title }}</p>
            <p class="mt-2 text-sm line-clamp-2">{{ post.content }}</p>
            <div class="flex space-x-4 text-gray-500 border-t border-gray-200 pt-4">
            <button class="flex items-center space-x-1 hover:text-indigo-600 " @click.stop="likepost(post.id)">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
              <span>{{ post.likes.likeCount }}</span>
            </button>
            <button class="flex items-center space-x-1 hover:text-indigo-600 ">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
              <!-- <span>{{ beitrag.kommentare }} Kommentare</span> -->
            </button>
            <button class="flex items-center space-x-1 hover:text-indigo-600 ">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"/>
              </svg>
            </button>
          </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content (rechts) -->
    <div class="main-content flex-1 flex flex-col">
      <!-- Suchbereich oben -->
      <div class="search-area bg-white p-4 border-b border-gray-200">
        <div class="relative max-w-md mx-auto">
          <input
            type="text"
            v-model="searchQuery"
            :placeholder="$t('root.search_bar')"
            class="w-full bg-gray-100 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-600 "
          >
          <svg class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
      </div>

      <!-- Ausgewählter Beitrag oder Platzhalter -->
      <div class="selected-post flex-1 p-6 overflow-y-auto">
        <div v-if="selectedBeitrag" class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center space-x-3 mb-4">
            <div class="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xl font-bold">
              {{ selectedBeitrag.autor.charAt(0) }}
            </div>
            <div>
              <h3 class="font-bold">{{ selectedBeitrag.autor }}</h3>
              <p class="text-gray-500 text-sm">{{ selectedBeitrag.datum }}</p>
            </div>
          </div>
          <p class="mb-4">{{ selectedBeitrag.inhalt }}</p>
          <div class="flex space-x-4 text-gray-500 border-t border-gray-200 pt-4">
            <button class="flex items-center space-x-1 hover:text-indigo-600">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
              <span>{{ selectedBeitrag.likes }}</span>
            </button>
            <button class="flex items-center space-x-1 hover:text-indigo-600">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
              <span>{{ selectedBeitrag.kommentare }} Kommentare</span>
            </button>
          </div>
        </div>
        <div v-else class="flex items-center justify-center h-full text-gray-400">
          <p>{{ $t('root.search_info') }}</p>
        </div>
      </div>

      <!-- Neue Beiträge unten -->
      <div class="new-posts bg-white border-t border-gray-200 p-4">
        <h3 class="font-medium mb-3">{{ $t('root.search_most_searched_title') }}</h3>
        <div class="grid grid-cols-3 gap-2">
          <div 
            v-for="(beitrag, index) in filteredBeitraege.slice(0, 3)" 
            :key="'new-'+index"
            class="bg-gray-100 rounded-md p-2 cursor-pointer hover:bg-gray-200 transition"
            @click="selectBeitrag(beitrag)"
          >
            <p class="text-sm line-clamp-2">{{ beitrag.inhalt }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFetch } from '../helpers/getPosts';
import { formatDate } from '../utils/formatDate.js';

import { 
  BookmarkIcon
} from '@heroicons/vue/24/outline'



const beitraege = ref([
  {
    id: 1,
    autor: '@Chipsly#69420',
    datum: 'Vor 2 Stunden',
    inhalt: 'Lorem ipsum dolor sit amet, consectetur sadipscing elit, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat!',
    likes: '24k',
    kommentare: 323,
    geteilt: 42
  },
  {
    id: 2,
    autor: '@Chipsly#69420',
    datum: 'Gestern',
    inhalt: 'Neuer Beitrag mit tollen Inhalten! Schaut euch das an!',
    likes: '14k',
    kommentare: 124,
    geteilt: 18
  },
  {
    id: 3,
    autor: '@Chipsly#69420',
    datum: 'Vor 3 Tagen',
    inhalt: 'Danke für all die Unterstützung! Ihr seid die Besten! 💖',
    likes: '32k',
    kommentare: 512,
    geteilt: 87
  },
  {
    id: 4,
    autor: '@User123',
    datum: 'Heute',
    inhalt: 'Ich liebe diese Plattform! So tolle Inhalte!',
    likes: '8k',
    kommentare: 42,
    geteilt: 5
  },
  {
    id: 5,
    autor: '@FanGirl',
    datum: 'Vor 1 Stunde',
    inhalt: 'Kann nicht aufhören diese Beiträge zu liken!',
    likes: '12k',
    kommentare: 87,
    geteilt: 12
  },
  {
    id: 6,
    autor: '@Chipsly#69420',
    datum: 'Vor 2 Stunden',
    inhalt: 'Lorem ipsum dolor sit amet, consectetur sadipscing elit, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat!',
    likes: '24k',
    kommentare: 323,
    geteilt: 42
  },
  {
    id: 7,
    autor: '@Chipsly#69420',
    datum: 'Vor 2 Stunden',
    inhalt: 'Lorem ipsum dolor sit amet, consectetur sadipscing elit, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat!',
    likes: '24k',
    kommentare: 323,
    geteilt: 42
  },
  {
    id: 8,
    autor: '@Chipsly#69420',
    datum: 'Vor 2 Stunden',
    inhalt: 'Lorem ipsum dolor sit amet, consectetur sadipscing elit, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat!',
    likes: '24k',
    kommentare: 323,
    geteilt: 42
  },
  {
    id: 9,
    autor: '@Chipsly#69420',
    datum: 'Vor 2 Stunden',
    inhalt: 'Lorem ipsum dolor sit amet, consectetur sadipscing elit, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat!',
    likes: '24k',
    kommentare: 323,
    geteilt: 42
  },
])
const posts = ref([]);

onMounted(async() => {
  const {data} = await useFetch('/posts')
  posts.value = data
  console.log(posts.value)
});




const selectedBeitrag = ref(null)
const searchQuery = ref('')
const router = useRouter()

const navigateToPost = (id) => {
  router.push({ name: 'PostDetail', params: { id } })
}

const filteredBeitraege = computed(() => {
  if (!searchQuery.value) return beitraege.value
  return beitraege.value.filter(beitrag => 
    beitrag.inhalt.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    beitrag.autor.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

function likepost(likedpost){
  console.log(likedpost)
}
</script>

<style scoped>
.app-container {
  display: flex;
}

.sidebar {
  width: 75%;
}

.main-content {
  display: flex;
  flex-direction: column;
  width: 25%;
}

.search-area {
  height: auto;
}

.selected-post {
  flex: 1;
}

.new-posts {
  height: 120px;
}

.line-clamp-2 {
  display: -webkit-box;
  /* -webkit-line-clamp: 2; */
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
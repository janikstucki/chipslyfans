<template>
  <div class="app-container flex h-screen bg-gray-100">
    <!-- Sidebar (links) -->
    <div ref="sidebarRef" class="sidebar w-3/4 bg-white border-r border-gray-200 overflow-y-auto">
      <div class="p-6">
        <h2 class="text-xl font-bold mb-4">{{ $t('root.title') }}</h2>
        <div class="space-y-4">
          <!-- Feed -->
          <div
              v-for="post in displayedPosts"
              :key="post.id"
              class="bg-white shadow-sm rounded-lg p-4 mb-6 hover:shadow-md transition"
              @click="navigateToPost(post.id)"
            >
            <!-- Header -->
            <div  class="flex items-center gap-3 cursor-pointer">
              <div class="w-10 h-10 rounded-full overflow-hidden bg-indigo-500 flex items-center justify-center text-white font-bold">
                <template v-if="post.author.profilepicture">
                  <img 
                    :src="post.author.profilepicture" 
                    alt="Profilepicture" 
                    class="w-full h-full object-cover"
                  />
                </template>
                <template v-else>
                  {{ post.author.username.charAt(0).toUpperCase() }}
                </template>
              </div>
              <div>
                <h3 class="font-semibold">{{ post.author.username }}</h3>
                <p class="text-sm text-gray-500">{{ formatDate(post.createdAt) }}</p>
              </div>
            </div>

            <!-- Title -->
            <h2 class="text-md font-bold mt-3 line-clamp-2">{{ post.title }}</h2>

            <!-- Content -->
            <p class="text-sm text-gray-700 mt-1 line-clamp-2" :class="!isAuth ? 'preview-text' : ''">
              {{ !isAuth ? post.content.slice(0, 60) + '...' : post.content }}
            </p>

            <!-- Image Carousel -->
            <div v-if="post.images && post.images.length" class="relative mt-3">
              <img
                :src="post.images[post.currentImageIndex || 0].url"
                @click.stop="openImageModal(post.images[post.currentImageIndex || 0].url)"
                class="rounded-md object-cover w-full h-60 cursor-zoom-in"/>
              <button
                v-if="post.images.length > 1 && post.currentImageIndex > 0"
                @click.stop="prevImage(post)"
                class="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black text-white rounded-full p-2 shadow-md transition">
                <ChevronLeftIcon class="h-5 w-5" />
              </button>

              <!-- Next Button -->
              <button
                v-if="post.images.length > 1 && post.currentImageIndex < post.images.length - 1"
                @click.stop="nextImage(post)"
                class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black text-white rounded-full p-2 shadow-md transition">
                <ChevronRightIcon class="h-5 w-5" />
              </button>
              <div
                v-if="post.images.length > 1"
                class="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-white bg-black/50 px-2 py-0.5 rounded">
                {{ (post.currentImageIndex || 0) + 1 }} / {{ post.images.length }}
              </div>
              <div
                v-if="!isAuth"
                class="preview-blur absolute inset-0 rounded-md"
              ></div>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-between text-gray-600 border-t border-b py-3 px-4">
              <!-- Like -->
              <button @click.stop="likePost(post.id)" class="flex items-center space-x-2 hover:text-blue-600">
                  <HeartIcon class="h-5 w-5" />
                  <span>{{ post.likes.likeCount }}</span>
              </button>
              <!-- Kommentieren -->
              <button class="flex items-center space-x-2 hover:text-blue-600">
                  <ChatBubbleLeftEllipsisIcon class="h-5 w-5" />
                  <span>Kommentieren</span>
              </button>
              <!-- Teilen -->
              <button @click.stop="sharePost(post.id)" class="flex items-center space-x-2 hover:text-blue-600">
                  <ShareIcon class="h-5 w-5" />
                  <span>Teilen</span>
              </button>
              <!-- Speichern -->
              <button @click.stop="savePost(post.id)" class="flex items-center space-x-2 hover:text-blue-600">
                  <BookmarkIcon class="h-5 w-5" />
                  <span>Speichern</span>
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

<script setup>
import fallbackimage from '../assets/images/fallback.jpg'
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useFetch } from '../helpers/getPosts';
import { formatDate } from '../utils/formatDate.js';
import { useAuthStore } from '../store/auth.js';
const authStore = useAuthStore();

import { 
  BookmarkIcon,
  HeartIcon,
  ChatBubbleLeftEllipsisIcon,
  ShareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowUturnRightIcon
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
const displayedPosts = ref([])
const currentPage = ref(1)
const pageSize = 5
const isLoadingPosts = ref(false)
const sidebarRef = ref(null)
const showImageModal = ref(false)
const fullImageUrl = ref('')

const isAuth = ref(null)

onMounted(async () => {
  authStore.checkAuth()
  isAuth.value = await checkAuthStatus()

  const { data } = await useFetch('/posts')
  posts.value = data
  console.log(posts.value)
  loadMorePosts()

  await nextTick() 
  if (sidebarRef.value) {
    sidebarRef.value.addEventListener('scroll', handleScroll)
  }
})


function handleScroll() {
  const container = sidebarRef.value
  if (
    container &&
    container.scrollTop + container.clientHeight >= container.scrollHeight - 50 &&
    displayedPosts.value.length < posts.value.length
  ) {
    console.log("scroll")
    loadMorePosts()
  }
}


function loadMorePosts() {
  if (isLoadingPosts.value) return
  isLoadingPosts.value = true

  const start = (currentPage.value - 1) * pageSize
  const end = currentPage.value * pageSize
  const nextPosts = posts.value.slice(start, end).map(post => ({
    ...post,
    currentImageIndex: 0
  }))

  displayedPosts.value.push(...nextPosts)
  currentPage.value++

  isLoadingPosts.value = false
}

async function checkAuthStatus() {
  try {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/protected`, {
      method: 'GET',
      credentials: 'include'
    })

    const data = await res.json()
    return res.ok && data?.user
  } catch (err) {
    console.error("Fehler beim Auth-Check:", err)
    return false
  }
}



const selectedBeitrag = ref(null)
const searchQuery = ref('')
const router = useRouter()

const navigateToPost = (id) => {
  router.push({ name: 'PostDetail', params: { id: id } })
}

const filteredBeitraege = computed(() => {
  if (!searchQuery.value) return beitraege.value
  return beitraege.value.filter(beitrag => 
    beitrag.inhalt.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    beitrag.autor.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})



function openImageModal(url) {
  fullImageUrl.value = url
  showImageModal.value = true
}
function closeImageModal() {
  showImageModal.value = false
  fullImageUrl.value = ''
}

function nextImage(post) {
  post.currentImageIndex = (post.currentImageIndex || 0) + 1
}
function prevImage(post) {
  post.currentImageIndex = (post.currentImageIndex || 0) - 1
}


function likePost(postId) {

}
function sharePost(postId) {

}
function savePost(saveId){

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
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.preview-blur::after {
  content: '';
  position: absolute;
  inset: 0;
  background-color: rgba(0,0,0,0.2);
  backdrop-filter: blur(1px);
  z-index: 10;
  border-radius: 0.375rem; 
} 


.preview-text {
  color: rgba(0,0,0,0.6);
  filter: blur(1px);
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
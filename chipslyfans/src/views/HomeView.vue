<template>
<div class="w-full bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-30">

  <div class="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-6 max-w-7xl mx-auto">
    <!-- Title -->
    <h2 class="text-xl font-bold whitespace-nowrap">{{ $t('root.title') }}</h2>

    <!-- Search Desktop -->
    <div class="relative flex-1 hidden sm:block">
      <input
        type="text"
        v-model="searchQuery"
        :placeholder="$t('root.search_bar')"
        class="w-full bg-gray-100 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-600"
      />
      <svg class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>

    <!-- Search Icon Mobile -->
    <div class="sm:hidden ml-auto">
      <button @click="toggleMobileSearch" class="text-gray-600 hover:text-indigo-600">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </div>

    <!-- Mobile Dropdown Input -->
    <transition name="fade">
      <div v-if="isMobileSearchOpen" class="w-full sm:hidden mt-3">
        <input
          type="text"
          v-model="searchQuery"
          :placeholder="$t('root.search_bar')"
          class="w-full bg-gray-100 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />
      </div>
    </transition>
  </div>
</div>

  <div class="app-container flex h-screen bg-gray-100">
    <!-- Sidebar (links) -->
    <div ref="sidebarRef" class="sidebar  bg-white border-r border-gray-200 overflow-y-auto">
      <div class="p-6">
        <div class="space-y-4">
          <!-- Feed -->
          <div  
              v-for="post in displayedPosts"
              :key="post.id"
              class="bg-white shadow-sm rounded-lg p-4 mb-6 hover:shadow-md transition"
              @click="!isClickOnProfile && navigateToPost(post.id)"
            >
            <!-- Header -->
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full overflow-hidden bg-indigo-500 flex items-center justify-center text-white font-bold"
                    @click.stop="onUserClick(post.author.id)">
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
              <div @click.stop="onUserClick(post.author.id)">
                <h3 class="font-semibold cursor-pointer">{{ post.author.username }}</h3>  
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
            <!-- <div
              v-if="post.images && post.images.length"
              class="image-wrapper mt-3"
              @touchstart="startTouch($event, post)"
              @touchmove="moveTouch($event, post)"
              @touchend="endTouch(post)">
            <div class="slider-container" :style="{ transform: `translateX(-${post.currentImageIndex * 100}%)` }">
              <div v-for="(img, index) in post.images" :key="index" class="slide">
                <img
                  :src="img.url"
                  @click.stop="openImageModal(img.url)"
                  class="object-cover w-full h-full cursor-zoom-in rounded"
                />
              </div>
            </div>

            <button
              v-if="post.currentImageIndex > 0"
              @click.stop="changeImage(post, 'prev')"
              class="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black text-white rounded-full p-2 shadow-md z-10">
              <ChevronLeftIcon class="h-5 w-5" />
            </button>

            <button
              v-if="post.currentImageIndex < post.images.length - 1"
              @click.stop="changeImage(post, 'next')"
              class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black text-white rounded-full p-2 shadow-md z-10">
              <ChevronRightIcon class="h-5 w-5" />
            </button>
          </div> -->
          <PhotoGrid
            v-if="post.images && post.images.length"
            :images="post.images"
            @zoom="openImageModal"/>



            <!-- Actions -->
            <div class="grid grid-cols-2 xs:grid-cols-4 sm:flex sm:justify-between gap-y-2 text-gray-600 border-t border-b py-3 px-4">
              <!-- Like -->
              <button @click.stop="toggleLike(post.id)" class="flex items-center space-x-2 hover:text-blue-600">
                <component
                  :is="post.hasLiked ? HeartIconSolid : HeartIcon"
                  :class="['h-5 w-5 shrink-0', post.hasLiked ? 'text-blue-600' : '']"
                />
                <span>{{ post.likes.likeCount }}</span>
              </button>
              <!-- Kommentieren -->
              <button class="hidden xs:flex items-center space-x-2 hover:text-blue-600">
                  <ChatBubbleLeftEllipsisIcon class="h-5 w-5 shrink-0" />
                  <span>Kommentieren</span>
              </button>
              <!-- Teilen -->
              <ShareBtn/>
              <!-- Speichern -->
              <button @click.stop="savePost(post.id)" class="flex items-center space-x-2 hover:text-blue-600">
                  <BookmarkIcon class="h-5 w-5 shrink-0" />
                  <span>Speichern</span>
              </button>
            </div>
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
          @click.stop="closeImageModal"
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
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useFetch } from '../helpers/getPosts';
import { useAuthStore } from '../store/auth.js';
import { useI18n } from 'vue-i18n'
import { formatDate as formatDateUtil } from '../utils/formatDate.js'



const authStore = useAuthStore();
import ShareBtn from '../components/ShareBtn.vue';
import PhotoGrid from '../components/PhotoGrid.vue'
import { 
  BookmarkIcon,
  HeartIcon,
  ChatBubbleLeftEllipsisIcon,
  ShareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowUturnRightIcon
} from '@heroicons/vue/24/outline'
import {
    HeartIcon as HeartIconSolid,
} from '@heroicons/vue/24/solid'

const { t } = useI18n()

function formatDate(dateString) {
  return formatDateUtil(dateString, t)
}


const beitraege = ref([
  
])
const posts = ref([]);
const displayedPosts = ref([])
const currentPage = ref(1)
const pageSize = 5
const isLoadingPosts = ref(false)
const sidebarRef = ref(null)
const showImageModal = ref(false)
const fullImageUrl = ref('')
const userId = ref(null);
const allLoaded = ref(false)
const isMobile = ref(window.innerWidth < 768)
const isMobileSearchOpen = ref(false)

const isAuth = ref(null)

onMounted(async () => {
  window.addEventListener('resize', handleResize)
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

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})


const isClickOnProfile = ref(false)

function onUserClick(userId) {
  isClickOnProfile.value = true
  router.push({ name: 'UserDetail', params: { id: userId } })
  // Reset nach kurzer Verzögerung
  setTimeout(() => {
    isClickOnProfile.value = false
  }, 10)
}

function toggleMobileSearch() {
  isMobileSearchOpen.value = !isMobileSearchOpen.value
}

function handleResize() {
  isMobile.value = window.innerWidth < 768
}


function handleScroll() {
  const container = sidebarRef.value
  if (
    container &&
    container.scrollTop + container.clientHeight >= container.scrollHeight - 50
  ) {
    loadMorePosts()
  }
}


async function checkAuthStatus() {
  try {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/protected`, {
      method: 'GET',
      credentials: 'include'
    });

    const data = await res.json();
    if (res.ok && data?.user) {
      userId.value = data.user.id;
      return true;
    }
    return false;
  } catch (err) {
    console.error("Fehler beim Auth-Check:", err);
    return false;
  }
}

async function loadMorePosts() {
  if (isLoadingPosts.value || allLoaded.value) return
  isLoadingPosts.value = true

  try {
    const offset = displayedPosts.value.length
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/posts?offset=${offset}&limit=${pageSize}`)
    const data = await res.json()

    if (Array.isArray(data) && data.length > 0) {
      const newPosts = data.map(post => ({
        ...post,
        currentImageIndex: 0,
        hasLiked: post.likes?.likedBy?.includes(userId.value) || false
      }))
      displayedPosts.value.push(...newPosts)

      // 👇 Wenn weniger als pageSize zurückkommt, gibt es keine weiteren Posts mehr
      if (data.length < pageSize) {
        allLoaded.value = true
      }
    } else {
      // 👇 Wenn gar keine mehr zurückkommen
      allLoaded.value = true
    }
  } catch (e) {
    console.error("Fehler beim Nachladen:", e)
  } finally {
    isLoadingPosts.value = false
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

async function toggleLike(postId) {
  try {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/interactions/like/${postId}`, {
      method: 'POST',
      credentials: 'include'
    })
    const data = await res.json()
    if (res.ok) {
      const updatedPost = displayedPosts.value.find(p => p.id === postId)
      if (updatedPost) {
        updatedPost.likes.likeCount = data.likes.likeCount
        updatedPost.hasLiked = data.likes.likedBy.includes(userId.value)
      }
    } else {
      console.error('Fehler beim Liken:', data.message)
    }
  } catch (err) {
    console.error('Fehler beim Like Request:', err)
  }
}

function sharePost(postId) {

}
function savePost(saveId){

}



function changeImage(post, direction) {
  const maxIndex = post.images.length - 1
  const current = post.currentImageIndex || 0

  if (direction === 'next' && current < maxIndex) {
    post.currentImageIndex++
  } else if (direction === 'prev' && current > 0) {
    post.currentImageIndex--
  }
}

let touchStartX = 0
let touchEndX = 0

function startTouch(e, post) {
  touchStartX = e.changedTouches[0].clientX
}

function moveTouch(e, post) {
  touchEndX = e.changedTouches[0].clientX
}

function endTouch(post) {
  const diff = touchStartX - touchEndX
  if (Math.abs(diff) > 50) {
    if (diff > 0) changeImage(post, 'next')
    else changeImage(post, 'prev')
  }
}


</script>

<style scoped>
.app-container {
  display: flex;
}

.sidebar {
  width: 100%;
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
.image-wrapper img {
  pointer-events: none;
}
.image-slide.active img {
  pointer-events: auto;
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
.image-wrapper {
  position: relative;
  overflow: hidden;
  height: 15rem;
}

.image-wrapper button {
  z-index: 5; /* Damit Buttons über den Slides liegen */
}

.image-wrapper {
  position: relative;
  overflow: hidden;
  height: 15rem;
}

.slider-container {
  display: flex;
  width: 100%;
  height: 100%;
  transition: transform 0.5s ease;
}

.slide {
  min-width: 100%;
  height: 100%;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>
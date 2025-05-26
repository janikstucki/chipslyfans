<!-- src/views/PostDetail.vue -->
<script setup>
    import { ref, onMounted } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { useI18n } from 'vue-i18n';
    import { formatDate as formatDateUtil } from '../utils/formatDate.js'
    import {
        HeartIcon,
        ChatBubbleLeftEllipsisIcon,
        ShareIcon,
        BookmarkIcon,   
        ChevronLeftIcon,
        ChevronRightIcon,
        ArrowUturnRightIcon
    } from '@heroicons/vue/24/outline'


    import {
        HeartIcon as HeartIconSolid,
    } from '@heroicons/vue/24/solid'


    import ShareBtn from '../components/ShareBtn.vue'
    

    const post = ref(null)
    const router = useRouter()
    const currentImageIndex = ref(0)
    const showImageModal = ref(false)
    const fullImageUrl = ref('')
    const userId = ref(null)
    const hasLiked = ref(false)

    const { t } = useI18n()
    

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



const route = useRoute()
const postId = route.params.id;

const comments = ref([]);
const commentText = ref('');

// Kommentare beim Laden der View holen
async function loadComments() {
  try {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/comments/post/${postId}`);
    comments.value = await res.json();
    console.log('Kommentare:', comments.value);
  } catch (err) {
    console.error('Fehler beim Laden der Kommentare:', err);
  }
}

// Neuen Kommentar absenden
async function submitComment() {
  try {
    const trimmed = commentText.value.trim()
    if (!trimmed) return;

    // 👇 Provisorischer Kommentar erstellen
    const tempId = `temp-${Date.now()}`
    const provisionalComment = {
      id: tempId,
      text: trimmed,
      createdAt: new Date().toISOString(),
      author: {
        id: userId.value,
        username: 'Du',
        profilepicture: null
      },
      pending: true
    }

    // Direkt anzeigen
    comments.value.unshift(provisionalComment)
    commentText.value = ''

    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/interactions/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ postId, text: trimmed }),
    })

    if (!response.ok) {
      throw new Error('Fehler beim Senden')
    }

    const savedComment = await response.json()

    // Ersetze provisorischen Kommentar
    const index = comments.value.findIndex(c => c.id === tempId)
    if (index !== -1) {
      comments.value[index] = savedComment
    }

  } catch (err) {
    console.error('❌ Kommentar fehlgeschlagen:', err)

    // Entferne provisorischen Kommentar wieder
    comments.value = comments.value.filter(c => !c.id.startsWith('temp'))

    // Optional: Feedback anzeigen
    alert('Kommentar konnte nicht gespeichert werden.')
  }
}


onMounted(() => {
  loadComments();
});


function onUserClick(userId) {
    router.push({ name: 'UserDetail', params: { id: userId } })
}
    
onMounted(async () => {
  try {
    const authRes = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/protected`, {
      credentials: 'include'
    })
    const authData = await authRes.json()
    if (authRes.ok && authData.user) {
      userId.value = authData.user.id
    }

    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/posts/${postId}`, {
      method: 'GET',
      credentials: 'include'
    })
    const data = await res.json()

    if (res.ok && data.success) {
      post.value = data.data
      hasLiked.value = post.value.likes?.likedBy?.includes(userId.value)
    } else {
      console.warn('Post nicht gefunden oder Fehler:', data)
    }
  } catch (err) {
    console.error('Fehler beim Laden des Posts oder Auth:', err)
  }
})


async function toggleLike() {
  try {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/interactions/like/${post.value.id}`, {
      method: 'POST',
      credentials: 'include'
    })
    const data = await res.json()
    if (res.ok) {
      post.value.likes.likeCount = data.likes.likeCount
      hasLiked.value = data.likes.likedBy.includes(userId.value)
    } else {
      console.error('Fehler beim Liken:', data.message)
    }
  } catch (err) {
    console.error('Fehler beim Like Request:', err)
  }
}



let touchStartX = 0
let touchEndX = 0
function startTouch(e) {
    touchStartX = e.changedTouches[0].clientX
}
function moveTouch(e) {
    touchEndX = e.changedTouches[0].clientX
}
function endTouch() {
    const diff = touchStartX - touchEndX
    if (Math.abs(diff) > 50) {
        if (diff > 0) nextImage()
        else prevImage()
    }
}
function formatDate(dateString) {
  return formatDateUtil(dateString, t)
}

</script>

<template>
    <div  class="w-full max-w-2xl mx-auto bg-white shadow-md rounded-lg overflow-hidden mt-6">
        <!-- Header -->
        <div v-if="post">
            <div @click="onUserClick(post.author.id)" class="flex items-center justify-between px-6 py-4 border-b">
                <div class="flex items-center space-x-3">
                    <div class="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                        {{ post.author.username.charAt(0).toUpperCase() }}
                    </div>
                    <div>
                        <p class="font-semibold">{{ post.author.username }}</p>
                        <span class="text-xs text-gray-500">{{ formatDate(post.createdAt) }}</span>
                    </div>
                </div>
            </div>
        
            <!-- Bild oder Karussell -->
            <div v-if="post.images && post.images.length"
                class="image-wrapper"
                @touchstart="startTouch($event)"
                @touchmove="moveTouch($event)"
                @touchend="endTouch">
                <div class="slider-container" :style="{ transform: `translateX(-${currentImageIndex * 100}%)` }">
                    <div v-for="(img, index) in post.images" :key="index" class="slide">
                        <img
                            :src="img.url"
                            @click="openImageModal(img.url)"
                            class="object-cover w-full h-full cursor-zoom-in rounded"/>
                    </div>
                </div>

                <!-- Prev Button -->
                <button
                    v-if="currentImageIndex > 0"
                    @click.stop="prevImage"
                    class="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black text-white rounded-full p-2 shadow-md z-10">
                    <ChevronLeftIcon class="h-5 w-5" />
                </button>

                <!-- Next Button -->
                <button
                    v-if="currentImageIndex < post.images.length - 1"
                    @click.stop="nextImage"
                    class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black text-white rounded-full p-2 shadow-md z-10">
                    <ChevronRightIcon class="h-5 w-5" />
                </button>

                <!-- Indicator -->
                <div
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
                    <button @click="toggleLike" class="flex items-center space-x-2 hover:text-blue-600">
                        <component
                            :is="hasLiked ? HeartIconSolid : HeartIcon"
                            :class="['h-5 w-5', hasLiked ? 'text-blue-600' : '']"/>
                        <span>{{ post.likes.likeCount }}</span>
                    </button>

                    <!-- Kommentieren -->
                    <button class="flex items-center space-x-2 hover:text-blue-600">
                        <ChatBubbleLeftEllipsisIcon class="h-5 w-5" />
                        <span>Kommentieren</span>
                    </button>

                    
                    <ShareBtn :postLink="`${post.id}`" />
                    
                    

                    <!-- Speichern -->
                    <button class="flex items-center space-x-2 hover:text-blue-600">
                        <BookmarkIcon class="h-5 w-5" />
                        <span>Speichern</span>
                    </button>
                </div>
            </div>
        
            <div class="px-6 py-4">
        <h3 class="font-semibold text-sm text-gray-600 mb-2">Kommentare</h3>
        
        <!-- Liste der existierenden Kommentare -->
        <div v-if="comments.length" class="space-y-4 mb-6">
            <div 
                v-for="c in comments" 
                :key="c.id" 
                class="bg-white p-4 rounded-lg shadow-sm"
            >
                <div class="flex items-center gap-3 mb-2">
                    <div
                        class="w-10 h-10 rounded-full overflow-hidden bg-indigo-500 flex items-center justify-center text-white font-bold shrink-0"
                        @click.stop="onUserClick(c.author.id)">
                        <template v-if="c.author.profilepicture">
                            <img
                                :src="c.author.profilepicture"
                                alt="Profilbild"
                                class="w-full h-full object-cover"/>
                            </template>
                        <template v-else>
                            {{ c.author.username.charAt(0).toUpperCase() }}
                        </template>
                    </div>
                    <div class="flex flex-col">
                        <span class="font-semibold text-sm leading-none">{{ c.author.username }}</span>
                        <span class="text-xs text-gray-500">{{ formatDate(c.createdAt) }}</span>
                    </div>
                </div>
                <p class="text-gray-800 text-sm">{{ c.text }}</p>
            </div>
        </div>
        <div v-else class="text-gray-500 italic mb-6">
        Noch keine Kommentare – sei der Erste! 😊
        </div>

        <!-- Neues Kommentar schreiben -->
        <textarea
        v-model="commentText"
        @keyup.enter="submitComment"
        rows="4"
        class="w-full min-h-20 px-4 py-3 bg-gray-100 border border-gray-400 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-indigo-600"
        placeholder="Schreib deinen Kommentar..."
        ></textarea>

        <div class="flex justify-end mt-4">
        <button
            class="bg-gradient-to-l from-blue-700 to-indigo-400 text-white py-2 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-300 transform transition-all duration-300 ease-in-out disabled:opacity-50"
            :disabled="commentText.length < 1"
            @click="submitComment"
        >
            Veröffentlichen
        </button>
        </div>
    </div>
        </div>
        <div v-if="!post">
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

.image-wrapper {
    position: relative;
    overflow: hidden;
    height: 18rem;
    margin-top: 1rem;
    border-radius: 0.5rem;
}

.slider-container {
    display: flex;
    transition: transform 0.5s ease;
    width: 100%;
    height: 100%;
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

<script setup>
import { useRoute } from 'vue-router';
import { computed, ref, onMounted, onBeforeUnmount  } from 'vue';
import { useAuthStore } from './store/auth.js';
import { useFetch } from './helpers/authenticate.js'
import { 
  ChevronRightIcon, 
  ChevronLeftIcon,
  HomeIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  BookmarkIcon,
  UserGroupIcon,
  UserIcon,
  EllipsisHorizontalIcon,
  PlusIcon,
  ArrowLeftEndOnRectangleIcon,
  ArrowLeftStartOnRectangleIcon,

} from '@heroicons/vue/24/outline'
import router from './router';

const isExpanded = ref(true)
const isMobile = ref(false)
const authStore = useAuthStore();
const isSidebarVisibleMobile = ref(false)


function toggleSidebar() {
  if (!isMobile.value) {
    isExpanded.value = !isExpanded.value
  }
}

function handleResize() {
  isMobile.value = window.innerWidth < 1024

  if (isMobile.value) {
    isExpanded.value = false         // Sidebar schmal
    isSidebarVisibleMobile.value = false // Overlay zu
  } else {
    isSidebarVisibleMobile.value = false // Reset mobile state
    isExpanded.value = true         // Desktop starten wir expanded
  }
}


const createNewPost = () => {
  console.log('Create new post clicked')
}

const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 1024
}

const isAuth = ref(null)
onMounted(async () => {
  handleResize()
  window.addEventListener('resize', handleResize)
  authStore.checkAuth();
  isAuth.value = await isAuthenticated.value
  console.log(await isAuthenticated.value)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})



const login = () => {
  router.push('/login')
};


async function logout() {
    try {
        const { res } = await useFetch('/auth/logout', {
            method: 'POST',
            credentials: 'include',
        });

        if (res.ok) {
            console.log("✅ Erfolgreich ausgeloggt");
            // Optional: Weiterleitung
            window.location.href = '/login';
        } else {
            console.warn("⚠️ Logout fehlgeschlagen");
        }
    } catch (error) {
        console.error("❌ Fehler beim Logout:", error);
    }
}

const route = useRoute();
const showNavbar = computed(() => route.path !== '/login');


const isAuthenticated = computed(async () => {
    try {
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/protected`, {
            method: 'GET', 
            credentials: 'include'
        });
        console.log(res)

        const data = await res.json();
        if (res && res.ok && data?.user) {
        console.log("Benutzer ist authentifiziert:", data.user);
        return true;
        } else {
        console.warn("Benutzer ist nicht authentifiziert");
        return false;
        }
    } catch (error) {
        console.error("Fehler beim Auth-Check:", error);
        return false;
    }
})

</script>

<template>
  <div class="app flex min-h-screen">
    <!-- Sidebar/Navbar with content-->
    <div class="flex h-full bg-gray-100" v-if="showNavbar">
    <!-- Sidebar -->
      <aside 
        class="sidebar bg-white border-r border-gray-200 transition-all duration-300 z-50 h-full"
        :class="[
          isMobile
            ? isSidebarVisibleMobile ? 'fixed top-0 left-0 w-64 shadow-xl' : 'w-20'
            : isExpanded ? 'w-64' : 'w-20',
          !isMobile ? 'fixed top-0 bottom-0' : ''
        ]">
        <!-- Toggle Button -->
        <button 
          v-if="!isMobile"
          @click="toggleSidebar"
          class="absolute -right-3 top-5 bg-white rounded-full p-1 shadow-md border border-gray-200 hover:bg-gray-100 z-10">
          <ChevronRightIcon v-if="!isExpanded" class="h-4 w-4 text-gray-600" />
          <ChevronLeftIcon v-else class="h-4 w-4 text-gray-600" />
        </button>

        <!-- Mobile-Toggle (oben links oder in Header je nach Geschmack) -->
        <button
          v-if="isMobile"
          @click="isSidebarVisibleMobile = !isSidebarVisibleMobile"
          class="fixed top-4 left-4 z-50 bg-white p-2 rounded-full shadow-md border hover:bg-gray-100"
        >
          <ChevronRightIcon v-if="!isSidebarVisibleMobile" class="h-5 w-5 text-gray-600" />
          <ChevronLeftIcon v-else class="h-5 w-5 text-gray-600" />
        </button>

        <!-- Logo -->
        <div class="flex items-center justify-center h-16 border-b border-gray-200">
          <span v-if="isExpanded" class="text-xl font-bold"><router-link 
            to="/">ChipslyFans</router-link></span>
          <span v-else class="text-xl font-bold">C</span>
        </div>

        <!-- Navigation Items -->
        <nav class="mt-4">
          <router-link 
            to="/" 
            class="flex items-center mx-3 my-1 p-3 rounded-lg transition-all duration-200 group hover:bg-gray-100"
            active-class="bg-gray-100 text-blue-600"
          >
            <HomeIcon class="h-6 w-6 flex-shrink-0" />
            <span class="ml-3 whitespace-nowrap transition-opacity duration-200" :class="{ 'opacity-0': (!isExpanded && !isSidebarVisibleMobile) }">{{ $t('nav.start') }}</span>
          </router-link>

          <router-link 
            to="/inbox" 
            class="flex items-center mx-3 my-1 p-3 rounded-lg transition-all duration-200 group hover:bg-gray-100"
            active-class="bg-gray-100 text-blue-600"
          >
            <EnvelopeIcon class="h-6 w-6 flex-shrink-0" />
            <span class="ml-3 whitespace-nowrap transition-opacity duration-200" :class="{ 'opacity-0': (!isExpanded && !isSidebarVisibleMobile) }">{{ $t('nav.inbox') }}</span>
          </router-link>

          <router-link 
            to="/messages" 
            class="flex items-center mx-3 my-1 p-3 rounded-lg transition-all duration-200 group hover:bg-gray-100"
            active-class="bg-gray-100 text-blue-600"
          >
            <ChatBubbleLeftRightIcon class="h-6 w-6 flex-shrink-0" />
            <span class="ml-3 whitespace-nowrap transition-opacity duration-200" :class="{ 'opacity-0': (!isExpanded && !isSidebarVisibleMobile) }">{{ $t('nav.messages') }}</span>
          </router-link>

          <router-link 
            to="/collection" 
            class="flex items-center mx-3 my-1 p-3 rounded-lg transition-all duration-200 group hover:bg-gray-100"
            active-class="bg-gray-100 text-blue-600"
          >
            <BookmarkIcon class="h-6 w-6 flex-shrink-0" />
            <span class="ml-3 whitespace-nowrap transition-opacity duration-200" :class="{ 'opacity-0': (!isExpanded && !isSidebarVisibleMobile) }">{{ $t('nav.collection') }}</span>
          </router-link>

          <router-link 
            to="/subscriptions" 
            class="flex items-center mx-3 my-1 p-3 rounded-lg transition-all duration-200 group hover:bg-gray-100"
            active-class="bg-gray-100 text-blue-600"
          >
            <UserGroupIcon class="h-6 w-6 flex-shrink-0" />
            <span class="ml-3 whitespace-nowrap transition-opacity duration-200" :class="{ 'opacity-0': (!isExpanded && !isSidebarVisibleMobile) }">{{ $t('nav.abonements') }}</span>
          </router-link>

          <router-link 
            to="/profil" 
            class="flex items-center mx-3 my-1 p-3 rounded-lg transition-all duration-200 group hover:bg-gray-100"
            active-class="bg-gray-100 text-blue-600"
          >
            <UserIcon class="h-6 w-6 flex-shrink-0" />
            <span class="ml-3 whitespace-nowrap transition-opacity duration-200" :class="{ 'opacity-0': (!isExpanded && !isSidebarVisibleMobile) }">{{ $t('nav.profile') }}</span>
          </router-link>

          <router-link 
            to="/more" 
            class="flex items-center mx-3 my-1 p-3 rounded-lg transition-all duration-200 group hover:bg-gray-100"
            active-class="bg-gray-100 text-blue-600"
          >
            <EllipsisHorizontalIcon class="h-6 w-6 flex-shrink-0" />
            <span class="ml-3 whitespace-nowrap transition-opacity duration-200" :class="{ 'opacity-0': (!isExpanded && !isSidebarVisibleMobile) }">{{ $t('nav.more') }}</span>
          </router-link>

          <div class="px-3 mt-6 transition-all duration-300" :class="{'mx-0': !isExpanded, 'mx-3': isExpanded}">
            <button 
              @click="router.push('/new-post')"
              class="w-full flex items-center justify-center p-3 rounded-lg transition-all duration-200 bg-blue-600 text-white hover:bg-blue-700 overflow-hidden"
            >
              <PlusIcon class="h-6 w-6 flex-shrink-0 text-white" />
              <span 
                class="ml-3 whitespace-nowrap transition-opacity duration-200"
                :class="{'opacity-0 w-0': !isExpanded, 'opacity-100 w-auto': isExpanded}"
              >
                {{ $t('nav.new_post') }}
              </span>
            </button>
          </div>
        </nav>
        <div class="px-3 mt-6 transition-all duration-300" :class="{'mx-0': !isExpanded, 'mx-3': isExpanded}">
          <button 
            v-if="!isAuth" 
            @click="login"
            class="w-full flex items-center justify-center p-3 rounded-lg transition-all duration-200 bg-blue-600 text-white hover:bg-blue-700 overflow-hidden"
          >
            <ArrowLeftEndOnRectangleIcon class="h-6 w-6 flex-shrink-0 text-white" />
            <span class="ml-3 whitespace-nowrap transition-opacity duration-200"
            :class="{'opacity-0 w-0': !isExpanded, 'opacity-100 w-auto': isExpanded}">Login</span>
          </button>
          <button 
          v-else
            @click="logout"
            class="w-full flex items-center justify-center p-3 rounded-lg transition-all duration-200 bg-blue-600 text-white hover:bg-blue-700 overflow-hidden"
          >
            <ArrowLeftStartOnRectangleIcon class="h-6 w-6 flex-shrink-0 text-white" />
            <span class="ml-3 whitespace-nowrap transition-opacity duration-200"
            :class="{'opacity-0 w-0': !isExpanded, 'opacity-100 w-auto': isExpanded}">Logout</span>
          </button>
        </div>
      </aside>
      <div
  v-if="isSidebarVisibleMobile"
  @click="isSidebarVisibleMobile = false"
  class="fixed inset-0 bg-black/30 z-40 sm:hidden"
></div>
    </div>

    <main 
      v-if="showNavbar"
      class="flex-1 overflow-auto transition-all duration-300"
      :class="{
        'ml-64': isExpanded && !isMobile,
        'ml-20': !isExpanded && !isMobile,
        'ml-0': isMobile
      }"
    >
      <router-view />
    </main>
    <main 
      class="flex-1 overflow-auto transition-all duration-300"
      v-if="!showNavbar"
    >
      <router-view />
    </main>
  </div>
</template>





<style>
@import url('./style.css');   
</style>


<style scoped>
.app {
  /* Flex layout ensures navbar and content stay in place */
  display: flex;
  flex-direction: row;
}

.sidebar {
  transition-property: width;
}

@media (max-width: 1023px) {
  .sidebar {
    transform: translateX(-100%);
  }
  .sidebar.w-64, .sidebar.w-20 {
    transform: translateX(0);
  }
}

.mt-auto {
  margin-top: auto;
}
.opacity-0 {
  transition: opacity 0.2s ease;
}
</style>

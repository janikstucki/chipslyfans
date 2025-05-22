<template>
  <div>
    <!-- Grid Layout ab sm -->
    <div v-if="!isMobile">
      <div v-if="count === 1" class="grid grid-cols-1 h-max-40">
        <img :src="images?.[0]?.url" class="w-full h-auto object-cover rounded cursor-pointer" @click="$emit('zoom', images[0].url)" />
      </div>

      <div v-else-if="count === 2" class="grid grid-cols-2 gap-1 h-max-40">
        <img v-for="(image, index) in images" :key="index" :src="image.url" class="w-full h-64 object-cover rounded cursor-pointer" @click="$emit('zoom', image.url)" />
      </div>

      <div v-else-if="count === 3" class="grid grid-cols-3 gap-1 h-max-40">
        <img :src="images?.[0]?.url" class="col-span-2 row-span-2 w-full h-full object-cover rounded cursor-pointer" @click="$emit('zoom', images[0].url)" />
        <div class="grid grid-rows-2 gap-1">
          <img v-for="(image, index) in images.slice(1)" :key="index" :src="image.url" class="w-full h-full object-cover rounded cursor-pointer" @click="$emit('zoom', image.url)" />
        </div>
      </div>

      <div v-else-if="count === 4" class="grid grid-cols-2 gap-1 h-max-40">
        <img v-for="(image, index) in images" :key="index" :src="image.url" class="w-full h-48 object-cover rounded cursor-pointer" @click="$emit('zoom', image.url)" />
      </div>

      <div v-else-if="count === 5" class="grid grid-cols-3 gap-1 h-max-40">
        <img :src="images?.[0]?.url" class="col-span-2 row-span-2 w-full h-full object-cover rounded cursor-pointer" @click="$emit('zoom', images[0].url)" />
        <div class="grid grid-rows-2 gap-1">
          <img v-for="(image, index) in images.slice(1)" :key="index" :src="image.url" class="w-full h-full object-cover rounded cursor-pointer" @click="$emit('zoom', image.url)" />
        </div>
      </div>

      <div v-else class="grid grid-cols-3 gap-1 h-max-40">
        <div v-for="(image, index) in visibleImages" :key="index" class="relative h-40 cursor-pointer" @click="$emit('zoom', image.url)">
          <img :src="image.url" class="w-full h-full object-cover rounded" />
          <div v-if="showMore(index)" class="absolute inset-0 bg-black/60 text-white flex items-center justify-center text-xl font-bold">
            +{{ images.length - maxVisible }}
          </div>
        </div>
      </div>
    </div>

    <!-- Carousel Layout unter sm mit Swipe -->
    <div v-else
         class="relative overflow-hidden h-60"
         @touchstart="onTouchStart"
         @touchmove="onTouchMove"
         @touchend="onTouchEnd">
      <div class="flex transition-transform duration-300 ease-in-out"
           :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
        <div v-for="(image, index) in images" :key="index" class="min-w-full h-60 flex items-center justify-center">
          <img :src="image.url" class="object-cover w-full h-full cursor-zoom-in rounded" @click="$emit('zoom', image.url)" />
        </div>
      </div>
      <button v-if="currentIndex > 0" @click="currentIndex--"
              class="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-2">
        ‹
      </button>
      <button v-if="currentIndex < images.length - 1" @click="currentIndex++"
              class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-2">
        ›
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  images: Array
})

const maxVisible = 5
const currentIndex = ref(0)
const isMobile = ref(false)
const touchStartX = ref(0)
const touchEndX = ref(0)

const updateSize = () => {
  isMobile.value = window.innerWidth < 640
}

onMounted(() => {
  updateSize()
  window.addEventListener('resize', updateSize)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateSize)
})

function onTouchStart(e) {
  touchStartX.value = e.changedTouches[0].clientX
}
function onTouchMove(e) {
  touchEndX.value = e.changedTouches[0].clientX
}
function onTouchEnd() {
  const diff = touchStartX.value - touchEndX.value
  if (Math.abs(diff) > 50) {
    if (diff > 0 && currentIndex.value < (props.images?.length || 0) - 1) currentIndex.value++
    else if (diff < 0 && currentIndex.value > 0) currentIndex.value--
  }
}

const count = computed(() => props.images?.length || 0)

const visibleImages = computed(() =>
  count.value > maxVisible ? props.images.slice(0, maxVisible) : props.images
)

function showMore(index) {
  return props.images?.length > maxVisible && index === maxVisible - 1
}
</script>

<style scoped>
</style>

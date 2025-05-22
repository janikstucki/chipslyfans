<template>
    <div>
        <!-- Grid-Layout ab sm -->
        <div v-if="!isMobile" :class="['grid gap-1', gridClass]">
            <div
                v-for="(image, index) in visibleImages"
                :key="index"
                class="relative overflow-hidden h-40"
                :class="cellClass(index)"
                @click.stop="$emit('zoom', image.url)">
                <img :src="image.url" class="w-full h-full object-cover rounded" />
                <div v-if="showMore(index)" class="absolute inset-0 bg-black/60 text-white flex items-center justify-center text-xl font-bold">
                    +{{ images.length - maxVisible }}
                </div>
            </div>
        </div>

            <!-- Carousel-Layout für Mobil -->
            <div v-else
                @touchstart="onTouchStart"
                @touchmove="onTouchMove"
                @touchend="onTouchEnd" 
                class="relative overflow-hidden h-60">
            <div class="flex transition-transform duration-300 ease-in-out" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
                <div v-for="(image, index) in images" :key="index" class="min-w-full h-60 flex items-center justify-center">
                    <img :src="image.url" class="object-cover w-full h-full cursor-zoom-in rounded" @click.stop="$emit('zoom', image.url)" />
                </div>
            </div>

            <button
                v-if="currentIndex > 0"
                @click.stop="currentIndex--"
                class="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-2">
                ‹
            </button>

            <button
                v-if="currentIndex < images.length - 1"
                @click.stop="currentIndex++"
                class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-2">
                ›
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const props = defineProps({
    images: Array
})
const maxVisible = 5
const currentIndex = ref(0)
const isMobile = ref(false)
const touchStartX = ref(0)
const touchEndX = ref(0)


onMounted(() => {
    const updateSize = () => {
        isMobile.value = window.innerWidth < 640
    }
    updateSize()
    window.addEventListener('resize', updateSize)
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
        if (diff > 0 && currentIndex.value < props.images.length - 1) currentIndex.value++
        else if (diff < 0 && currentIndex.value > 0) currentIndex.value--
    }
}


const count = props.images.length

const visibleImages = computed(() =>
    count > maxVisible ? props.images.slice(0, maxVisible) : props.images
)

const gridClass = computed(() => {
    switch (count) {
        case 1: return 'grid-cols-1';
        case 2: return 'grid-cols-2';
        case 3: return 'grid-cols-3';
        case 4: return 'grid-cols-2 grid-rows-2';
        default: return 'grid-cols-3 grid-rows-2';
    }
})

function cellClass(index) {
    if (count === 3 && index === 0) return 'col-span-2 row-span-2'
    if (count > 5 && index === 4) return 'relative'
    return ''
}

function showMore(index) {
    return count > 5 && index === 4
}
</script>

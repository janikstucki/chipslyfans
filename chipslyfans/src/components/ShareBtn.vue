<script setup>
import { ShareIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'

const props = defineProps({
    postLink: String
})

const isTooltipOpen = ref(false)

const toggleTooltip = () => {
  isTooltipOpen.value = !isTooltipOpen.value
}

const closeTooltip = () => {
  isTooltipOpen.value = false
}
</script>

<template>
    <div class="relative">
        <button 
            @click="toggleTooltip"
            class="flex items-center space-x-2 hover:text-blue-600"
        >
            <div class="flex items-center space-x-2">
                <ShareIcon class="h-5 w-5" />
                <span>Teilen</span>
            </div>
        </button>

        <!-- Social Media Icons Tooltip -->
        <div 
            v-show="isTooltipOpen"
            class="absolute flex flex-col items-center bottom-full mb-2 left-0 right-0 z-10"
        >
            <div class="bg-white p-3 rounded-3xl shadow-lg flex gap-3">
                <!-- Twitter/X -->
                <div class="p-2 bg-white rounded-full shadow-md">
                    <a href="#" @click="closeTooltip">
                        <svg class="h-6 w-6 fill-gray-700" viewBox="0 0 520 520">
                            <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/>
                        </svg>
                    </a>
                </div>
                
                <!-- Facebook -->
                <div class="p-2 bg-white rounded-full shadow-md">
                    <a href="#" @click="closeTooltip">
                        <svg class="h-6 w-6 fill-gray-700" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                    </a>
                </div>
                
                <!-- Instagram -->
                <div class="p-2 bg-white rounded-full shadow-md">
                    <a href="#" @click="closeTooltip">
                        <svg class="h-6 w-6 fill-gray-700" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                        </svg>
                    </a>
                </div>
            </div>
        </div>

        <!-- Click outside to close -->
        <div 
            v-if="isTooltipOpen"
            @click="closeTooltip"
            class="fixed inset-0 z-0 bg-transparent"
        ></div>
    </div>
</template>
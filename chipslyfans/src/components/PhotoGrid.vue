<!-- components/PhotoGrid.vue -->
<template>
  <div :class="['grid gap-1', gridClass]">
    <div
      v-for="(image, index) in images"
      :key="index"
      class="relative overflow-hidden h-80 sm:h-40 md:h-50"
      :class="cellClass(index)"
      @click="$emit('zoom', image.url)"
    >
      <img :src="image.url" class="w-full h-full object-cover rounded" />
      <div v-if="showMore(index)" class="absolute inset-0 bg-black/60 text-white flex items-center justify-center text-xl font-bold">
        +{{ images.length - maxVisible }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  images: Array
})
const maxVisible = 5 // optional
const count = props.images.length

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
  if (count === 3 && index === 0) return 'col-span-2 row-span-2';
  if (count > 5 && index === 4) return 'relative';
  return ''
}

function showMore(index) {
  return count > 5 && index === 4
}
</script>

<style scoped>
.aspect-\[4\/3\] {
  aspect-ratio: 4 / 3;
}
</style>

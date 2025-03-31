<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="fixed left-0 top-0 bottom-0 w-64 p-5 border-r border-gray-200 flex flex-col gap-3 bg-white">
    <RouterLink 
      to="/" 
      class="nav-item flex items-center gap-4 p-3 text-gray-800 font-medium text-base rounded-lg transition-colors hover:bg-gray-50"
      active-class="!text-sky-400 font-semibold [&>svg]:stroke-sky-400 [&>svg]:stroke-[2.5]"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-house">
        <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/>
        <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      </svg>
      Start
    </RouterLink>

    <RouterLink 
      to="/postfach" 
      class="nav-item flex items-center gap-4 p-3 text-gray-800 font-medium text-base rounded-lg transition-colors hover:bg-gray-50"
      active-class="!text-sky-400 font-semibold [&>svg]:stroke-sky-400 [&>svg]:stroke-[2.5]"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail">
        <rect width="20" height="16" x="2" y="4" rx="2"/>
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
      </svg>
      Postfach
    </RouterLink>
  </div>
</template>
<script setup>
import Navbar from './components/Navbar.vue'
</script>

<template>
  <div class="app flex min-h-screen">
    <!-- Sidebar/Navbar with content-->
    <Navbar />
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

/* Optional: Add some basic styling for better separation */
nav {
  border-right: 1px solid #e2e8f0;
  height: 100vh;
  position: sticky;
  top: 0;
}
</style>

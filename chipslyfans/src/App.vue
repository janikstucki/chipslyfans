<script setup>
import navbar from '../src/components/NavBar.vue'
</script>

<template>
  <div class="display flex app">
      <div class="w-1/4">
          <navbar />
      </div>
      <div class="w-3/4">
          <router-view />
      </div>
  </div>
</template>

<style scoped>
  .app {
    display: flex;
  }
</style>  
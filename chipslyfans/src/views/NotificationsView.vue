<template>
    <div>
      <h1 class="text-xl font-bold mb-4">Postfach</h1>
      <div class="p-6">
      <!-- Benachrichtigungsliste -->
      <div class="space-y-4">
        <div 
          v-for="benachrichtigung in benachrichtigungen"
          :key="benachrichtigung.id"
          class="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 cursor-pointer transition">
          <div class="flex items-start gap-3">
            <!-- Avatar -->
            <div class="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold">
              {{ benachrichtigung.autor.charAt(1) }}
            </div>
            

            <!-- Inhalt -->
            <div class="flex-1">
              <div class="flex items-baseline gap-2">
                <span class="font-medium text-gray-900">{{ benachrichtigung.autor }}</span>
                <span class="text-sm text-gray-500">{{ benachrichtigung.datum }}</span>
              </div>
              <p class="mt-1 text-gray-600">{{ benachrichtigung.inhalt }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { BanknotesIcon } from '@heroicons/vue/24/outline'
  
  const benachrichtigungen = ref([
    {
        iconId: 1,
      id: 1,
      autor: '@Chipsly#69420',
      datum: 'Vor 2 Stunden',
      inhalt: 'Hat dir Geld gesendet',
      art: 'payment'
    },
    {
        iconId: 3,
      id: 2,
      autor: '@Chipsly#69420',
      datum: 'Vor 1 Stunde',
      inhalt: 'Hat dein Video geliked',
      art: 'like'
    },
    {
        iconId: 2,
      id: 3,
      autor: '@Chipsly#69420',
      datum: 'Vor 30 Minuten',
      inhalt: 'Hat deinen Beitrag kommentiert',
      art: 'comment'
    }
  ]);
  </script>


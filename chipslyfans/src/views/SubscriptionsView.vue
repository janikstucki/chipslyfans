<template>
    <div>
      <h1 class=" text-xl font-bold mb-4" >Postfach</h1>
      <div class="p-6">
        <!-- Benachrichtigungsliste -->
        <div class="space-y-4">
          <div 
            v-for="benachrichtigung in benachrichtigungen"
            :key="benachrichtigung.id"
            class="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 cursor-pointer transition">
            <div class="flex gap-3 items-center">
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
  
                <!-- Icons -->
              <div className="w-8 h-8 rounded-full bg-500 flex items-center justify-center text-blackfont-bold">
                <HeartIcon v-if="benachrichtigung.art === 'like'" />
                <BanknotesIcon v-if="benachrichtigung.art === 'payment'" />
                <ChatBubbleLeftIcon v-if="benachrichtigung.art === 'comment'" />
                <ChatBubbleLeftRightIcon v-if="benachrichtigung.art === 'message'" />
                <BanknotesIcon v-if="benachrichtigung.art === 'abo'" />
                <BookmarkIcon v-if="benachrichtigung.art === 'collection'" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
    
    <script setup>
    import { ref } from 'vue';
    
  
  
    const benachrichtigungen = ref([
      {
        id: 1,
        autor: '@Chipsly#69420',
        datum: 'Vor 2 Stunden',
        inhalt: 'Hat dir Geld gesendet',
        art: 'payment'
      },
      {
        id: 2,
        autor: '@Chipsly#69420',
        datum: 'Vor 1 Stunde',
        inhalt: 'Hat dein Video geliked',
        art: 'like'
      }
    ]);
    </script>
  
  
<template>
    <div>
      <h1 class=" text-xl font-bold mb-4" >Subscriptions</h1>
      <div class="p-6">
        <!-- subscriptionslist -->
        <div class="space-y-4">
          <div 
            v-for="subscription in subscriptions"
            :key="subscription.id"
            class="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 cursor-pointer transition">
            <div class="flex gap-3 items-center">
              <!-- Avatar -->
              <div class="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold">
                {{ subscription.creator.charAt(1) }}
              </div>
              
              <!-- Inhalt -->
              <div class="flex-1">
                <div class="flex items-baseline gap-2">
                  <span class="font-medium text-gray-900">{{ subscription.creator }}</span>
                  <span class="text-sm text-gray-500">{{ 'Bis am ' + subscription.untilDate }}</span>
                </div>
              </div>
              <button
                class="flex items-center justify-center p-3 rounded-lg transition-all duration-200 bg-red-600 text-white hover:bg-red-700 overflow-hidden"
                @click="handleClick">
                Kündigen
                <MinusCircleIcon class="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
    
    <script setup>
    import { ref } from 'vue';
      import { MinusCircleIcon } from '@heroicons/vue/24/outline'
  
  
    const subscriptions = ref([
      {
        id: 1,
        creator: '@Julian#78728723',
        untilDate: '24.12.2025'
      },
      {
        id: 2,
        creator: '@Chipsly#69420',
        untilDate: '13.02.2027'
      }
    ]);

    const handleClick = () => {
  console.log('Button wurde geklickt!');
};

</script>
  
  
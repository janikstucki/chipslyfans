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
        <div class="p-6 mt-8 bg-white rounded-lg shadow relative">
          <button v-if="myAbonnement" class="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition" @click="goToDashboard" title="Dashboard">
            <img :src='dashboardIcon' alt="dashboard-icon" class="w-6 h-6" />
          </button>
          <h2 class="text-lg font-semibold mb-4">Mein Abonnement Dashboard</h2>
          
          <div v-if="myAbonnement">
            <p>Aktueller Preis: {{ myAbonnement.abonnement.cost }} CHF</p>
            <p>Ab dem nächsten Jahr: {{ myAbonnement.abonnement.futureCost || 'nicht gesetzt' }} CHF</p>
            <p>Abonnenten: {{ myAbonnement.subscriberCount }}</p>

            <div class="mt-4 flex flex-wrap gap-4">
              <div class="p-4 bg-gray-50 rounded">
                <p class="text-sm text-gray-500">Heute</p>
                <p class="text-xl font-bold">{{ myAbonnement.earnings.today }} CHF</p>
              </div>
              <div class="p-4 bg-gray-50 rounded">
                <p class="text-sm text-gray-500">Diesen Monat</p>
                <p class="text-xl font-bold">{{ myAbonnement.earnings.month }} CHF</p>
              </div>
              <div class="p-4 bg-gray-50 rounded">
                <p class="text-sm text-gray-500">Dieses Jahr</p>
                <p class="text-xl font-bold">{{ myAbonnement.earnings.year }} CHF</p>
              </div>
            </div>

            <div class="mt-6">
              <input v-model="newPrice" type="number" class="w-auto border p-2 rounded" placeholder="Neuer Preis ab nächstem Jahr" />
              <button @click="updatePrice" class="ml-2 bg-blue-600 text-white px-4 py-2 rounded">Preis ändern</button>
            </div>
          </div>

          <div v-else>
            <h3 class="text-md font-medium mb-2">Noch kein Abonnement erstellt</h3>
            <input v-model="createPrice" type="number" class=" border p-2 rounded" placeholder="Preis in CHF" />
            <textarea v-model="createDescription" class="border p-2 rounded mt-2 w-full" placeholder="Beschreibung"></textarea>
            <button @click="createAbonnement" class="mt-2 bg-green-600 text-white px-4 py-2 rounded">Abonnement erstellen</button>
          </div>
        </div>
      </div>
    </div>
  </template>
    
<script setup>
  import { ref, onMounted } from 'vue';
  import { useUserStore } from '../store/auth.js';
  import { useRouter } from 'vue-router';

  import { MinusCircleIcon } from '@heroicons/vue/24/solid';
  import dashboardIcon from '../assets/icons/dashboardIcon.png';

  const userStore = useUserStore();
  const router = useRouter();


  const subscriptions = ref([]);
  const myAbonnement = ref(null);
  const createPrice = ref('');
  const createDescription = ref('');
  const newPrice = ref();
  let userId = ref('')
  
  onMounted(async () => {
    await userStore.fetchCurrentUser();
    userId = userStore.userId;

    subscriptions.value = await getSubscriptions(userId);
    myAbonnement.value = await getAbonnement(userId);
    console.log('Subscriptions:', subscriptions.value);
  });

  async function getSubscriptions(userId) {
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/subscription/my/${userId}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
          credentials: 'include', 
        });
        if (!res.ok) {
            throw new Error('Fehler beim Laden der Subscriptions');
        }
        const data = await res.json();
        return data;
    } catch (error) {
      console.error('Fehler beim Laden der Subscriptions:', error);
    }
  }

  async function getAbonnement(userId) {
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/abonnements/${userId}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
          credentials: 'include', 
        });
        if (!res.ok) {
            throw new Error('Fehler beim Laden des Abonnements');
        }
        const data = await res.json();
        return data;
    } catch (error) {
      console.error('Fehler beim Laden des Abonnements:', error);
    }
  }

  const createAbonnement = async () => {
    console.log(newPrice.value);
    try {
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/abonnements`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                cost: createPrice.value,
                description: createDescription.value,
            }),
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || 'Fehler beim Erstellen des Abonnements');
        }
        const data = await res.json();
        console.log('Abonnement erstellt:', data);
        alert('Abonnement erfolgreich erstellt!');
        // Optional: Seite neu laden oder Dashboard-Daten neu holen
    } catch (error) {
        console.error('Fehler beim Erstellen des Abonnements:', error);
        alert(error.message);
    }
  };

  const updatePrice = async () => {
    const futureCostValue = Number(newPrice.value);
    console.log('DEBUG | Future cost to send:', futureCostValue);
      if (!newPrice.value || isNaN(newPrice.value)) {
          alert('Bitte einen gültigen Preis eingeben.');
          return;
      }

      try {
          const response = await fetch(`${import.meta.env.VITE_BASE_URL}/abonnements/${myAbonnement.value.abonnement.id}/future-cost`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ futureCost: futureCostValue }),
          });

          if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || 'Unbekannter Fehler beim Aktualisieren');
          }

          const result = await response.json();
          console.log('Backend-Antwort:', result);

          myAbonnement.value.abonnement.futureCost = result.abonnement.futureCost;
          newPrice.value = '';

          alert('Neuer Preis erfolgreich gespeichert!');
      } catch (error) {
          console.error('Fehler beim Aktualisieren des Preises:', error);
          alert(error.message || 'Fehler beim Aktualisieren des Preises');
      }
  };

function goToDashboard() {
  router.push(`/user/${userId}/dashboard`); // oder dein passender Route-Name
}
</script>

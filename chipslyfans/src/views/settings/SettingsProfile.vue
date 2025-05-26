<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/vue/24/outline';

const isLoading = ref(true);
const isEditingHead = ref(false);
const isEditingPersonal = ref(false);
const isEditingAdress = ref(false);
const fallbackImage = null;

const user = ref(null);
const editedUser = ref({});

const route = useRoute();

onMounted(async () => {
  const userid = route.params.id;
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/users/settings/${userid}/general`, {
    method: 'GET',
    credentials: 'include'
  });
  if (response.ok) {
    const data = await response.json();
    user.value = data;
    editedUser.value = { ...data }; // Kopie für Editing
    isLoading.value = false;
  } else {
    console.error('Failed to fetch user data');
  }
});

function onImageError(event) {
  event.target.src = fallbackImage;
}

const initials = computed(() => {
  const first = user.value.firstname ? user.value.firstname[0] : '';
  const last = user.value.lastname ? user.value.lastname[0] : '';
  return first + last;
});

async function saveChanges() {
  const userid = route.params.id;
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/users/settings/${userid}/general`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(editedUser.value)
    });
    if (response.ok) {
      user.value = { ...editedUser.value }; // Übernehme Änderungen
      isEditing.value = false;
      console.log('Changes saved!');
    } else {
      console.error('Failed to save changes');
    }
  } catch (error) {
    console.error('Error saving changes:', error);
  }
}

function cancelEdit() {
  editedUser.value = { ...user.value }; // Änderungen verwerfen
  isEditingHead.value = false;
}
</script>


<template>
  <div class="space-y-8">
    <h2 class="text-2xl font-semibold mb-6">My Profile</h2>


    <div v-if="isLoading" class="flex justify-center items-center py-10">
      <div class="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
    </div>
    <div v-else>
      <!-- Profilkopf -->
      <div class="bg-white shadow rounded-lg p-6 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-full bg-indigo-500 flex items-center justify-center text-white text-lg font-bold uppercase">
            <template v-if="user.profilepicture">
              <img class="w-16 h-16 rounded-full object-cover" :src="user.profilepicture" alt="Avatar" @error="onImageError" />
            </template>
            <template v-else>
              {{ initials }}
            </template>
          </div>
          <div>
            <h3 class="text-lg font-bold">
              <template v-if="isEditingHead">
                <input v-model="editedUser.firstname" class="border rounded px-2 py-1" />
                <input v-model="editedUser.lastname" class="border rounded px-2 py-1 ml-2" />
              </template>
              <template v-else>
                {{ user.firstname }} {{ user.lastname }}
              </template>
            </h3>
            <p class="text-gray-500">@{{ user.username }}</p>
          </div>
        </div>
        <div class="flex gap-2">
          <button v-if="!isEditing" @click="isEditingHead = true" class="text-blue-600 font-medium hover:underline flex items-center gap-1">
            Edit <PencilIcon class="w-4 h-4" />
          </button>
          <template v-else>
            <button @click="saveChanges" class="text-green-600 font-medium hover:underline flex items-center gap-1">
              Save <CheckIcon class="w-4 h-4" />
            </button>
            <button @click="cancelEdit" class="text-red-600 font-medium hover:underline flex items-center gap-1">
              Cancel <XMarkIcon class="w-4 h-4" />
            </button>
          </template>
        </div>
      </div>

      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">Personal Information</h3>
          <div class="flex gap-2">
            <button v-if="!isEditing" @click="isEditing = true" class="text-blue-600 font-medium hover:underline flex items-center gap-1">
              Edit <PencilIcon class="w-4 h-4" />
            </button>
            <template v-else>
              <button @click="saveChanges" class="text-green-600 font-medium hover:underline flex items-center gap-1">
                Save ✔
              </button>
              <button @click="cancelEdit" class="text-red-600 font-medium hover:underline flex items-center gap-1">
                Cancel ✖
              </button>
            </template>
          </div>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label class="text-sm text-gray-500">Username</label>
            <template v-if="!isEditing">
              <p class="text-gray-900">{{ user.username }}</p>
            </template>
            <template v-else>
              <input v-model="editedUser.username" class="border rounded px-2 py-1 w-full" />
            </template>
          </div>

          <div>
            <label class="text-sm text-gray-500">First Name</label>
            <template v-if="!isEditing">
              <p class="text-gray-900">{{ user.firstname }}</p>
            </template>
            <template v-else>
              <input v-model="editedUser.firstname" class="border rounded px-2 py-1 w-full" />
            </template>
          </div>

          <div>
            <label class="text-sm text-gray-500">Last Name</label>
            <template v-if="!isEditing">
              <p class="text-gray-900">{{ user.lastname }}</p>
            </template>
            <template v-else>
              <input v-model="editedUser.lastname" class="border rounded px-2 py-1 w-full" />
            </template>
          </div>

          <div>
            <label class="text-sm text-gray-500">Email</label>
            <template v-if="!isEditing">
              <p class="text-gray-900">{{ user.email }}</p>
            </template>
            <template v-else>
              <input v-model="editedUser.email" type="email" class="border rounded px-2 py-1 w-full" />
            </template>
          </div>

          <div>
            <label class="text-sm text-gray-500">Birthdate</label>
            <template v-if="!isEditing">
              <p class="text-gray-900">{{ user.birthdate }}</p>
            </template>
            <template v-else>
              <input v-model="editedUser.birthdate" type="date" class="border rounded px-2 py-1 w-full" />
            </template>
          </div>
        </div>
      </div>

      <!-- Adresse -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">Address</h3>
          <button class="text-blue-600 font-medium hover:underline flex items-center gap-1">
            Edit
            <PencilIcon class="w-4 h-4" />
          </button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label class="text-sm text-gray-500">Country</label>
            <p v-if="user.country" class="text-gray-900">{{ user.country }}</p>
            <p v-else class="text-gray-900">Not specified</p>
          </div>
          <div>
            <label class="text-sm text-gray-500">City/State</label>
            <p v-if="user.city_state" class="text-gray-900">{{ user.city_state }}</p>
            <p v-else class="text-gray-900">Not specified</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

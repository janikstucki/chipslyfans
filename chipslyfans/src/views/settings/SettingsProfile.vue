<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/vue/24/outline';

const isLoading = ref(true);
const isEditingHead = ref(false);
const isEditingPersonal = ref(false);
const isEditingAddress = ref(false);
const isSavingHead = ref(false);
const isSavingPersonal = ref(false);
const isSavingAddress = ref(false);
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

async function saveChanges(section) {
  const userid = route.params.id;

  const payload = {};
  for (const key in editedUser.value) {
    if (editedUser.value[key] !== user.value[key]) {
      payload[key] = editedUser.value[key];
    }
  }

  if (Object.keys(payload).length === 0) {
    console.log('No changes to save');
    if (section === 'head') isEditingHead.value = false;
    if (section === 'personal') isEditingPersonal.value = false;
    if (section === 'address') isEditingAddress.value = false;
    return;
  }

  // Set saving state
  if (section === 'head') isSavingHead.value = true;
  if (section === 'personal') isSavingPersonal.value = true;
  if (section === 'address') isSavingAddress.value = true;

  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/users/settings/${userid}/general`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    });
    if (response.ok) {
      const updated = await response.json();
      user.value = updated.user; 
      editedUser.value = { ...updated.user };
      if (section === 'head') isEditingHead.value = false;
      if (section === 'personal') isEditingPersonal.value = false;
      if (section === 'address') isEditingAddress.value = false;
      console.log('Changes saved!');
    } else {
      console.error('Failed to save changes');
    }
  } catch (error) {
    console.error('Error saving changes:', error);
  } finally {
    // Always reset saving state
    if (section === 'head') isSavingHead.value = false;
    if (section === 'personal') isSavingPersonal.value = false;
    if (section === 'address') isSavingAddress.value = false;
  }
}

function cancelEdit(section) {
  editedUser.value = { ...user.value };
  if (section === 'head') isEditingHead.value = false;
  if (section === 'personal') isEditingPersonal.value = false;
  if (section === 'address') isEditingAddress.value = false;
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
          <button v-if="!isEditingHead" @click="isEditingHead = true" class="text-blue-600 font-medium hover:underline flex items-center gap-1">
            Edit <PencilIcon class="w-4 h-4" />
          </button>
          <template v-else>
            <button @click="saveChanges('head')" class="text-green-600 font-medium hover:underline flex items-center gap-1">
              Save <CheckIcon class="w-4 h-4" />
            </button>
            <button @click="cancelEdit('head')" class="text-red-600 font-medium hover:underline flex items-center gap-1">
              Cancel <XMarkIcon class="w-4 h-4" />
            </button>
          </template>
        </div>
      </div>


      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">Personal Information</h3>
          <div class="flex gap-2">
            <button v-if="!isEditingPersonal" @click="isEditingPersonal = true" class="text-blue-600 font-medium hover:underline flex items-center gap-1">
              Edit <PencilIcon class="w-4 h-4" />
            </button>
            <template v-else>
              <button @click="saveChanges('personal')" class="text-green-600 font-medium hover:underline flex items-center gap-1">
                Save <CheckIcon class="w-4 h-4" />
              </button>
              <button @click="cancelEdit('personal')" class="text-red-600 font-medium hover:underline flex items-center gap-1">
                Cancel <XMarkIcon class="w-4 h-4" />
              </button>
            </template>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label class="text-sm text-gray-500">Username</label>
            <template v-if="!isEditingPersonal">
              <p class="text-gray-900">{{ user.username }}</p>
            </template>
            <template v-else>
              <input v-model="editedUser.username" class="border rounded px-2 py-1 w-full" />
            </template>
          </div>

          <div>
            <label class="text-sm text-gray-500">Email</label>
            <template v-if="!isEditingPersonal">
              <p class="text-gray-900">{{ user.email }}</p>
            </template>
            <template v-else>
              <input v-model="editedUser.email" type="email" class="border rounded px-2 py-1 w-full" />
            </template>
          </div>

          <div>
            <label class="text-sm text-gray-500">Birthdate</label>
            <template v-if="!isEditingPersonal">
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
          <div class="flex gap-2">
            <button v-if="!isEditingAddress" @click="isEditingAddress = true" class="text-blue-600 font-medium hover:underline flex items-center gap-1">
              Edit <PencilIcon class="w-4 h-4" />
            </button>
            <template v-else>
              <button @click="saveChanges('address')" class="text-green-600 font-medium hover:underline flex items-center gap-1">
                Save <CheckIcon class="w-4 h-4" />
              </button>
              <button @click="cancelEdit('address')" class="text-red-600 font-medium hover:underline flex items-center gap-1">
                Cancel <XMarkIcon class="w-4 h-4" />
              </button>
            </template>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label class="text-sm text-gray-500">Country</label>
            <template v-if="!isEditingAddress">
              <p class="text-gray-900">{{ user.country }}</p>
            </template>
            <template v-else>
              <input v-model="editedUser.country" class="border rounded px-2 py-1 w-full" />
            </template>
          </div>

          <div>
            <label class="text-sm text-gray-500">City/State</label>
            <template v-if="!isEditingAddress">
              <p class="text-gray-900">{{ user.city_state }}</p>
            </template>
            <template v-else>
              <input v-model="editedUser.city_state" class="border rounded px-2 py-1 w-full" />
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

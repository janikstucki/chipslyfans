<script setup>
import { PencilIcon } from '@heroicons/vue/24/outline';
const user = {
    profilepicture: 'https://randomuser.me/api/portraits/men/75.jpg',
    username: 'rafiqurrahman',
    email: 'rafiqurrahman51@gmail.com',
    firstname: 'Rafiqur',
    lastname: 'Rahman',
    birthdate: '1995-06-15',
    interest: ['coding', 'design', 'coffee'],
    country: 'United Kingdom',
    city: 'Leeds, East London',
};
</script>

<template>
  <div class="space-y-8">
    <h2 class="text-2xl font-semibold mb-6">My Profile</h2>

    <!-- Profilkopf -->
    <div class="bg-white shadow rounded-lg p-6 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <img class="w-16 h-16 rounded-full object-cover" :src="user.profilepicture" alt="Avatar" />
        <div>
          <h3 class="text-lg font-bold">{{ user.firstname }} {{ user.lastname }}</h3>
          <p class="text-gray-500">@{{ user.username }}</p>
        </div>
      </div>
      <button class="text-blue-600 font-medium hover:underline flex items-center gap-1">
        Edit
        <PencilIcon class="w-4 h-4" />
      </button>
    </div>

    <!-- Persönliche Infos -->
    <div class="bg-white shadow rounded-lg p-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">Personal Information</h3>
        <button class="text-blue-600 font-medium hover:underline flex items-center gap-1">
          Edit
          <PencilIcon class="w-4 h-4" />
        </button>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label class="text-sm text-gray-500">Username</label>
          <p class="text-gray-900">{{ user.username }}</p>
        </div>
        <div>
          <label class="text-sm text-gray-500">First Name</label>
          <p class="text-gray-900">{{ user.firstname }}</p>
        </div>
        <div>
          <label class="text-sm text-gray-500">Last Name</label>
          <p class="text-gray-900">{{ user.lastname }}</p>
        </div>
        <div>
          <label class="text-sm text-gray-500">Email</label>
          <p class="text-gray-900">{{ user.email }}</p>
        </div>
        <div>
          <label class="text-sm text-gray-500">Birthdate</label>
          <p class="text-gray-900">{{ user.birthdate }}</p>
        </div>
        <div class="sm:col-span-2">
          <label class="text-sm text-gray-500">Interests</label>
          <p class="text-gray-900">
            <span
              v-for="(item, index) in user.interest"
              :key="index"
              class="inline-block bg-gray-100 text-sm px-2 py-1 rounded-full mr-2"
            >
              {{ item }}
            </span>
          </p>
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
          <p class="text-gray-900">{{ user.country }}</p>
        </div>
        <div>
          <label class="text-sm text-gray-500">City/State</label>
          <p class="text-gray-900">{{ user.city }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { PencilIcon } from '@heroicons/vue/24/outline';
const active = ref('My Profile');
const menu = [
    { label: 'My Profile' },
    { label: 'Security' },
    { label: 'Teams' },
    { label: 'Team Member' },
    { label: 'Notifications' },
    { label: 'Billing' },
    { label: 'Data Export' },
    { label: 'Delete Account' },
];

const user = {
    avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
    firstName: 'Rafiqur',
    lastName: 'Rahman',
    email: 'rafiqurrahman51@gmail.com',
    phone: '+09 345 346 46',
    bio: 'Team Manager',
    location: 'Leeds, United Kingdom',
    country: 'United Kingdom',
    city: 'Leeds, East London',
};
</script>
<template>
    <div class="flex max-w-7xl mx-auto py-10 px-6">
        <!-- Sidebar -->
        <aside class="w-64 space-y-4 pr-8 border-r">
            <div v-for="item in menu" :key="item.label">
                <button
                class="w-full text-left px-4 py-2 rounded-md transition font-medium"
                :class="item.label === active ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-50'"
                @click="active = item.label">
                {{ item.label }}
                </button>
            </div>
        </aside>
        
        <!-- Content -->
        <section class="flex-1 space-y-8">
            <!-- My Profile -->
            <div v-if="active === 'My Profile'">
                <h2 class="text-2xl font-semibold mb-6">My Profile</h2>
                <div class="bg-white shadow rounded-lg p-6 flex items-center justify-between">
                    <div class="flex items-center gap-4">
                        <img class="w-16 h-16 rounded-full object-cover" :src="user.avatar" alt="Avatar" />
                        <div>
                            <h3 class="text-lg font-bold">{{ user.firstName }} {{ user.lastName }}</h3>
                            <p class="text-gray-500">{{ user.bio }}</p>
                            <p class="text-sm text-gray-400">{{ user.location }}</p>
                        </div>
                    </div>
                    <button class="text-blue-600 font-medium hover:underline flex items-center gap-1">
                        Edit
                        <PencilIcon class="w-4 h-4" />
                    </button>
                </div>
                
                <!-- Personal Info -->
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
                        <label class="text-sm text-gray-500">First Name</label>
                        <p class="text-gray-900">{{ user.firstName }}</p>
                    </div>
                    <div>
                        <label class="text-sm text-gray-500">Last Name</label>
                        <p class="text-gray-900">{{ user.lastName }}</p>
                    </div>
                    <div>
                        <label class="text-sm text-gray-500">Email address</label>
                        <p class="text-gray-900">{{ user.email }}</p>
                    </div>
                    <div>
                        <label class="text-sm text-gray-500">Phone</label>
                        <p class="text-gray-900">{{ user.phone }}</p>
                    </div>
                    <div class="sm:col-span-2">
                        <label class="text-sm text-gray-500">Bio</label>
                        <p class="text-gray-900">{{ user.bio }}</p>
                    </div>
                    </div>
                </div>
            
                <!-- Address -->
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

            <!-- Placeholder für andere Seiten -->
            <div v-else>
                <h2 class="text-2xl font-semibold">{{ active }}</h2>
                <p class="text-gray-500 mt-4">Inhalt für "{{ active }}" kommt bald ...</p>
            </div>
        </section>
    </div>
</template>

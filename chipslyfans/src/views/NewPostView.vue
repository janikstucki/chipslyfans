<script setup>
import { ref } from 'vue'
import { PlusIcon, TrashIcon, ArrowLeftIcon, PhotoIcon, TagIcon, CalendarIcon, BellIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { useI18n } from 'vue-i18n';

const { t } = useI18n()


const currentStep = ref(2)
const showConfirmation = ref(false)
const form = ref({
    title: '',
    content: '',
    images: [],
    taggedPeople: [],
    visibility: 'subscription',
    tags: [],
    scheduleDate: null,
    sendNotification: true
})

const newTag = ref('')
const newPersonTag = ref('')

// Bild-Upload Handlung
const handleImageUpload = (e) => {
    const files = e.target.files
    for (let i = 0; i < files.length; i++) {
        const reader = new FileReader()
            reader.onload = (e) => {
            form.value.images.push(e.target.result)
        }
        reader.readAsDataURL(files[i])
    }
}

// Tag Hinzufügen
const addTag = () => {
    if (newTag.value.trim()) {
        form.value.tags.push(newTag.value.trim())
        newTag.value = ''
    }
}

// Person Tag Hinzufügen
const addPersonTag = () => {
    if (newPersonTag.value.trim()) {
        form.value.taggedPeople.push(newPersonTag.value.trim())
        newPersonTag.value = ''
    }
}

// Bild Entfernen
const removeImage = (index) => {
    form.value.images.splice(index, 1)
}

// Formular Einreichen
const submitForm = () => {
    console.log('Formular eingereicht:', form.value)
    // Hier API-Anbindung einfügen
}

const confirmSubmission = () => {
    showConfirmation.value = false
    submitForm()
}

</script>

<template>
    <div class="min-h-screen bg-gray-50 p-8">
        <div v-if="showConfirmation" class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div class="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-bold">{{ $t('newpost.confirmation_box.title') }}?</h3>
                    <button @click="showConfirmation = false" class="text-gray-500 hover:text-gray-700">
                        <XMarkIcon class="h-6 w-6" />
                    </button>
                </div>
                    <p class="text-gray-600 mb-6">
                        {{ $t('newpost.confirmation_box.question') }}?
                    </p>
                <div class="flex justify-end gap-3">
                    <button 
                        @click="showConfirmation = false"
                        class="px-4 py-2 text-gray-600 hover:text-gray-800 rounded-lg"
                    >
                        {{ $t('newpost.confirmation_box.cancel') }}
                    </button>
                    <button 
                        @click="confirmSubmission"
                        class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        {{ $t('newpost.confirmation_box.submit') }}
                    </button>
                </div>
            </div>
        </div>

        <div class="max-w-3xl mx-auto bg-neutral-100 rounded-2xl shadow-lg p-6">
        <!-- Progress Indicator -->
        <div class="flex mb-8">
            <div class="flex-1 h-2 bg-gray-200 rounded-full">
                <div :class="`h-full ${currentStep === 1 ? 'w-1/2' : 'w-full'} bg-indigo-600 rounded-full transition-all duration-300`"></div>
            </div>
        </div>

        <!-- Step 1: Post Inhalt -->
        <div v-if="currentStep === 1">
            <h2 class="text-2xl font-bold text-gray-800 mb-6">{{ $t('newpost.form.page1.title') }}</h2>
            
            <!-- Titel -->
            <div class="mb-6">
                <label class="block text-gray-700 mb-2">{{ $t('newpost.form.page1.lbl.title') }}</label>
                <input 
                    v-model="form.title"
                    type="text" 
                    class="w-full px-4 py-3 bg-gray-100 border border-gray-400 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    :placeholder="$t('newpost.form.page1.placeholder.title')">
            </div>

            <!-- Inhalt -->
            <div class="mb-6">
                <label class="block text-gray-700 mb-2">{{ $t('newpost.form.page1.lbl.content') }}</label>
                <textarea 
                    v-model="form.content"
                    rows="4"
                    class="w-full min-h-20 px-4 py-3 bg-gray-100 border border-gray-400 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    :placeholder="$t('newpost.form.page1.placeholder.content')"></textarea>
            </div>

            <!-- Bild Upload -->
            <div class="mb-6">
            <label class="block text-gray-700 mb-2">{{ $t('newpost.form.page1.lbl.picture') }}</label>
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input 
                type="file" 
                multiple 
                @change="handleImageUpload"
                class="hidden" 
                id="fileUpload">
                <label 
                for="fileUpload" 
                class="cursor-pointer inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                <PhotoIcon class="h-5 w-5 mr-2"/>
                {{ $t('newpost.form.page1.btn.select_pic') }}
                </label>
                <p class="text-gray-500 mt-2">{{ $t('newpost.form.page1.placeholder.picture') }}</p>
            </div>
            
            <!-- Bild Vorschau -->
            <div class="grid grid-cols-3 gap-4 mt-4">
                <div 
                v-for="(image, index) in form.images"
                :key="index"
                class="relative group">
                <img :src="image" class="h-32 w-full object-cover rounded-lg">
                <button 
                    @click="removeImage(index)"
                    class="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition">
                    <TrashIcon class="h-4 w-4"/>
                </button>
                </div>
            </div>
            </div>

            <!-- Personen Tags -->
            <div class="mb-6">
            <label class="block text-gray-700 mb-2">{{ $t('newpost.form.page1.lbl.tag_pers') }}</label>
            <div class="flex gap-2 flex-wrap">
                <div 
                v-for="(person, index) in form.taggedPeople"
                :key="index"
                class="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full flex items-center">
                @{{ person }}
                <button 
                    @click="form.taggedPeople.splice(index, 1)"
                    class="ml-2 text-indigo-500 hover:text-indigo-700">
                    <TrashIcon class="h-4 w-4"/>
                </button>
                </div>
                <div class="flex">
                <input 
                    v-model="newPersonTag"
                    @keyup.enter="addPersonTag"
                    type="text" 
                    class="w-full px-4 py-3 bg-gray-100 border border-gray-400 rounded-l-lg text-black focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    :placeholder="$t('newpost.form.page1.placeholder.tag_pers')">
                <button 
                    @click="addPersonTag"
                    class="px-3 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700">
                    <PlusIcon class="h-5 w-5"/>
                </button>
                </div>
            </div>
            </div>
        </div>

        <!-- Step 2: Einstellungen -->
        <div v-if="currentStep === 2">
            <h2 class="text-2xl font-bold text-gray-800 mb-6">{{ $t('newpost.form.page2.title') }}</h2>

            <!-- Sichtbarkeit -->
            <div class="mb-6">
            <label class="block text-gray-700 mb-2">{{ $t('newpost.form.page2.lbl.visibility') }}</label>
            <div class="flex items-center gap-4">
                <button 
                    @click="form.visibility = 'public'"
                    :class="`px-6 py-2 rounded-full ${form.visibility === 'public' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`">
                    {{ $t('newpost.form.page2.btn.vis_public') }}
                </button>
                <button 
                    @click="form.visibility = 'subscription'"
                    :class="`px-6 py-2 rounded-full ${form.visibility === 'subscription' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`">
                    {{ $t('newpost.form.page2.btn.vis_subonly') }}
                </button>
            </div>
            </div>

            <!-- Tags -->
            <div class="mb-6">
            <label class="block text-gray-700 mb-2">{{ $t('newpost.form.page2.lbl.algo_tag') }}</label>
            <div class="flex gap-2 flex-wrap">
                <div 
                v-for="(tag, index) in form.tags"
                :key="index"
                class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center">
                    #{{ tag }}
                <button 
                    @click="form.tags.splice(index, 1)"
                    class="ml-2 text-blue-500 hover:text-blue-700">
                    <TrashIcon class="h-4 w-4"/>
                </button>
                </div>
                <div class="flex">
                <input 
                    v-model="newTag"
                    @keyup.enter="addTag"
                    type="text" 
                    class="p-2 border rounded-l-lg"
                    :placeholder="$t('newpost.form.page2.placeholder.algo_tag')">
                <button 
                    @click="addTag"
                    class="px-3 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700">
                    <PlusIcon class="h-5 w-5"/>
                </button>
                </div>
            </div>
            </div>

            <!-- Zeitplan -->
            <div class="mb-6">
            <label class="block text-gray-700 mb-2">{{ $t('newpost.form.page2.lbl.pbl_date') }}</label>
            <div class="flex items-center gap-2">
                <CalendarIcon class="h-5 w-5 text-gray-500"/>
                <input 
                v-model="form.scheduleDate"
                type="datetime-local" 
                class="p-2 border rounded-lg">
            </div>
            </div>

            <!-- Benachrichtigung -->
            <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-2">
                <BellIcon class="h-5 w-5 text-gray-500"/>
                <span>{{ $t('newpost.form.page2.lbl.notf_sub') }}</span>
            </div>
            <button 
                @click="form.sendNotification = !form.sendNotification"
                :class="`w-12 h-6 rounded-full p-1 ${form.sendNotification ? 'bg-indigo-600' : 'bg-gray-300'}`">
                <div :class="`h-4 w-4 bg-white rounded-full shadow-md transform transition ${form.sendNotification ? 'translate-x-6' : ''}`"></div>
            </button>
            </div>
        </div>

        <!-- Navigation -->
            <div class="flex justify-between mt-8">
                    <button 
                        v-if="currentStep === 2"
                        @click="currentStep--"
                        class="flex items-center px-6 py-2 text-gray-600 hover:text-gray-800">
                        <ArrowLeftIcon class="h-5 w-5 mr-2"/>
                        {{ $t('newpost.form.navigation.back') }}
                    </button>
                <div v-else></div>
                
                <button 
                    v-if="currentStep === 1"
                    @click="currentStep++"
                    class="w-1/4 bg-gradient-to-l from-blue-700 to-indigo-400 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-300 transform transition-all duration-300 ease-in-out mb-1 hover:scale-[1.02]">
                    {{ $t('newpost.form.navigation.next') }}
                </button>
                
                <button 
                    v-if="currentStep === 2"
                    @click="showConfirmation = true"
                    class="w-1/4 bg-gradient-to-l from-blue-700 to-indigo-400 text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity mb-1">
                    {{ $t('newpost.form.navigation.pblsh_post') }}
                </button>
            </div>
        </div>
    </div>
</template>
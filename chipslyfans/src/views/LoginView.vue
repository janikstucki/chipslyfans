<template>
    <div class="min-h-screen  flex items-center justify-center p-4">
        <!-- Large Version -->
        <div v-if="!loading" class="hidden md:block w-full max-w-7xl">
            <div class="bg-black bg-opacity-70 rounded-xl shadow-2xl overflow-hidden">
                <div class="grid grid-cols-2">
                    <!-- Left Side - Branding -->
                    <div class="bg-gradient-to-br from-blue-700 to-indigo-400 p-3">
                        <button 
                            @click="router.push('/')"
                            class="bg-white rounded-full p-1 shadow-md border border-gray-200 hover:bg-gray-100 z-10"
                            >
                            <ArrowUturnLeftIcon  class="h-4 w-4 text-gray-600" />
                        </button>
                        <div class="p-10 flex flex-col justify-between">
                            <div>
                                <h1 class="text-4xl font-bold text-white mb-2">ChipslyFans</h1>
                                <p class="text-pink-100">{{ $t('login.panel.sub_title') }}</p>
                            </div>
                            <div class="text-white">
                                <p class="text-sm opacity-80">"{{ $t('login.panel.login_message') }}"</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Right Side - Form -->
                    <div class="p-10 bg-neutral-100">
                        <h2 v-if="isLogin" class="text-2xl font-bold text-black mb-1">{{ $t('login.form.sign_in.title') }}</h2>
                        <h2 v-if="!isLogin" class="text-2xl font-bold text-black mb-1">{{ $t('login.form.sign_up.title') }}</h2>
                        <p v-if="isLogin" class="text-gray-700 mb-6">{{ $t('login.form.sign_in.description') }}
                            <a href="#" class="text-indigo-600 hover:underline" @click.prevent="toggleForm()">{{ isLogin ? $t('login.form.sign_in.sign_up') : $t('login.form.sign_up.sign_in') }}</a>
                        </p>
                        <p v-if="!isLogin" class="text-gray-700 mb-6">{{ $t('login.form.sign_up.description') }}
                            <a href="#" class="text-indigo-600 hover:underline" @click.prevent="toggleForm()">{{ isLogin ? $t('login.form.sign_in.sign_up') : $t('login.form.sign_up.sign_in') }}</a>
                        </p>
                        
                        <form @submit.prevent="submitForm">
                            <div class="mb-4">
                                <label class="block text-gray-600 text-sm mb-2">Email</label>
                                <input 
                                    type="text" 
                                    v-model="email"
                                    :placeholder="$t('login.form.placeholder.email_start') + '@' + $t('login.form.placeholder.email_domain')"
                                    class="w-full px-4 py-3 bg-gray-200 border border-gray-400 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                    :class="{'border-red-500': emailError}"
                                >
                                <label class="text-red-500" v-if="emailError" for="emailerror">{{ emailErrorMsg }}</label>
                            </div>
                            
                            <div class="mb-4">
                                <label class="block text-gray-600 text-sm mb-2">{{ $t('login.form.label.password') }}</label>
                                <input 
                                    type="password" 
                                    v-model="password01"
                                    placeholder="••••••••" 
                                    class="w-full px-4 py-3 bg-gray-200 border border-gray-400 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                    :class="{'border-red-500': passwordError}"
                                >
                                <label class="text-red-500" v-if="passwordError" for="passwordError">{{ passwordErrorMsg }}</label>
                            </div>

                            <div class="mb-4" v-if="!isLogin">
                                <label class="block text-gray-600 text-sm mb-2">{{ $t('login.form.label.confirm_password') }}</label>
                                <input 
                                    type="text" 
                                    v-model="password02"
                                    placeholder="••••••••" 
                                    class="w-full px-4 py-3 bg-gray-200 border border-gray-400 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                    :class="{'border-red-500': confirmPasswordError}"
                                >
                                <label class="text-red-500" v-if="confirmPasswordError" for="passwordError">{{ confirmPasswordErrorMsg }}</label>
                            </div>

                            
                            <div class="mb-4" v-if="!isLogin">
                                <label class="block text-gray-600 text-sm mb-2">{{ $t('login.form.label.username') }}</label>
                                <input 
                                    type="text" 
                                    v-model="username"
                                    :placeholder="$t('login.form.placeholder.username')"  
                                    class="w-full px-4 py-3 bg-gray-200 border border-gray-400 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                    :class="{'border-red-500': usernameError}"
                                >
                                <label class="text-red-500" v-if="usernameError">{{ usernameErrorMsg }}</label>
                            </div>


                            <div class="flex gap-4">
                                <div class="mb-4 w-2/5" v-if="!isLogin">
                                    <label class="block text-gray-600 text-sm mb-2">{{ $t('login.form.label.firstname') }}</label>
                                    <input 
                                        type="text" 
                                        v-model="firstname"
                                        :placeholder="$t('login.form.placeholder.firstname')"
                                        class="w-full px-4 py-3 bg-gray-200 border border-gray-400 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                        :class="{'border-red-500': firstnameError}"
                                    >
                                    <label class="text-red-500" v-if="firstnameError" for="passwordError">{{ firstnameErrorMsg }}</label>
                                </div>


                                <div class="mb-4 w-3/5" v-if="!isLogin">
                                    <label class="block text-gray-600 text-sm mb-2">{{ $t('login.form.label.lastname') }}</label>
                                    <input 
                                        type="text" 
                                        v-model="lastname"
                                        :placeholder="$t('login.form.placeholder.lastname')" 
                                        class="w-full px-4 py-3 bg-gray-200 border border-gray-400 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                        :class="{'border-red-500': lastnameError}"
                                    >
                                    <label class="text-red-500" v-if="lastnameError" for="passwordError">{{ lastnameErrorMsg }}</label>
                                </div>
                            </div>


                            <div class="mb-7" v-if="!isLogin">
                                <label class="block text-gray-600 text-sm mb-2">{{ $t('login.form.label.birthdate') }}</label>
                                <div class="relative">
                                    <input
                                        type="text"
                                        class="w-full px-4 py-3 bg-gray-200 border border-gray-400 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                        :placeholder="$t('login.form.placeholder.birthdate')"
                                        ref="datepicker"
                                        v-model="birthdate"
                                        :class="{'border-red-500': birthdateError}"
                                    />
                                    <label class="text-red-500" v-if="birthdateError" for="passwordError">{{ birthdateErrorMsg }}</label>
                                </div>
                            </div>
                            
                            <div class="flex items-center justify-between mb-6">
                                <div class="flex items-center space-x-3">
                                    <label class="group flex items-center cursor-pointer">
                                        <input class="hidden peer" type="checkbox" />
                                        <span class="relative w-4 h-4 flex justify-center items-center bg-gray-200 border-1 border-gray-200 rounded-md shadow-md transition-all duration-500 peer-checked:border-indigo-500 peer-checked:bg-indigo-500 peer-hover:scale-105">
                                        <span
                                            class="absolute inset-0 bg-gradient-to-br from-gray-500 to-gray-200 opacity-0 peer-checked:opacity-100 rounded-md transition-all duration-500 peer-checked:animate-pulse"></span>
                                            <svg
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                class="hidden w-3 h-3 text-white peer-checked:block transition-transform duration-500 transform scale-50 peer-checked:scale-100"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                clip-rule="evenodd"
                                                d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                                                fill-rule="evenodd"
                                                ></path>
                                            </svg>
                                        </span>
                                        <span
                                        class="ml-2 text-gray-500 group-hover:text-indigo-500 transition-colors duration-300">
                                            {{ $t('login.form.label.remember_me') }}
                                        </span>
                                    </label>
                                </div>
                            <a href="#" class="text-sm text-indigo-500 hover:underline">{{ $t('login.form.label.forgot_password') }}</a>
                            </div>
                            
                            <button 
                                type="submit" 
                                class="w-full bg-gradient-to-l from-blue-700 to-indigo-400 text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity mb-1"
                                >
                                {{ isLogin ? $t('login.form.sign_in.submit_btn') : $t('login.form.sign_up.submit_btn') }}
                            </button>
                            <label class="text-red-500 mb-5" v-if="loginError" for="emailerror">{{ loginErrorMsg }}</label>
                            
                            <div class="text-center text-gray-400 text-sm mb-4">{{ $t('login.form.label.or_cnt_wth') }}</div>
                            
                            <div class="grid grid-cols-2 gap-3">
                                <button 
                                    type="button" 
                                    class="flex items-center justify-center bg-gray-800 text-white py-2 px-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"
                                >
                                    <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.784-1.667-4.166-2.685-6.735-2.685-5.522 0-10 4.477-10 10s4.478 10 10 10c8.396 0 10-7.496 10-10 0-0.67-0.069-1.325-0.189-1.955h-9.811z"/>
                                    </svg>
                                    Google
                                </button>
                                <button 
                                    type="button" 
                                    class="flex items-center justify-center bg-gray-800 text-white py-2 px-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"
                                >
                                    <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53-1.71-2.48-2.96-7.02-1.24-10.08 1.72-3.06 4.57-4.05 7.38-4.05 1.53 0 2.99.62 4.03 1.63 1.01.99 1.69 2.39 1.51 3.96h-4.54c-.01 1.1.75 2.14 1.78 2.15 1.03.01 2.65-1.01 3.47-2.99 0 0 1.72-.66 1.72 2.4.01 3.07-2.23 6.59-5.15 6.59z"/>
                                    </svg>
                                    Apple
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Small Version -->
        <div class="md:hidden w-full max-w-4xl">
            <div class="bg-black bg-opacity-70 rounded-xl shadow-2xl overflow-hidden">
                    <!-- Right Side - Form -->
                    <div class="p-10 bg-neutral-100">
                    <h2 v-if="isLogin" class="text-2xl font-bold text-black mb-1">{{ $t('login.form.sign_in.title') }}</h2>
                    <h2 v-if="!isLogin" class="text-2xl font-bold text-black mb-1">{{ $t('login.form.sign_up.title') }}</h2>
                    <p v-if="isLogin" class="text-gray-700 mb-6">{{ $t('login.form.sign_in.description') }}
                        <a href="#" class="text-indigo-600 hover:underline" @click.prevent="toggleForm">{{ isLogin ? $t('login.form.sign_in.sign_up') : $t('login.form.sign_up.sign_in') }}</a>
                    </p>
                    <p v-if="!isLogin" class="text-gray-700 mb-6">{{ $t('login.form.sign_up.description') }}
                        <a href="#" class="text-indigo-600 hover:underline" @click.prevent="toggleForm">{{ isLogin ? $t('login.form.sign_in.sign_up') : $t('login.form.sign_up.sign_in') }}</a>
                    </p>
                    
                    <form @submit.prevent="submitForm">
                        <div class="mb-4">
                                <label class="block text-gray-600 text-sm mb-2">Email</label>
                                <input 
                                    type="text" 
                                    v-model="email"
                                    :placeholder="$t('login.form.placeholder.email_start') + '@' + $t('login.form.placeholder.email_domain')"
                                    class="w-full px-4 py-3 bg-gray-200 border border-gray-400 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                    :class="{'border-red-500': emailError}"
                                >
                                <label class="text-red-500" v-if="emailError" for="emailerror">{{ emailErrorMsg }}</label>
                            </div>
                            
                            <div class="mb-4">
                                <label class="block text-gray-600 text-sm mb-2">{{ $t('login.form.label.password') }}</label>
                                <input 
                                    type="password" 
                                    v-model="password01"
                                    placeholder="••••••••" 
                                    class="w-full px-4 py-3 bg-gray-200 border border-gray-400 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                    :class="{'border-red-500': passwordError}"
                                >
                                <label class="text-red-500" v-if="passwordError" for="passwordError">{{ passwordErrorMsg }}</label>
                            </div>

                            <div class="mb-4" v-if="!isLogin">
                                <label class="block text-gray-600 text-sm mb-2">{{ $t('login.form.label.confirm_password') }}</label>
                                <input 
                                    type="text" 
                                    v-model="password02"
                                    placeholder="••••••••" 
                                    class="w-full px-4 py-3 bg-gray-200 border border-gray-400 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                    :class="{'border-red-500': confirmPasswordError}"
                                >
                                <label class="text-red-500" v-if="confirmPasswordError" for="passwordError">{{ confirmPasswordErrorMsg }}</label>
                            </div>

                            
                            <div class="mb-4" v-if="!isLogin">
                                <label class="block text-gray-600 text-sm mb-2">{{ $t('login.form.label.username') }}</label>
                                <input 
                                    type="text" 
                                    v-model="username"
                                    :placeholder="$t('login.form.placeholder.username')"  
                                    class="w-full px-4 py-3 bg-gray-200 border border-gray-400 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                    :class="{'border-red-500': usernameError}"
                                >
                                <label class="text-red-500" v-if="usernameError">{{ usernameErrorMsg }}</label>
                            </div>

                                <div class="mb-4 w-2/5" v-if="!isLogin">
                                    <label class="block text-gray-600 text-sm mb-2">{{ $t('login.form.label.firstname') }}</label>
                                    <input 
                                        type="text" 
                                        v-model="firstname"
                                        :placeholder="$t('login.form.placeholder.firstname')"
                                        class="w-full px-4 py-3 bg-gray-200 border border-gray-400 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                        :class="{'border-red-500': firstnameError}"
                                    >
                                    <label class="text-red-500" v-if="firstnameError" for="passwordError">{{ firstnameErrorMsg }}</label>
                                </div>


                                <div class="mb-4 w-3/5" v-if="!isLogin">
                                    <label class="block text-gray-600 text-sm mb-2">{{ $t('login.form.label.lastname') }}</label>
                                    <input 
                                        type="text" 
                                        v-model="lastname"
                                        :placeholder="$t('login.form.placeholder.lastname')" 
                                        class="w-full px-4 py-3 bg-gray-200 border border-gray-400 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                        :class="{'border-red-500': lastnameError}"
                                    >
                                    <label class="text-red-500" v-if="lastnameError" for="passwordError">{{ lastnameErrorMsg }}</label>
                                </div>

                            <div class="mb-7" v-if="!isLogin">
                                <label class="block text-gray-600 text-sm mb-2">{{ $t('login.form.label.birthdate') }}</label>
                                <div class="relative">
                                    <input
                                        type="text"
                                        class="w-full px-4 py-3 bg-gray-200 border border-gray-400 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                        :placeholder="$t('login.form.placeholder.birthdate')"
                                        ref="datepicker"
                                        v-model="birthdate"
                                        :class="{'border-red-500': birthdateError}"
                                    />
                                    <label class="text-red-500" v-if="birthdateError" for="passwordError">{{ birthdateErrorMsg }}</label>
                                </div>
                            </div>
                        
                        <div class="flex items-center justify-between mb-6">
                            <div class="flex items-center space-x-3">
                                <label class="group flex items-center cursor-pointer">
                                    <input class="hidden peer" type="checkbox" />
                                    <span class="relative w-4 h-4 flex justify-center items-center bg-gray-200 border-1 border-gray-200 rounded-md shadow-md transition-all duration-500 peer-checked:border-indigo-500 peer-checked:bg-indigo-500 peer-hover:scale-105">
                                    <span
                                        class="absolute inset-0 bg-gradient-to-br from-gray-500 to-gray-200 opacity-0 peer-checked:opacity-100 rounded-md transition-all duration-500 peer-checked:animate-pulse"></span>
                                        <svg
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            class="hidden w-3 h-3 text-white peer-checked:block transition-transform duration-500 transform scale-50 peer-checked:scale-100"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                            clip-rule="evenodd"
                                            d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                                            fill-rule="evenodd"
                                            ></path>
                                        </svg>
                                    </span>
                                    <span
                                    class="ml-2 text-gray-500 group-hover:text-indigo-500 transition-colors duration-300">
                                        {{ $t('login.form.label.remember_me') }}
                                    </span>
                                </label>
                                </div>
                        <a href="#" class="text-sm text-indigo-500 hover:underline">{{ $t('login.form.label.forgot_password') }}</a>
                        </div>
                        
                        <button 
                        type="submit" 
                        class="w-full bg-gradient-to-l from-blue-700 to-indigo-400 text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity mb-6"
                        >
                        {{ isLogin ? $t('login.form.sign_in.submit_btn') : $t('login.form.sign_up.submit_btn') }}
                        </button>
                        
                        <div class="text-center text-gray-400 text-sm mb-4">{{ $t('login.form.label.or_cnt_wth') }}</div>
                        
                        <div class="grid grid-cols-2 gap-3">
                        <button 
                            type="button" 
                            class="flex items-center justify-center bg-gray-800 text-white py-2 px-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"
                        >
                            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.784-1.667-4.166-2.685-6.735-2.685-5.522 0-10 4.477-10 10s4.478 10 10 10c8.396 0 10-7.496 10-10 0-0.67-0.069-1.325-0.189-1.955h-9.811z"/>
                            </svg>
                            Google
                        </button>
                        <button 
                            type="button" 
                            class="flex items-center justify-center bg-gray-800 text-white py-2 px-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"
                        >
                            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53-1.71-2.48-2.96-7.02-1.24-10.08 1.72-3.06 4.57-4.05 7.38-4.05 1.53 0 2.99.62 4.03 1.63 1.01.99 1.69 2.39 1.51 3.96h-4.54c-.01 1.1.75 2.14 1.78 2.15 1.03.01 2.65-1.01 3.47-2.99 0 0 1.72-.66 1.72 2.4.01 3.07-2.23 6.59-5.15 6.59z"/>
                            </svg>
                            Apple
                        </button>
                        </div>
                    </form>
                    </div>
                </div>
        </div>
        <div v-if="loading" 
            class="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"
        ></div>
    </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, nextTick } from 'vue';
import flatpickr from 'flatpickr';
import { useI18n } from 'vue-i18n';
import 'flatpickr/dist/flatpickr.min.css';
import { 
    ArrowUturnLeftIcon
} from '@heroicons/vue/24/outline'

import router from '../router';
import { useFetch} from '../helpers/authenticate.js';

const isLogin = ref(true);
const datepicker = ref(null);
let picker = null;
const loading = ref(false);
const { t } = useI18n()

// Form fields
const email = ref('test@example06.com');
const password01 = ref('your_secure_password');
const password02 = ref('');
const username = ref('');
const firstname = ref('');
const lastname = ref('');
const birthdate = ref('');

const registerError = ref(false);
const loginError = ref(false);
const emailError = ref(false);
const passwordError = ref(false);
const confirmPasswordError = ref(false);
const usernameError = ref(false);
const firstnameError = ref(false);
const lastnameError = ref(false);
const birthdateError = ref(false);

const registerErrorMsg = ref(t('login.form.error.register'));
const loginErrorMsg = ref(t('login.form.error.login'));
const emailErrorMsg = ref("");
const passwordErrorMsg = ref("");
const confirmPasswordErrorMsg = ref("");
const usernameErrorMsg = ref("");
const firstnameErrorMsg = ref("");
const lastnameErrorMsg = ref("");
const birthdateErrorMsg = ref("");

onMounted(() => {
    if (datepicker.value) {
        picker = flatpickr(datepicker.value, {
        inline: false,
        allowInput: false,
        monthSelectorType: 'static',
        dateFormat: 'Y-m-d',
        static: true
        });
    }
    nextTick(() => {
    if (datepicker.value) {
        picker = flatpickr(datepicker.value, {
        });
        }
    });
});

onBeforeUnmount(() => {
    if (picker) {
        picker.destroy();
    }
});

const toggleForm = () => {

    emailError.value = false;
    passwordError.value = false;
    confirmPasswordError.value = false;
    usernameError.value = false;
    firstnameError.value = false;
    lastnameError.value = false;
    birthdateError.value = false;

    isLogin.value = !isLogin.value;
};


const submitForm = () => {
    console.log("Submitting form...");
    // If isLogin is true, perform login action
    if (isLogin.value) {
        checkLoginForm();
        if (!passwordError.value || !emailError.value) {
            loading.value = true;
            login();
        }
    }
    else {
        // If isLogin is false, perform signup action
        checkRegisterForm();
        if (!registerError.value) {
            console.log("Registering...");
            loading.value = true;
            register();
        }
        else {
            loading.value = false;
        }
    }
};

const login = async () => {
    try{
        const { res, data } = await useFetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify({
                identifier: email.value,
                password: password01.value
            }),
            credentials: 'include'
        });


        if (res.ok) {
            console.log("Res was ok...");
            isAuthenticated();
            // window.location.href = '/'  

            // if (route.query.state === 'authorize') {
            // const redirect_uri = route.query.redirect_uri;
            // const state = route.query.state;
            //     console.log("Authorizing now...");
            // const { res, data } = await useFetch('/auth/auto', { credentials: 'include' });
            // if (res.ok) {
            //     window.location.href = `${redirect_uri}?code=${data.token}&state=${state}`;
            // } else {
            //     window.location.href = `${import.meta.env.VITE_BASE_URL}/login?client_id=${route.query.client_id}&redirect_uri=${redirect_uri}&state=authorize`;
            // }
            // } else {
            // router.push('/');
            // }

        } else {
            loginErrorMsg.value = data.message || 'Invalid login credentials';
        }
    } catch {
        loginErrorMsg.value = 'An error occurred. Please try again.';
    } finally {
        loading.value = false;
    }
};

const isAuthenticated = async () => {
    try {
        const { res, data } = await useFetch('/auth/protected', {
            method: 'GET',
            credentials: 'include'
        });
        if (res && res.ok && data?.user) {
        console.log("Benutzer ist authentifiziert:", data.user);
        return true;
        } else {
        console.warn("Benutzer ist nicht authentifiziert");
        return false;
        }
    } catch (error) {
        console.error("Fehler beim Auth-Check:", error);
        return false;
    }
};



const register = async () => {
    try {
        const { res, data } = await useFetch('/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username.value,
                email: email.value,
                password: password01.value,
                firstname: firstname.value,
                lastname: lastname.value,
                birthdate: birthdate.value
            }),
            credentials: 'include'
        });

        if (res.ok) {
            console.log("data token:", data.object);
            if (data) {
                localStorage.setItem('token', data); // If storing client-side
                console.log('Token stored:', data);
            }
            // window.location.href = '/';
        } else {
            registerErrorMsg.value = data.message || 'Registration failed. Please try again.';
        }
    } catch (error) {
        registerErrorMsg.value = 'An error occurred. Please try again.';
    } finally {
        loading.value = false;
    }
};


const checkLoginForm = () => {
    // Check if email is valid
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value)) {
        emailErrorMsg.value = t('login.form.error.email');
        emailError.value = true;
    }
    else {
        emailError.value = false;
    }
    
    if (password01.value.length <= 0) {
        passwordErrorMsg.value = t('login.form.error.password');
        passwordError.value = true;
    }
    else {
        passwordError.value = false;
    }
};


const checkRegisterForm = () => {
    // Check if email is valid
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value)) {
        emailErrorMsg.value = t('login.form.error.email');
        emailError.value = true;
        registerError.value = true;
    }
    else {
        emailError.value = false;
    }

    // Check if password is valid
    if (password01.value.length <= 0) {
        passwordErrorMsg.value = t('login.form.error.password');
        passwordError.value = true;
        registerError.value = true;
    }
    else {
        passwordError.value = false;
    }

    // Check if passwords match
    if (password01.value !== password02.value || password02.value.length <= 0) {
        confirmPasswordErrorMsg.value = t('login.form.error.confirm_password');
        confirmPasswordError.value = true;
        registerError.value = true;
    }

    // Check if username is valid
    if (username.value.length <= 0) {
        usernameErrorMsg.value = t('login.form.error.username');
        usernameError.value = true;
        registerError.value = true;
    }
    else {
        usernameError.value = false;
    }

    // Check if firstname is valid
    if (firstname.value.length <= 0) {
        firstnameErrorMsg.value = t('login.form.error.firstname');
        firstnameError.value = true;
        registerError.value = true;
    }
    else {
        firstnameError.value = false;
    }

    // Check if lastname is valid
    if (lastname.value.length <= 0) {
        lastnameErrorMsg.value = t('login.form.error.lastname');
        lastnameError.value = true;
        registerError.value = true;
    }
    else {
        lastnameError.value = false;
    }
    if (birthdate.value.length <= 0) {
        birthdateErrorMsg.value = t('login.form.error.birthdate');
        birthdateError.value = true;
        registerError.value = true;
    }
    else {
        birthdateError.value = false;
    }
};
</script>


<style>

  /* Custom scrollbar */
    ::-webkit-scrollbar {
    width: 8px;
}
    ::-webkit-scrollbar-track {
    background: #1a1a1a;
}
::-webkit-scrollbar-thumb {
    background: #4a4a4a;
    border-radius: 4px;
}
    ::-webkit-scrollbar-thumb:hover {
    background: #555;
}
</style>
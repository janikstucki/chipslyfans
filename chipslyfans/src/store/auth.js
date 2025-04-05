// store/auth.js (mit Pinia)
import { defineStore } from 'pinia';
import { useFetch } from '@/composables/useFetch'; // passe den Pfad an

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loggedIn: false
  }),
  actions: {
    async checkAuth() {
      const { res, data } = await useFetch('/auth/protected', { credentials: 'include' });
      if (res.ok && data?.user) {
        this.user = data.user;
        this.loggedIn = true;
      } else {
        this.user = null;
        this.loggedIn = false;
      }
    }
  }
});

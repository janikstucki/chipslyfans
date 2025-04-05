import { defineStore } from 'pinia';
import { useFetch } from '../helpers/authenticate.js';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        authenticated: false,
        loading: false
    }),
    actions: {
        async checkAuth() {
            this.loading = true;
            try {
              const { res, data } = await useFetch('/auth/protected', {
                method: 'GET',
                credentials: 'include'
              });
              if (res && res.ok && data?.user) {
                this.user = data.user;
                this.authenticated = true;
              } else {
                this.user = null;
                this.authenticated = false;
              }
            } catch (error) {
              console.error("Authentication check failed:", error);
              // Set state to not authenticated if an error occurs
              this.user = null;
              this.authenticated = false;
            } finally {
              this.loading = false;
            }
          }
    }
});

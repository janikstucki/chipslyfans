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

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    isLoading: false
  }),
  actions: {
    async fetchCurrentUser() {
      this.isLoading = true;
      try {
        const { res, data } = await useFetch('/auth/protected', {
          method: 'GET',
          credentials: 'include'
        });
        
        if (res?.ok && data?.user) {
          this.user = data.user;
          this.isAuthenticated = true;
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        this.logout();
      } finally {
        this.isLoading = false;
      }
    },
    logout() {
      this.user = null;
      this.isAuthenticated = false;
    }
  },
  getters: {
    userId: (state) => state.user?.id
  }
});

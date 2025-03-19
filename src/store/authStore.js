import { reactive } from 'vue';
import { login, logout } from '@/services/authService';

export const authStore = reactive({
  user: null,
  token: localStorage.getItem('token') || null,

  async loginUser(userData) {
    const data = await login(userData);
    this.token = data.access_token;
  },

  async logoutUser() {
    await logout();
    this.token = null;
  }
});

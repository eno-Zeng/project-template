import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import request from '@/request';
import { getUserInfo, login as loginRequest, logout as logoutRequest } from '@/api/account';

export const useAccountStore = defineStore(
  'account',
  () => {
    const token = ref('');
    const userInfo = ref({
      username: '',
    });

    const getToken = () => token.value;

    const isLogin = computed(() => !!token.value);

    const login = async (username: string, password: string) => {
      const { data: _token } = await loginRequest({ username, password });
      token.value = _token;
      const { data: _userInfo } = await getUserInfo();
      userInfo.value = { ..._userInfo };
    };

    const logout = () => {
      logoutRequest();
      token.value = '';
      userInfo.value = { username: '' };
    };

    return { getToken, login, logout, isLogin };
  },
  {
    persist: {
      key: 'account-store',
      pick: ['token', 'userInfo'],
    },
  }
);

import { computed } from 'vue';
import { defineStore } from 'pinia';
import { getUserInfo, login as loginRequest, logout as logoutRequest } from '@/api/account';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export const useAccountStore = defineStore('account', () => {
  const token = useLocalStorage('token', '');
  const userInfo = useLocalStorage('userInfo', {
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
});

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
    try {
      const { data: _token } = await loginRequest({ username, password });
      token.value = _token;
      const { data: _userInfo } = await getUserInfo();
      userInfo.value = { ..._userInfo };
    } catch (error) {
      // 任一环节失败都回滚为未登录状态, 避免"已登录但无用户信息"的中间态
      clearAccount();
      throw error;
    }
  };

  /** 仅清理本地登录态, 不发起退出请求 (用于 401 等被动失效场景) */
  const clearAccount = () => {
    token.value = '';
    userInfo.value = { username: '' };
  };

  const logout = () => {
    // 退出接口失败不阻断本地登出, 不产生 unhandled rejection, 错误提示由请求层统一处理
    logoutRequest().catch(() => {});
    clearAccount();
  };

  return { getToken, login, logout, clearAccount, isLogin };
});

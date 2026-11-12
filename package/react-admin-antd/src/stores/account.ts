import { create } from 'zustand';
import { getUserInfo, login as loginRequest, logout as logoutRequest } from '@/api/account';

const TOKEN_KEY = 'token';
const USER_INFO_KEY = 'userInfo';

interface UserInfo {
  username: string;
}

const readStorage = <T,>(key: string, defaultValue: T): T => {
  const item = localStorage.getItem(key);
  if (item === null) return defaultValue;

  try {
    return JSON.parse(item) as T;
  } catch (error) {
    console.error('[account] 数据解析失败:', error);
    return defaultValue;
  }
};

const writeStorage = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`[account] 写入 ${key} 失败:`, error);
  }
};

interface AccountState {
  token: string;
  userInfo: UserInfo;
  getToken: () => string;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  clearAccount: () => void;
}

export const useAccountStore = create<AccountState>((set, get) => ({
  token: readStorage(TOKEN_KEY, ''),
  userInfo: readStorage<UserInfo>(USER_INFO_KEY, { username: '' }),

  getToken: () => get().token,

  login: async (username: string, password: string) => {
    try {
      const { data: _token } = await loginRequest({ username, password });
      set({ token: _token });
      writeStorage(TOKEN_KEY, _token);

      const { data: _userInfo } = await getUserInfo();
      set({ userInfo: { ..._userInfo } });
      writeStorage(USER_INFO_KEY, { ..._userInfo });
    } catch (error) {
      // 任一环节失败都回滚为未登录状态, 避免"已登录但无用户信息"的中间态
      get().clearAccount();
      throw error;
    }
  },

  /** 仅清理本地登录态, 不发起退出请求 (用于 401 等被动失效场景) */
  clearAccount: () => {
    set({ token: '', userInfo: { username: '' } });
    writeStorage(TOKEN_KEY, '');
    writeStorage(USER_INFO_KEY, { username: '' });
  },

  logout: () => {
    // 退出接口失败不阻断本地登出, 不产生 unhandled rejection, 错误提示由请求层统一处理
    logoutRequest().catch(() => {});
    get().clearAccount();
  },
}));

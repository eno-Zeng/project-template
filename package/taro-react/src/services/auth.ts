import Taro from '@tarojs/taro';
import type { UserProfile } from '@/types/user';

const USER_STORAGE_KEY = 'taro_react_user';

export const getCurrentUser = (): UserProfile | null => {
  try {
    return Taro.getStorageSync<UserProfile>(USER_STORAGE_KEY) || null;
  } catch (error) {
    console.error('[Auth] 读取本地登录状态失败', error);
    return null;
  }
};

export const loginLocally = (account: string): UserProfile => {
  const profile: UserProfile = {
    account,
    nickname: `探索者 ${account.slice(-4)}`,
  };

  try {
    Taro.setStorageSync(USER_STORAGE_KEY, profile);
    console.info('[Auth] 本地演示登录状态已保存');
    return profile;
  } catch (error) {
    console.error('[Auth] 保存本地登录状态失败', error);
    throw error;
  }
};

export const logoutLocally = (): void => {
  try {
    Taro.removeStorageSync(USER_STORAGE_KEY);
    console.info('[Auth] 本地登录状态已清除');
  } catch (error) {
    console.error('[Auth] 清除本地登录状态失败', error);
    throw error;
  }
};

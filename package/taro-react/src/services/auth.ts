import Taro from "@tarojs/taro";
import { post } from "@/request";
import type { UserProfile } from "@/types/user";

const USER_STORAGE_KEY = "taro_react_user";

interface LoginResponse {
  account: string;
  nickname: string;
  token: string;
}

export const getCurrentUser = (): UserProfile | null => {
  try {
    return Taro.getStorageSync<UserProfile>(USER_STORAGE_KEY) || null;
  } catch (error) {
    console.error("[Auth] 读取本地登录状态失败", error);
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
    console.info("[Auth] 本地演示登录状态已保存");
    return profile;
  } catch (error) {
    console.error("[Auth] 保存本地登录状态失败", error);
    throw error;
  }
};

export const logoutLocally = (): void => {
  try {
    Taro.removeStorageSync(USER_STORAGE_KEY);
    console.info("[Auth] 本地登录状态已清除");
  } catch (error) {
    console.error("[Auth] 清除本地登录状态失败", error);
    throw error;
  }
};

/**
 * 登录
 * - mock 模式：请求 /auth/login，由 devServer 拦截并返回 mock 数据
 * - 其他模式：沿用本地演示登录
 */
export const login = async (
  account: string,
  password: string,
): Promise<UserProfile> => {
  if (process.env.TARO_APP_MODE !== "mock") {
    return loginLocally(account);
  }

  const { data } = await post<LoginResponse>(
    "/api/auth/login",
    { account, password },
    { silent: true },
  );
  const profile: UserProfile = {
    account: data.account,
    nickname: data.nickname,
  };

  try {
    Taro.setStorageSync(USER_STORAGE_KEY, profile);
    console.info("[Auth] mock 登录状态已保存");
    return profile;
  } catch (error) {
    console.error("[Auth] 保存本地登录状态失败", error);
    throw error;
  }
};

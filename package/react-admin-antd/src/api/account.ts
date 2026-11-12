import request from '@/request';

/**
 * 登录请求
 */
export const login = (data: { username: string; password: string }) =>
  request<string>({
    url: '/api/login',
    method: 'POST',
    data,
    isLoading: true,
  });

/**
 * 获取用户信息
 */
export const getUserInfo = () =>
  request<{ username: string }>({
    url: '/api/account/user-info',
    isLoading: true,
  });

/**
 * 退出登录
 */
export const logout = () =>
  request({
    url: '/api/logout',
    method: 'POST',
  });

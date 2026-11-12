import request from '@/request';
import type { GetUserDetailParams, UpdateUserParams, UserDetail } from './type';

export const getUserDetail = (params: GetUserDetailParams) =>
  request<UserDetail>({
    url: '/api/user/detail',
    method: 'GET',
    params,
  });

export const updateUser = (data: UpdateUserParams) =>
  request<null>({
    url: '/api/user/update',
    method: 'PUT',
    data,
  });

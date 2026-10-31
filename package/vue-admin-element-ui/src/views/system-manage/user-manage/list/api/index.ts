import request from '@/request';
import type { GetUserListParams, UserListItem } from './type';

export const getUserList = (params: GetUserListParams) =>
  request<UserListItem[]>({
    url: '/api/user/list',
    method: 'GET',
    params,
  });

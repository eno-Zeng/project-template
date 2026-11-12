import request, { createAbort } from '@/request';
import type { GetUserListParams, UserListItem } from './type';

export const [abortKey, abortGetUserList] = createAbort();

export const getUserList = (params: GetUserListParams) =>
  request<UserListItem[]>({
    url: '/api/user/list',
    method: 'GET',
    params,
    abortKey,
  });

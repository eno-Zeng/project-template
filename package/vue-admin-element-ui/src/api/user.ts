import { request } from '@/utils/request';

export interface User {
  id: number;
  name: string;
  role: string;
  email: string;
}

export function fetchUserList() {
  return request<User[]>('/user/list');
}

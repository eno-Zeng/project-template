import SystemManage from '@/views/system-manage/router.ts';
import type { RouteRecordRaw } from 'vue-router';

export const HomePage = {
  path: '/home',
  name: 'Home',
  component: () => import('@/views/HomeView.vue'),
  meta: {
    title: '首页',
    isMenu: true,
  },
};

export const modules = [HomePage, SystemManage] as RouteRecordRaw[];

import { lazy } from 'react';
import type { IRoute } from './type';
import SystemManage from '@/views/system-manage/router';

const HomeView = lazy(() => import('@/views/HomeView'));

export const HomePage: IRoute = {
  path: '/home',
  name: 'Home',
  element: <HomeView />,
  meta: {
    title: '首页',
    isMenu: true,
    icon: 'HomeFilled',
  },
};

export const modules: IRoute[] = [HomePage, SystemManage];

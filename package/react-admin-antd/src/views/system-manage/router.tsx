import { lazy } from 'react';
import type { IRoute } from '@/router/type';

const UserManageList = lazy(() => import('./user-manage/list'));
const UserManageDetail = lazy(() => import('./user-manage/detail'));

const route: IRoute = {
  path: '/system-manage',
  name: 'SystemManage',
  redirect: '/system-manage/user-manage',
  meta: {
    title: '系统管理',
    isMenu: true,
    icon: 'setting',
  },
  children: [
    {
      path: '/system-manage/user-manage',
      name: 'SystemManageUserManage',
      redirect: '/system-manage/user-manage/list',
      meta: {
        title: '用户管理',
        isMenu: true,
        icon: 'user',
      },
      children: [
        {
          path: '/system-manage/user-manage/list',
          name: 'SystemManageUserManageList',
          element: <UserManageList />,
          meta: {
            title: '用户列表',
          },
        },
        {
          path: '/system-manage/user-manage/detail/:id',
          name: 'SystemManageUserManageDetail',
          element: <UserManageDetail />,
          meta: {
            title: '用户详情',
          },
        },
        {
          path: '/system-manage/user-manage/edit/:id',
          name: 'SystemManageUserManageEdit',
          element: <UserManageDetail />,
          meta: {
            title: '用户编辑',
          },
        },
      ],
    },
  ],
};

export default route;

import type { IRoute } from '@/router/type';

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
          component: () => import('@/views/system-manage/user-manage/list/index.vue'),
          meta: {
            title: '用户列表',
          },
        },
        {
          path: '/system-manage/user-manage/detail',
          name: 'SystemManageUserManageDetail',
          component: () => import('@/views/system-manage/user-manage/detail/index.vue'),
          meta: {
            title: '用户详情',
          },
        },
      ],
    },
  ],
};

export default route;

import { createRouter, createWebHashHistory } from 'vue-router';
import { MainLayout } from '@/layout';
import HomeView from '@/views/HomeView.vue';
import Login from '@/views/login.vue';
import NotFound from '@/views/not-found.vue';
import { useAccountStore } from '@/stores/account';

const router = createRouter({
  history: createWebHashHistory(''),
  routes: [
    {
      path: '/',
      component: MainLayout,
      redirect: '/home',
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: 'home',
          name: 'Home',
          component: HomeView,
        },
      ],
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/404',
      name: 'NotFound',
      component: NotFound,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/404',
    },
  ],
});

/**
 * 若前往登录页时:
 *    已登录: 返回原来的页面, next(form)
 *    未登录: 不拦截直接 next()
 * 若前往未登录页时:
 *    已登录: 不拦截直接 next()
 *    未登录: 直接跳转登录页
 */
router.beforeEach((to, form, next) => {
  const accountStore = useAccountStore();
  const isToLoginPage = to.name === 'Login';
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (isToLoginPage) {
    if (accountStore.isLogin) next(form);
    else next();
  } else if (requiresAuth) {
    if (accountStore.isLogin) next();
    else next({ name: 'Login' });
  } else {
    next();
  }
});

export default router;

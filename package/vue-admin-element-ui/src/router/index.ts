import { createRouter, createWebHashHistory } from 'vue-router';
import { MainLayout } from '@/layout';
import HomeView from '@/views/HomeView.vue';
import Login from '@/views/login.vue';
import { useAccountStore } from '@/stores/account';

const router = createRouter({
  history: createWebHashHistory(''),
  routes: [
    {
      path: '/',
      component: MainLayout,
      redirect: '/home',
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
  if (isToLoginPage) {
    if (accountStore.isLogin) next(form);
    else next();
  } else {
    if (accountStore.isLogin) next();
    else next({ name: 'Login' });
  }
});

export default router;

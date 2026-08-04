import { createRouter, createWebHashHistory } from 'vue-router';
import { MainLayout } from '@/layout';
import HomeView from '@/views/HomeView.vue';

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
  ],
});

export default router;

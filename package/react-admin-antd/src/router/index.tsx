import { createHashRouter, Navigate, type RouteObject } from 'react-router-dom';
import MainLayout from '@/layout/main-layout';
import Login from '@/views/login';
import NotFound from '@/views/not-found';
import RequireAuth from './RequireAuth';
import { HomePage, modules } from './constant';
import type { IRoute } from './type';

const toRouteObjects = (routes: IRoute[]): RouteObject[] => {
  return routes.map(route => {
    const children = route.children ? toRouteObjects(route.children) : [];

    // 父级重定向: 通过 index 路由实现
    if (route.redirect) {
      children.unshift({ index: true, element: <Navigate to={route.redirect} replace /> });
    }

    return {
      path: route.path,
      element: route.element,
      children: children.length ? children : undefined,
    };
  });
};

const router = createHashRouter([
  {
    path: '/',
    element: (
      <RequireAuth>
        <MainLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Navigate to={HomePage.path} replace /> },
      ...toRouteObjects(modules),
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/404',
    element: <NotFound />,
  },
  {
    path: '*',
    element: <Navigate to="/404" replace />,
  },
]);

export default router;

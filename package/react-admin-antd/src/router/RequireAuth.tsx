import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAccountStore } from '@/stores/account';

interface RequireAuthProps {
  children: ReactNode;
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const token = useAccountStore(state => state.token);
  const location = useLocation();

  // 未登录: 跳转登录页, 携带目标地址, 登录成功后回跳
  if (!token) {
    const redirect = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }

  return <>{children}</>;
}

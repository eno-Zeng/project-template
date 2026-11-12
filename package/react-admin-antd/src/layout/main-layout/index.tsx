import { useState } from 'react';
import { Layout, Spin } from 'antd';
import { Outlet } from 'react-router-dom';
import MainLayoutHeader from './main-layout-header';
import MainLayoutAside from './main-layout-aside';
import { useAppStore } from '@/stores/app';

const { Content } = Layout;

export default function MainLayout() {
  const [isAsideCollapsed, setIsAsideCollapsed] = useState(false);
  const isLoading = useAppStore(state => state.loadingCount > 0);

  return (
    <Layout className="h-full w-full overflow-hidden" style={{ background: 'var(--a-color-bg-1)' }}>
      <MainLayoutHeader isAsideCollapsed={isAsideCollapsed} />
      <Layout
        className="flex-1 overflow-hidden"
        style={{ flexDirection: 'row', background: 'var(--a-color-bg-1)' }}
      >
        <MainLayoutAside
          isAsideCollapsed={isAsideCollapsed}
          onSwitchCollapse={setIsAsideCollapsed}
        />
        <Content
          className="flex-1 overflow-auto"
          style={{ background: 'var(--a-color-bg-2-ff)', padding: 16 }}
        >
          <Outlet />
        </Content>
      </Layout>
      <Spin spinning={isLoading} fullscreen tip="加载中..." />
    </Layout>
  );
}

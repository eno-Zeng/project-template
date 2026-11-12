import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { App as AntdApp, ConfigProvider, Spin } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import router from '@/router';

export default function App() {
  return (
    <ConfigProvider locale={zhCN} theme={{ token: { colorPrimary: '#0a95a6' } }}>
      <AntdApp>
        <Suspense fallback={<Spin fullscreen tip="加载中..." />}>
          <RouterProvider router={router} />
        </Suspense>
      </AntdApp>
    </ConfigProvider>
  );
}

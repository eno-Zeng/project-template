/// <reference types="vite/client" />
import { MainLayout, ListLayout } from './src/layout';

declare module '*.vue' {
  import type { DefineComponent } from 'vue';

  const component: DefineComponent<Record<string, never>, Record<string, never>, unknown>;
  export default component;
}

declare module 'vue' {
  // 添加布局组件到 Vue 全局组件类型定义
  interface GlobalComponents {
    MainLayout: typeof MainLayout;
    ListLayout: typeof ListLayout;
  }
}

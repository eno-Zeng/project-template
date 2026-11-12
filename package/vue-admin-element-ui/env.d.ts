/// <reference types="vite/client" />
import type { LayoutComponent } from './src/layout';

declare module '*.vue' {
  import type { DefineComponent } from 'vue';

  const component: DefineComponent<Record<string, never>, Record<string, never>, unknown>;
  export default component;
}

declare module 'vue' {
  // 添加布局组件到 Vue 全局组件类型定义
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface GlobalComponents extends LayoutComponent {}
}

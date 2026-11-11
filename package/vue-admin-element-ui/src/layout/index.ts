import type { App } from 'vue';
import MainLayout from './main-layout/index.vue';
import ListLayout from './list-layout/index.vue';
import DetailLayout from './detail-layout/index.vue';

export { MainLayout, ListLayout, DetailLayout };

export default {
  install(app: App) {
    app.component(MainLayout.name!, MainLayout);
    app.component(ListLayout.name!, ListLayout);
    app.component(DetailLayout.name!, DetailLayout);
  },
};
export type LayoutComponent = {
  MainLayout: typeof MainLayout;
  ListLayout: typeof ListLayout;
  DetailLayout: typeof DetailLayout;
};

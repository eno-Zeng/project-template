import type { App } from 'vue';
import MainLayout from './main-layout/index.vue';
import ListLayout from './list-layout/index.vue';

export { MainLayout, ListLayout };

export default {
  install(app: App) {
    app.component(MainLayout.name!, MainLayout);
    app.component(ListLayout.name!, ListLayout);
  },
};

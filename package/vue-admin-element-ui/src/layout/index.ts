import type { App } from 'vue';
import MainLayout from './main-layout/index.vue';

export { MainLayout };

export default {
  install(app: App) {
    app.component(MainLayout.name!, MainLayout);
  },
};

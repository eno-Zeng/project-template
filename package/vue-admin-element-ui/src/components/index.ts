import type { App } from 'vue';
import Pagination from './pagination/index.vue';
import AIcon from './a-icon/index.vue';

export { Pagination, AIcon };

export default (app: App) => {
  app.component(Pagination.name!, Pagination);
  app.component(AIcon.name!, AIcon);
};

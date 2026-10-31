import type { RouteRecordRaw } from 'vue-router';

export interface IRoute extends Omit<RouteRecordRaw, 'meta' | 'children'> {
  children?: IRoute[];
  meta: {
    title: string;
    isMenu?: boolean;
    icon?: string;
  };
}

import type { ReactNode } from 'react';

export interface RouteMeta {
  title: string;
  isMenu?: boolean;
  icon?: string;
}

export interface IRoute {
  path: string;
  name?: string;
  element?: ReactNode;
  redirect?: string;
  meta: RouteMeta;
  children?: IRoute[];
}

export interface MenuItem {
  key: string;
  title: string;
  path: string;
  children: MenuItem[];
  name: string;
  icon?: string;
}

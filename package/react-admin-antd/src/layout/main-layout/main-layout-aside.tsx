import { useMemo } from 'react';
import { Button, Layout, Menu, type MenuProps } from 'antd';
import { ExpandOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { modules } from '@/router/constant';
import type { IRoute } from '@/router/type';
import AIcon from '@/components/a-icon';
import type { MenuItem } from './type';

const { Sider } = Layout;

interface MainLayoutAsideProps {
  isAsideCollapsed: boolean;
  onSwitchCollapse: (collapsed: boolean) => void;
}

const buildRouteMenus = (routes: IRoute[]): MenuItem[] => {
  return routes
    .filter(record => record.meta?.isMenu)
    .flatMap(record => {
      const children = Array.isArray(record.children) ? buildRouteMenus(record.children) : [];

      return [
        {
          key: String(record.name ?? record.path),
          title: record.meta.title,
          path: record.path,
          name: record.name ?? '',
          icon: record.meta.icon,
          children,
        },
      ];
    });
};

const toMenuItems = (items: MenuItem[]): MenuProps['items'] => {
  return items.map(item => ({
    key: item.children.length ? item.key : item.path,
    icon: item.icon ? <AIcon name={item.icon} /> : undefined,
    label: item.title,
    children: item.children.length ? toMenuItems(item.children) : undefined,
  }));
};

const getMenuItems = (items: MenuItem[]): MenuItem[] => {
  return items.flatMap(item => [item, ...getMenuItems(item.children)]);
};

export default function MainLayoutAside({
  isAsideCollapsed,
  onSwitchCollapse,
}: MainLayoutAsideProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = useMemo(() => toMenuItems(buildRouteMenus(modules)), []);

  const activeKey = useMemo(() => {
    return (
      getMenuItems(buildRouteMenus(modules))
        .filter(item => location.pathname === item.path || location.pathname.startsWith(`${item.path}/`))
        .sort((a, b) => b.path.length - a.path.length)[0]?.path ?? ''
    );
  }, [location.pathname]);

  return (
    <Sider
      width={256}
      collapsedWidth={64}
      collapsed={isAsideCollapsed}
      trigger={null}
      theme="light"
      className="relative overflow-x-hidden overflow-y-auto"
      style={{ background: 'var(--a-color-bg-1)', height: '100%' }}
    >
      <Menu
        mode="inline"
        inlineCollapsed={isAsideCollapsed}
        selectedKeys={[activeKey]}
        items={menuItems}
        onClick={({ key }) => {
          if (key.startsWith('/')) navigate(key);
        }}
        style={{
          height: '100%',
          borderInlineEnd: 'none',
          background: 'var(--a-color-bg-1)',
        }}
      />
      <Button
        type="text"
        icon={isAsideCollapsed ? <ExpandOutlined /> : <MenuFoldOutlined />}
        className="absolute right-[10px] bottom-[10px]"
        onClick={() => onSwitchCollapse(!isAsideCollapsed)}
      />
    </Sider>
  );
}

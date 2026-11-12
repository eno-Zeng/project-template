import type { ComponentType, CSSProperties, ReactNode } from 'react';
import { HomeFilled, SettingOutlined, UserOutlined } from '@ant-design/icons';

const iconMap: Record<string, ComponentType<{ style?: CSSProperties }>> = {
  HomeFilled,
  homefilled: HomeFilled,
  setting: SettingOutlined,
  Setting: SettingOutlined,
  user: UserOutlined,
  User: UserOutlined,
};

interface AIconProps {
  name?: string;
  style?: CSSProperties;
}

export default function AIcon({ name, style }: AIconProps): ReactNode {
  if (!name) return null;

  const Icon = iconMap[name];
  return Icon ? <Icon style={style} /> : null;
}

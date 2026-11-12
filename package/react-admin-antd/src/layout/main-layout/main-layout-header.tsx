import { Dropdown, Layout, type MenuProps } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import LogoImage from '@/assets/logo.svg';
import { useAccountStore } from '@/stores/account';

interface MainLayoutHeaderProps {
  isAsideCollapsed: boolean;
}

export default function MainLayoutHeader({ isAsideCollapsed }: MainLayoutHeaderProps) {
  const logout = useAccountStore(state => state.logout);
  const navigate = useNavigate();

  const handleDropdownCommand: MenuProps['onClick'] = ({ key }) => {
    switch (key) {
      case 'logout':
        logout();
        navigate('/login');
        break;

      default:
        break;
    }
  };

  return (
    <Layout.Header
      style={{
        height: 60,
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--a-color-bg-2-ff)',
        borderBottom: '1px solid var(--a-color-border-3)',
        lineHeight: 'normal',
      }}
    >
      <div
        style={{
          width: isAsideCollapsed ? 64 : 256,
          height: 60,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          padding: '0 10px',
          overflow: 'hidden',
          borderRight: '1px solid var(--a-color-border-3)',
          transition: 'width 0.2s',
        }}
      >
        <img src={LogoImage} alt="logo" style={{ width: 40, flexShrink: 0 }} />
        {!isAsideCollapsed && (
          <h2 style={{ fontSize: 30, fontWeight: 600, whiteSpace: 'nowrap' }}>管理系统</h2>
        )}
      </div>
      <Dropdown
        trigger={['hover']}
        menu={{ items: [{ key: 'logout', label: '退出' }], onClick: handleDropdownCommand }}
      >
        <div
          className="mr-[20px] flex size-[40px] cursor-pointer items-center justify-center rounded-full border"
          style={{ borderColor: 'var(--a-color-border-3)' }}
        >
          <UserOutlined style={{ fontSize: 20 }} />
        </div>
      </Dropdown>
    </Layout.Header>
  );
}

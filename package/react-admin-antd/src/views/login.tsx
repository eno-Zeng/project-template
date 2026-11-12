import { useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { App, Button, Form, Input, Space } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import LogoImage from '@/assets/logo.svg';
import { useAccountStore } from '@/stores/account';
import { HomePage } from '@/router/constant';

interface LoginForm {
  username: string;
  password: string;
}

export default function Login() {
  const [form] = Form.useForm<LoginForm>();
  const [submitting, setSubmitting] = useState(false);

  const login = useAccountStore(state => state.login);
  const token = useAccountStore(state => state.token);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { message } = App.useApp();

  // 优先回跳登录前的目标页面 (路由守卫跳转登录时携带 redirect)
  const redirect = searchParams.get('redirect');
  const target = redirect && redirect.startsWith('/') ? redirect : HomePage.path;

  // 已登录: 直接返回目标页面
  if (token) return <Navigate to={target} replace />;

  const handleFinish = async (values: LoginForm) => {
    setSubmitting(true);
    try {
      await login(values.username, values.password);
    } catch {
      // 登录失败: 错误提示由请求层统一处理, store 已回滚登录态, 无需重复处理
      return;
    } finally {
      setSubmitting(false);
    }

    message.success('登录成功');
    navigate(target, { replace: true });
  };

  return (
    <div className="flex size-full">
      <div className="flex-1 bg-[var(--a-color-fill-4)] pt-[20vh]">
        <div className="mb-[20px] flex justify-center">
          <img src={LogoImage} alt="logo" className="w-[100px]" />
        </div>
        <h2 className="text-center text-[40px] font-semibold">管理系统</h2>
        <p className="p-[20px] text-[var(--a-color-text-3)]">
          一个后台管理系统, 基于 react + vite + antd 搭建的基础模板,
          包含布局、路由、mock、请求工具与其他常用工具封装。
        </p>
      </div>
      <div className="flex-1 pt-[30vh] pr-[40px] pl-[40px]">
        <h3 className="mb-[8px] text-[30px] font-semibold">欢迎回来</h3>
        <p className="mb-[12px] text-[var(--a-color-text-3)]">请使用管理员账号登录系统</p>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{ username: '', password: '' }}
        >
          <Form.Item
            name="username"
            label={
              <Space>
                <UserOutlined />
                用户名
              </Space>
            }
            rules={[{ required: true, message: '用户名不能为空' }]}
          >
            <Input placeholder="请输入用户名" allowClear />
          </Form.Item>
          <Form.Item
            name="password"
            label={
              <Space>
                <LockOutlined />
                密码
              </Space>
            }
            rules={[{ required: true, message: '密码不能为空' }]}
          >
            <Input.Password placeholder="请输入密码" allowClear />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={submitting}
            className="mt-[20px]"
          >
            登录
          </Button>
        </Form>
      </div>
    </div>
  );
}

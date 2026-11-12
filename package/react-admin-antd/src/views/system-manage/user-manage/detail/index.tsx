import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { App, Button, Form, Input, Spin } from 'antd';
import DetailLayout from '@/layout/detail-layout';
import useLoading from '@/hooks/useLoading';
import { getUserDetail, updateUser } from './api';
import type { UserDetail } from './api/type';

const LIST_PATH = '/system-manage/user-manage/list';
const BASE_PATH = '/system-manage/user-manage';

export default function UserManageDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const userId = String(id ?? '');
  const isEdit = location.pathname.startsWith(`${BASE_PATH}/edit/`);

  const [form] = Form.useForm<UserDetail>();
  /**
   * 进入编辑态时的数据快照, 用于判断是否存在未保存的修改
   */
  const [originalForm, setOriginalForm] = useState<UserDetail>();

  const { isLoading, executor } = useLoading();
  const { isLoading: isSaving, executor: executorSave } = useLoading();
  const { message, modal } = App.useApp();

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const res = await executor(getUserDetail, { id: userId });
        if (!active) return;
        form.setFieldsValue(res.data);
        setOriginalForm({ ...res.data });
      } catch {
        // 请求失败由请求层统一提示
      }
    })();

    return () => {
      active = false;
    };
  }, [userId, executor, form]);

  const isDirty = () => {
    if (!isEdit || !originalForm) return false;
    const { name, phone, email } = form.getFieldsValue();
    return (
      name !== originalForm.name ||
      phone !== originalForm.phone ||
      email !== originalForm.email
    );
  };

  const handleEdit = () => {
    navigate(`${BASE_PATH}/edit/${userId}`);
  };

  const handleSave = async () => {
    const values = await form.validateFields().catch(() => null);
    if (!values) return;

    try {
      await executorSave(updateUser, { ...values, id: userId });
    } catch {
      return;
    }

    message.success('保存成功');
    navigate(LIST_PATH);
  };

  const handleBack = async () => {
    if (isDirty()) {
      const confirmed = await new Promise<boolean>(resolve => {
        modal.confirm({
          title: '提示',
          content: '当前内容尚未保存，确定要返回吗？',
          okText: '确定',
          cancelText: '取消',
          onOk: () => resolve(true),
          onCancel: () => resolve(false),
        });
      });
      if (!confirmed) return;
    }

    navigate(LIST_PATH);
  };

  return (
    <DetailLayout
      operate={
        <>
          {!isEdit ? (
            <Button type="primary" onClick={handleEdit}>
              编辑
            </Button>
          ) : (
            <Button type="primary" loading={isSaving} onClick={handleSave}>
              保存
            </Button>
          )}
          <Button className="ml-2" onClick={handleBack}>
            返回
          </Button>
        </>
      }
    >
      <Spin spinning={isLoading}>
        <Form form={form} labelCol={{ style: { width: 100 } }} disabled={!isEdit}>
          <Form.Item
            label="用户名"
            name="name"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item
            label="手机号"
            name="phone"
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' },
            ]}
          >
            <Input placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item
            label="邮箱"
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入正确的邮箱' },
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>
        </Form>
      </Spin>
    </DetailLayout>
  );
}

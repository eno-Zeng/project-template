import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input, Space, Table, type TableColumnsType } from 'antd';
import ListLayout from '@/layout/list-layout';
import Pagination from '@/components/pagination';
import { useList } from '@/hooks/useList';
import { abortGetUserList, getUserList } from './api';
import type { UserListItem } from './api/type';

interface UserListParams {
  name: string;
  phone: string;
  email: string;
  page: number;
  pageSize: number;
}

const LIST_PATH = '/system-manage/user-manage';

export default function UserManageList() {
  const navigate = useNavigate();

  const {
    params,
    updateParams,
    list,
    isLoading,
    total,
    handleSearch,
    handleReset,
    handleSizeChange,
    handleCurrentChange,
  } = useList<UserListParams, UserListItem>({
    request: {
      api: getUserList,
      abortRequest: abortGetUserList,
      params: {
        name: '',
        phone: '',
        email: '',
        page: 1,
        pageSize: 10,
      },
    },
  });

  const toUserManageDetail = (row: UserListItem) => {
    navigate(`${LIST_PATH}/detail/${row.id}`);
  };

  const toUserManageEdit = (row: UserListItem) => {
    navigate(`${LIST_PATH}/edit/${row.id}`);
  };

  const columns: TableColumnsType<UserListItem> = [
    { title: '用户名', dataIndex: 'name' },
    { title: '手机号', dataIndex: 'phone' },
    { title: '邮箱', dataIndex: 'email' },
    {
      title: '操作',
      key: 'action',
      width: 160,
      render: (_, row) => (
        <Space size={4}>
          <Button type="link" size="small" onClick={() => toUserManageDetail(row)}>
            详情
          </Button>
          <Button type="link" size="small" onClick={() => toUserManageEdit(row)}>
            编辑
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  return (
    <ListLayout
      search={
        <Form layout="inline" onFinish={() => handleSearch()}>
          <Form.Item label="用户名：">
            <Input
              value={params.name}
              onChange={event => updateParams({ name: event.target.value })}
              placeholder="请输入用户名"
            />
          </Form.Item>
          <Form.Item label="手机号：">
            <Input
              value={params.phone}
              onChange={event => updateParams({ phone: event.target.value })}
              placeholder="请输入手机号"
            />
          </Form.Item>
          <Form.Item label="邮箱：">
            <Input
              value={params.email}
              onChange={event => updateParams({ email: event.target.value })}
              placeholder="请输入邮箱"
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                搜索
              </Button>
              <Button type="primary" onClick={() => handleReset()}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      }
      operate={<Button type="primary">添加新用户</Button>}
      footer={
        <Pagination
          total={total}
          current={params.page}
          pageSize={params.pageSize}
          pageSizes={[5, 10, 20, 30, 40]}
          onSizeChange={handleSizeChange}
          onCurrentChange={handleCurrentChange}
        />
      }
    >
      {height => (
        <Table<UserListItem>
          rowKey="id"
          loading={isLoading}
          dataSource={list}
          columns={columns}
          pagination={false}
          scroll={{ y: height }}
          style={{ width: '100%' }}
        />
      )}
    </ListLayout>
  );
}

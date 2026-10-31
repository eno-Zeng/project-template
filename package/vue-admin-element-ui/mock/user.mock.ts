import { url } from 'inspector';
import { defineMock } from 'vite-plugin-mock-dev-server';

const users = [
  { id: 1, name: '张三', role: '管理员', email: 'zhangsan@example.com' },
  { id: 2, name: '李四', role: '编辑', email: 'lisi@example.com' },
  { id: 3, name: '王五', role: '访客', email: 'wangwu@example.com' },
];

export default defineMock({
  url: '/api/user/list',
  method: 'GET',
  body: {
    code: 0,
    message: 'ok',
    data: users,
  },
});

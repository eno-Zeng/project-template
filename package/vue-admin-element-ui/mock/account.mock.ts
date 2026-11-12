import { defineMock } from 'vite-plugin-mock-dev-server';
import Mock from 'mockjs';

export default defineMock([
  {
    url: '/api/login',
    method: 'POST',
    body: {
      code: 200,
      message: '成功',
      data: Mock.Random.paragraph(16),
    },
  },
  {
    url: '/api/logout',
    method: 'POST',
    body: {
      code: 200,
      message: '成功',
      data: null,
    },
  },
  {
    url: '/api/account/user-info',
    method: 'GET',
    body: {
      code: 200,
      message: '成功',
      data: {
        username: Mock.Random.cname(),
      },
    },
  },
]);

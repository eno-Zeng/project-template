import { defineMock } from 'vite-plugin-mock-dev-server';
import Mock from 'mockjs';

const users = Array.from({ length: 10 }, () => ({
  id: Mock.Random.id(),
  name: Mock.Random.cname(),
  phone: Mock.mock(/^1[3-9]\d{9}$/),
  email: Mock.Random.email(),
}));

export default defineMock({
  url: '/api/user/list',
  method: 'GET',
  body: () =>
    new Promise(resolve => {
      setTimeout(() => {
        resolve({
          code: 200,
          message: 'ok',
          data: users,
          pageInfo: {
            total: users.length,
            page: 1,
            pageSize: 10,
          },
        });
      }, 3000);
    }),
});

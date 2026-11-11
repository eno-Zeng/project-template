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
  body: request => {
    const { pageNum, pageSize } = request.query;
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          code: 200,
          message: 'ok',
          data: Array.from({ length: Number(pageSize) || 10 }, () => ({
            id: Mock.Random.id(),
            name: Mock.Random.cname(),
            phone: Mock.mock(/^1[3-9]\d{9}$/),
            email: Mock.Random.email(),
          })),
          pageInfo: {
            total: 1000,
            page: Number(pageNum) || 1,
            pageSize: Number(pageSize) || 10,
          },
        });
      }, 500);
    });
  },
});

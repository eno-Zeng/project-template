import { defineMock } from 'vite-plugin-mock-dev-server';
import Mock from 'mockjs';

interface MockUser {
  id: string;
  name: string;
  phone: string;
  email: string;
}

const createUser = (id?: string): MockUser => ({
  id: id ?? Mock.Random.id(),
  name: Mock.Random.cname(),
  phone: Mock.mock(/^1[3-9]\d{9}$/),
  email: Mock.Random.email(),
});

const userStore = new Map<string, MockUser>();

const getUser = (id: string) => {
  if (!userStore.has(id)) userStore.set(id, createUser(id));
  return userStore.get(id)!;
};

export default defineMock([
  {
    url: '/api/user/list',
    method: 'GET',
    body: request => {
      const { page, pageSize } = request.query;
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            code: 200,
            message: 'ok',
            data: Array.from({ length: Number(pageSize) || 10 }, createUser),
            pageInfo: {
              total: 1000,
              page: Number(page) || 1,
              pageSize: Number(pageSize) || 10,
            },
          });
        }, 500);
      });
    },
  },
  {
    url: '/api/user/detail',
    method: 'GET',
    body: request => {
      const id = String(request.query.id ?? '');
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            code: 200,
            message: 'ok',
            data: getUser(id),
          });
        }, 300);
      });
    },
  },
  {
    url: '/api/user/update',
    method: 'PUT',
    body: request => {
      const { id, name, phone, email } = (request.body ?? {}) as MockUser;
      if (id) userStore.set(id, { id, name, phone, email });
      return {
        code: 200,
        message: '保存成功',
        data: null,
      };
    },
  },
]);

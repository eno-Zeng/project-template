import { defineMock } from 'vite-plugin-mock-dev-server';
import Mock from 'mockjs';

const users = Array.from({ length: 10 }, () => ({
  id: Mock.Random.id(),
  name: Mock.Random.cname(),
  // mockjs 没有 Random.mobile，用自定义规则生成手机号
  phone: Mock.mock(/^1[3-9]\d{9}$/),
  email: Mock.Random.email(),
}));

export default defineMock({
  url: '/api/user/list',
  method: 'GET',
  body: {
    code: 200,
    message: 'ok',
    data: users,
  },
});

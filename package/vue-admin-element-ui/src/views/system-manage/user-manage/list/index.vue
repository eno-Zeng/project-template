<template>
  <div class="p-4">
    <el-table :data="userList" style="width: 100%">
      <el-table-column prop="name" label="用户名" />
      <el-table-column prop="phone" label="手机号" />
      <el-table-column prop="email" label="邮箱" />
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { GetUserListParams, UserListItem } from './api/type';
import { getUserList } from './api';

const getUserListParams = ref<GetUserListParams>({
  name: '',
  phone: '',
  email: '',
  page: 1,
  pageSize: 10,
});

const userList = ref<UserListItem[]>([]);
const fetchUserList = async () => {
  const res = await getUserList(getUserListParams.value);
  userList.value = res.data;
};

onMounted(() => {
  fetchUserList();
});
</script>

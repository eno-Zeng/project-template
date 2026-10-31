<template>
  <main>
    <h1 class="mb-4 text-xl font-bold">Home Page</h1>
    <el-table :data="users" border>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="role" label="角色" />
      <el-table-column prop="email" label="邮箱" />
    </el-table>
    <p v-if="error" class="mt-4 text-red-500">{{ error }}</p>
  </main>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { fetchUserList, type User } from '@/api/user';

const users = ref<User[]>([]);
const error = ref('');

onMounted(async () => {
  try {
    users.value = await fetchUserList();
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e);
  }
});
</script>

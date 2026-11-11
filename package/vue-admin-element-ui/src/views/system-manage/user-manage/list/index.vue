<template>
  <div class="p-4">
    <el-form>
      <el-form-item label="用户名" prop="name">
        <el-input v-model="params.name" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="params.phone" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="params.email" placeholder="请输入邮箱" />
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="handleSearch()">搜索</el-button>

    <el-table v-loading="isLoading" :data="list" style="width: 100%">
      <el-table-column prop="name" label="用户名" />
      <el-table-column prop="phone" label="手机号" />
      <el-table-column prop="email" label="邮箱" />
    </el-table>
    <el-pagination
      v-model="params.page"
      :page-sizes="[10, 20, 30, 40]"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleSearch"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { getUserList } from './api';
import { useList } from '@/hooks/useList';

const { params, list, isLoading, total, handleSearch, handleSizeChange } = useList({
  request: {
    api: getUserList,
    params: {
      name: '',
      phone: '',
      email: '',
      page: 1,
      pageSize: 10,
    },
  },
});

onMounted(() => {
  handleSearch();
});
</script>

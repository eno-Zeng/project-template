<template>
  <list-layout>
    <template #search>
      <div>
        <el-form inline>
          <el-form-item label="用户名：" prop="name">
            <el-input v-model="params.name" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item label="手机号：" prop="phone">
            <el-input v-model="params.phone" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item label="邮箱：" prop="email">
            <el-input v-model="params.email" placeholder="请输入邮箱" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch()">搜索</el-button>
            <el-button type="primary" @click="handleReset()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </template>
    <template #operate>
      <el-button type="primary">添加新用户</el-button>
    </template>
    <template #default="{ height }">
      <el-table v-loading="isLoading" :data="list" style="width: 100%" :max-height="height">
        <el-table-column prop="name" label="用户名" />
        <el-table-column prop="phone" label="手机号" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="text" size="mini" @click="toUserMangeDetail(row)">详情</el-button>
            <el-button type="text" size="mini" @click="toUserMangeEdit(row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>

    <template #footer>
      <pagination
        v-model="params.page"
        v-model:pageSize="params.pageSize"
        :page-sizes="[5, 10, 20, 30, 40]"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleSearch"
      />
    </template>
  </list-layout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { getUserList } from './api';
import { useList } from '@/hooks/useList';
import type { UserListItem } from './api/type';

const { params, list, isLoading, total, handleSearch, handleSizeChange, handleReset } = useList({
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

const toUserMangeDetail = (row: UserListItem) => {
  console.log(row);
};

const toUserMangeEdit = (row: UserListItem) => {
  console.log(row);
};

onMounted(() => {
  handleSearch();
});
</script>

<script lang="ts" setup>
import type { MenuItem } from './type.ts';

defineOptions({
  name: 'MainLayoutAsideMenuItem',
});

defineProps<{
  item: MenuItem;
}>();
</script>

<template>
  <el-sub-menu v-if="item.children.length" :index="item.key">
    <template #title>
      <el-icon><component :is="item.icon" /></el-icon>
      <span>{{ item.title }}</span>
    </template>
    <main-layout-aside-menu-item v-for="child in item.children" :key="child.key" :item="child" />
  </el-sub-menu>
  <el-menu-item v-else :index="item.path">
    <el-icon><component :is="item.icon" /></el-icon>
    <template #title>
      {{ item.title }}
    </template>
  </el-menu-item>
</template>

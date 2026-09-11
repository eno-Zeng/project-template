<template>
  <el-aside
    class="relative h-full w-(--main-layout-aside-width)! overflow-x-hidden overflow-y-auto"
  >
    <el-menu class="h-full" default-active="1-1" mode="vertical" :collapse="isAsideCollapsed">
      <el-sub-menu index="1">
        <template #title> 菜单 1 </template>
        <el-menu-item index="1-1">菜单 1-1</el-menu-item>
        <el-menu-item index="1-2">菜单 1-2</el-menu-item>
      </el-sub-menu>
      <el-menu-item index="2">菜单 2</el-menu-item>
    </el-menu>
    <el-button
      :icon="isAsideCollapsed ? Expand : Fold"
      class="absolute right-[10px] bottom-[10px]"
      @click="$emit('switchCollapse', !isAsideCollapsed)"
    />
  </el-aside>
</template>
<script lang="ts" setup>
import { Expand, Fold } from '@element-plus/icons-vue';

defineProps<{ isAsideCollapsed: boolean }>();

defineEmits<{
  switchCollapse: [boolean];
}>();
</script>

<style lang="scss" scoped></style>

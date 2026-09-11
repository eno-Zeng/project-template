<template>
  <el-header
    class="flex flex-row items-center justify-between bg-(--main-layout-header-bg-color) p-0!"
  >
    <el-space
      :size="10"
      class="flex h-(--main-layout-header-height) w-(--main-layout-aside-width) items-center gap-1 overflow-hidden bg-(--main-layout-logo-container-bg-color) pr-[10px] pl-[10px]"
    >
      <el-image class="w-[40px]" :src="LogoImage"></el-image>
      <h2 v-show="!isAsideCollapsed" class="text-3xl text-amber-50">Project Logo</h2>
    </el-space>
    <el-dropdown trigger="hover" @command="handleDropdownCommand">
      <div class="mr-5 rounded-sm border">
        <el-icon :size="40"><user-filled /></el-icon>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="logout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </el-header>
</template>
<script lang="ts" setup>
import LogoImage from '@/assets/logo.svg';
import { UserFilled } from '@element-plus/icons-vue';

defineProps<{ isAsideCollapsed: boolean }>();

const handleDropdownCommand = (command: string) => {
  console.log(command);
};
</script>

<style lang="scss" scoped></style>

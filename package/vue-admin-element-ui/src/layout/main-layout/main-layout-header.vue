<template>
  <el-header
    class="flex flex-row items-center justify-between border-b border-b-(--a-color-border-3)! p-0!"
  >
    <el-space
      :size="20"
      class="flex h-(--main-layout-header-height) w-(--main-layout-aside-width) items-center gap-1 overflow-hidden border-r border-r-(--a-color-border-3)! pr-[10px] pl-[10px]"
    >
      <el-image class="w-[40px]" :src="LogoImage"></el-image>
      <h2 v-show="!isAsideCollapsed" class="text-3xl">管理系统</h2>
    </el-space>
    <el-dropdown trigger="hover" @command="handleDropdownCommand">
      <div
        class="mr-[20px] flex size-[40px] items-center justify-center rounded-full border border-(--a-color-border-3)"
      >
        <el-icon :size="28"><avatar /></el-icon>
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
import { useAccountStore } from '@/stores/account';
import { Avatar } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';

defineProps<{ isAsideCollapsed: boolean }>();

const { logout } = useAccountStore();

const router = useRouter();

const handleDropdownCommand = (command: string) => {
  switch (command) {
    case 'logout':
      logout();
      router.push({ name: 'Login' });
      break;

    default:
      break;
  }
};
</script>

<style lang="scss" scoped></style>

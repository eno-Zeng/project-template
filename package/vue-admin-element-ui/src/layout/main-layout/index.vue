<template>
  <el-container
    v-loading="appStore.isLoading"
    element-loading-background="rgba(0, 0, 0, 0.5)"
    element-loading-text="加载中..."
    class="main-layout flex h-full w-full overflow-hidden bg-(--a-color-bg-1)"
    :class="{ collapsed: isAsideCollapsed }"
    direction="vertical"
  >
    <main-layout-heder :is-aside-collapsed="isAsideCollapsed" />
    <main class="flex flex-1 flex-row overflow-hidden p-0">
      <main-layout-aside
        :is-aside-collapsed="isAsideCollapsed"
        @switch-collapse="isAsideCollapsed = $event"
      />
      <el-main class="flex-1 overflow-auto bg-(--a-color-bg-2-ff)">
        <router-view></router-view>
      </el-main>
    </main>
  </el-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import MainLayoutHeder from './main-layout-header.vue';
import MainLayoutAside from './main-layout-aside.vue';
import { useAppStore } from '@/stores/app.ts';

const isAsideCollapsed = ref(false);

const appStore = useAppStore();
</script>

<style lang="scss" scoped>
.main-layout {
  --main-layout-header-height: 60px;
  --main-layout-header-bg-color: #79bbff;
  --main-layout-logo-container-bg-color: #11ab28;
  --main-layout-aside-width: 256px;
  &.collapsed {
    --main-layout-aside-width: 64px;
  }
}
</style>

<script lang="ts">
export default {
  name: 'main-layout',
};
</script>

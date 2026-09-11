<template>
  <el-container
    class="main-layout w-full h-full flex flex-col"
    :class="{ collapsed: isAsideCollapsed }"
    direction="vertical"
  >
    <main-layout-heder :is-aside-collapsed="isAsideCollapsed" />
    <main class="flex flex-1 flex-row p-0">
      <main-layout-aside
        :is-aside-collapsed="isAsideCollapsed"
        @switch-collapse="isAsideCollapsed = $event"
      />
      <el-main class="flex-1 overflow-auto">
        <router-view></router-view>
      </el-main>
    </main>
  </el-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import MainLayoutHeder from './main-layout-header.vue';
import MainLayoutAside from './main-layout-aside.vue';

const isAsideCollapsed = ref(false);
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

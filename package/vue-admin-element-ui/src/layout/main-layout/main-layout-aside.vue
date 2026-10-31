<template>
  <el-aside
    class="main-layout-aside bx relative h-full w-(--main-layout-aside-width)! overflow-x-hidden overflow-y-auto"
  >
    <el-menu
      class="h-full"
      mode="vertical"
      router
      :collapse="isAsideCollapsed"
      :default-active="getActiveMenu()"
    >
      <main-layout-aside-menu-item v-for="item in menuItems" :key="item.key" :item="item" />
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
import type { RouteRecordRaw } from 'vue-router';
import { useRoute } from 'vue-router';
import { modules } from '@/router/constant';
import MainLayoutAsideMenuItem from './main-layout-aside-menu-item.vue';
import type { IRoute } from '@/router/type.ts';
import type { MenuItem } from './type.ts';

defineProps<{ isAsideCollapsed: boolean }>();

defineEmits<{
  switchCollapse: [boolean];
}>();

const route = useRoute();

const getRouteMenuPath = (record: Pick<RouteRecordRaw, 'path' | 'redirect'>) => {
  if (typeof record.redirect === 'string') return record.redirect;
  return record.path;
};

const buildRouteMenus = (routes: readonly RouteRecordRaw[]): MenuItem[] => {
  return routes
    .filter(record => record.meta?.isMenu)
    .flatMap(record => {
      const children = Array.isArray(record.children) ? buildRouteMenus(record.children) : [];
      const meta = (record.meta ?? {}) as IRoute['meta'];

      return [
        {
          key: String(record.name ?? record.path),
          title: meta.title,
          path: record.path,
          name: record.name as string,
          icon: meta.icon,
          children,
        },
      ];
    });
};

const menuItems = buildRouteMenus(modules);

const getActiveMenu = () => {
  const currentMenuRoute = [...route.matched].reverse().find(record => record.meta.isMenu);

  return currentMenuRoute ? getRouteMenuPath(currentMenuRoute) : route.path;
};
</script>

<style lang="scss" scoped>
.main-layout-aside {
  --el-menu-bg-color: var(--a-color-bg-1);
}
</style>

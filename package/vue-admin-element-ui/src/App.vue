<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
  <!-- 以 route.path 作为 key: 同组件不同路由(如 detail/1 -> detail/2、detail -> edit)切换时重新挂载, 避免复用旧数据 -->
  <RouterView v-slot="{ Component, route }">
    <component :is="Component" :key="route.path" />
  </RouterView>
</template>

<style scoped></style>

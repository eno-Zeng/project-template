<template>
  <div class="main-layout">
    <header></header>
    <main>
      <aside></aside>
      <main>
        <router-view></router-view>
      </main>
    </main>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped></style>

<script lang="ts">
export default {
  name: 'main-layout',
};
</script>

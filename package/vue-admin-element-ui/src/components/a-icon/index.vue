<template>
  <el-icon v-bind="{ ...$props, ...$attrs, ...props }" />
</template>
<script lang="ts" setup>
const props = defineProps({});
</script>

<style lang="scss" scoped></style>

<script lang="ts">
export default {
  name: 'AIcon',
};
</script>

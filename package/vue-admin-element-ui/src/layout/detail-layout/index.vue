<template>
  <div class="flex h-full w-full flex-col">
    <div
      class="height-[60px] mb-2 flex shrink-0 items-center justify-end border-b border-b-(--a-color-border-3) pb-2"
    >
      <slot name="operate" />
    </div>
    <div class="flex-1 overflow-auto">
      <slot />
    </div>
    <div v-if="$slots.footer" class="shrink-0 border-t border-t-(--a-color-border-3) pt-2">
      <slot name="footer" />
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<script lang="ts">
export default {
  name: 'DetailLayout',
};
</script>

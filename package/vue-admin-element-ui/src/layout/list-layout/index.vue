<template>
  <div ref="layoutRef" class="h-full w-full">
    <div v-if="$slots.search" ref="searchRef" class="pb-2">
      <slot name="search" />
    </div>
    <div v-if="$slots.operate" ref="operateRef" class="pb-2">
      <slot name="operate" />
    </div>
    <div class="overflow-auto" :style="{ height: containerHeight }">
      <slot :height="containerHeight" />
    </div>
    <div v-if="$slots.footer" ref="footerRef" class="pt-2">
      <slot name="footer" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, onBeforeUnmount, defineProps } from 'vue';
import { debounce } from 'lodash-es';

defineProps({});

const layoutRef = ref<HTMLDivElement>();
const footerRef = ref<HTMLDivElement>();
const searchRef = ref<HTMLDivElement>();
const operateRef = ref<HTMLDivElement>();

const containerHeight = ref('0px');

const computedContainerHeight = debounce(() => {
  const layoutHight = layoutRef.value?.getBoundingClientRect().height || 0;
  const footerHight = footerRef.value?.getBoundingClientRect().height || 0;
  const searchHight = searchRef.value?.getBoundingClientRect().height || 0;
  const operateHight = operateRef.value?.getBoundingClientRect().height || 0;

  containerHeight.value = `${layoutHight - footerHight - searchHight - operateHight - 8}px`;
});

/**
 * 监听窗口大小变化
 * 场景: list-layout 从 disable: none 到 block 状态时触发高度计算
 */
const resizeObserver = new ResizeObserver(() => {
  computedContainerHeight();
});
onMounted(() => {
  computedContainerHeight();
  window.addEventListener('resize', computedContainerHeight);
  resizeObserver.observe(layoutRef.value!);
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', computedContainerHeight);
  resizeObserver.unobserve(layoutRef.value!);
});
</script>

<script lang="ts">
export default {
  name: 'ListLayout',
};
</script>

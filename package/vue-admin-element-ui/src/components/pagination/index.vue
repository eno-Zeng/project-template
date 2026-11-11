<template>
  <div class="flex justify-end">
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="pageSizes"
      :total="total"
      :layout="layout"
      :background="background"
      :disabled="disabled"
    />
  </div>
</template>

<script lang="ts" setup>
import { watch } from 'vue';

withDefaults(
  defineProps<{
    total: number;
    pageSizes?: number[];
    layout?: string;
    background?: boolean;
    disabled?: boolean;
  }>(),
  {
    pageSizes: () => [10, 20, 30, 40],
    layout: 'total, sizes, prev, pager, next',
    background: true,
    disabled: false,
  }
);

const emit = defineEmits<{
  (e: 'size-change', value: number): void;
  (e: 'current-change', page: number): void;
}>();

const currentPage = defineModel<number>({ default: 1, required: true });
const pageSize = defineModel<number>('pageSize', { default: 10 });

watch(currentPage, newVal => {
  emit('current-change', newVal);
});

watch(pageSize, newVal => {
  emit('size-change', newVal);
});
</script>

<script lang="ts">
export default {
  name: 'Pagination',
};
</script>

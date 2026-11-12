import type { AsyncFunction } from '@/type';
import { computed, ref } from 'vue';

export default function useLoading() {
  const loadingCount = ref(0);
  const isLoading = computed(() => loadingCount.value > 0);

  const setLoadingCount = (value: number) => {
    loadingCount.value = Math.max(value, 0);
  };

  const openLoading = () => {
    setLoadingCount(loadingCount.value + 1);
  };

  const closeLoading = () => {
    setLoadingCount(loadingCount.value - 1);
  };

  // 执行器, 执行传入的函数, 并自动管理 loading 状态
  const executor = async <T extends AsyncFunction>(
    execFunc: T,
    ...args: Parameters<T>
  ): Promise<ReturnType<T>> => {
    openLoading();
    try {
      const result = await execFunc(...args);
      return result;
    } finally {
      closeLoading();
    }
  };

  // 手动关闭 loading
  const close = () => {
    loadingCount.value = 0;
  };

  return { isLoading, executor, close, openLoading, closeLoading };
}

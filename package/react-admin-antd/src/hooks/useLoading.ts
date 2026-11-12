import { useCallback, useState } from 'react';

export default function useLoading() {
  const [loadingCount, setLoadingCount] = useState(0);
  const isLoading = loadingCount > 0;

  const openLoading = useCallback(() => {
    setLoadingCount(count => count + 1);
  }, []);

  const closeLoading = useCallback(() => {
    setLoadingCount(count => Math.max(count - 1, 0));
  }, []);

  // 执行器, 执行传入的函数, 并自动管理 loading 状态
  const executor = useCallback(
    async <A extends any[], R>(execFunc: (...args: A) => Promise<R>, ...args: A): Promise<R> => {
      openLoading();
      try {
        return await execFunc(...args);
      } finally {
        closeLoading();
      }
    },
    [openLoading, closeLoading]
  );

  // 手动关闭 loading
  const close = useCallback(() => {
    setLoadingCount(0);
  }, []);

  return { isLoading, loadingCount, executor, close, openLoading, closeLoading };
}

import { create } from 'zustand';

interface AppState {
  loadingCount: number;
  openLoading: () => void;
  closeLoading: () => void;
  executorLoading: <A extends any[], R>(
    execFunc: (...args: A) => Promise<R>,
    ...args: A
  ) => Promise<R>;
}

export const useAppStore = create<AppState>(set => ({
  loadingCount: 0,

  openLoading: () => set(state => ({ loadingCount: state.loadingCount + 1 })),

  closeLoading: () => set(state => ({ loadingCount: Math.max(state.loadingCount - 1, 0) })),

  // 全局执行器, 执行传入的函数, 并自动管理全局 loading 状态
  executorLoading: async <A extends any[], R>(
    execFunc: (...args: A) => Promise<R>,
    ...args: A
  ): Promise<R> => {
    set(state => ({ loadingCount: state.loadingCount + 1 }));
    try {
      return await execFunc(...args);
    } finally {
      set(state => ({ loadingCount: Math.max(state.loadingCount - 1, 0) }));
    }
  },
}));

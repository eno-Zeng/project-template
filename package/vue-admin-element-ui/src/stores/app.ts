import { defineStore } from 'pinia';
import useLoading from '@/hooks/useLoading';

export const useAppStore = defineStore('app', () => {
  const { isLoading, openLoading, closeLoading, executor } = useLoading();

  return { isLoading, openLoading, closeLoading, executorLoading: executor };
});

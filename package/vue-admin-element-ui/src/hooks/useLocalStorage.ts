import { ref, watch } from 'vue';

export const useLocalStorage = <T = any>(key: string, defaultValue: T) => {
  const value = ref(defaultValue);

  const init = () => {
    const item = localStorage.getItem(key);
    if (item !== null) {
      try {
        value.value = JSON.parse(item);
      } catch (error) {
        console.error('[useLocalStorage] 数据解析失败:', error);
      }
    }
  };
  init();

  watch(
    value,
    newValue => {
      try {
        localStorage.setItem(key, JSON.stringify(newValue));
      } catch (error) {
        console.error(`[useLocalStorage] 写入 ${key} 失败:`, error);
      }
    },
    { deep: true }
  );

  return value;
};

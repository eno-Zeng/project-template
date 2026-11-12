import { useCallback, useEffect, useState } from 'react';

export function useLocalStorage<T = any>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;

    try {
      return JSON.parse(item) as T;
    } catch (error) {
      console.error('[useLocalStorage] 数据解析失败:', error);
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`[useLocalStorage] 写入 ${key} 失败:`, error);
    }
  }, [key, value]);

  const reset = useCallback(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  return [value, setValue, reset] as const;
}

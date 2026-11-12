/**
 * 用于创建一个可重复使用的 abort 控制器
 * 由于 AbortController 是不可重复使用, 当同一个请求或函数多次调用时,每次都要创建新的 AbortController
 * useAbort 创建一个可重复使用的 abortKey, 每次 setItem 会创建或增加对应的 AbortController 的 count
 * 每次 removeItem 会减少或删除对应的 AbortController 的 count
 * 每次 abort 会调用对应的 AbortController 的 abort 方法并删除对应的 AbortController
 * 同一个请求使用同一个 abortKey, 不仅可以让在同一个请求使用同一个 abortController, 还可以再下一次请求中自动生成新的 abortController
 */
import { nanoid } from 'nanoid';

interface AbortControllerRecordItem {
  count: number;
  controller: AbortController;
}

export default () => {
  const abortControllerRecord: Record<symbol, AbortControllerRecordItem> = {};

  const getAbortKey = () => {
    return Symbol(nanoid());
  };

  const getAbortControllerSignal = (key: symbol) => {
    return abortControllerRecord[key]?.controller.signal;
  };

  const setItem = (key: symbol) => {
    const abortControllerItem = abortControllerRecord[key];
    abortControllerRecord[key] = {
      count: (abortControllerItem?.count || 0) + 1,
      controller: abortControllerItem?.controller || new AbortController(),
    };
  };

  const removeItem = (key: symbol) => {
    const abortControllerItem = abortControllerRecord[key];
    if (!abortControllerItem) return;
    abortControllerItem.count -= 1;
    if (abortControllerItem.count <= 0) delete abortControllerRecord[key];
  };

  const abort = (key: symbol) => {
    const abortControllerItem = abortControllerRecord[key];
    if (!abortControllerItem) return;
    abortControllerItem.controller.abort();
    delete abortControllerRecord[key];
  };

  return {
    getAbortKey,
    getAbortControllerSignal,
    setItem,
    removeItem,
    abort,
  };
};

/**
 * 函数类型
 */
export type AnyFunction = (...args: any[]) => any;

/**
 * 异步函数
 */
export type AsyncFunction<T extends AnyFunction = AnyFunction> = (
  ...args: Parameters<T>
) => Promise<ReturnType<T>>;

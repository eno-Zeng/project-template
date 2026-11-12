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

/**
 * 将可选类型变成 readonly 类型
 * 深度添加 readonly
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

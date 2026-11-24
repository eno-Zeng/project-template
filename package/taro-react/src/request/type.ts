export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

/** 后端 / 云函数统一响应结构 */
export interface ResponseData<T = unknown> {
  code: number;
  message: string;
  data: T;
}

export interface RequestConfig {
  /** 请求地址，支持相对路径（自动拼接 baseURL）与完整 URL */
  url: string;
  /** 请求方法，默认 GET */
  method?: RequestMethod;
  /** 请求体，GET 请求的参数请使用 params */
  data?: Record<string, unknown>;
  /** URL 查询参数，自动序列化到地址上 */
  params?: Record<string, unknown>;
  /** 自定义请求头 */
  header?: Record<string, string>;
  /** 超时时间（毫秒），默认 15000 */
  timeout?: number;
  /** 为 true 时不再弹出错误提示 */
  silent?: boolean;
  /** 为 true 时展示全局 loading */
  loading?: boolean;
  /** loading 文案，默认「加载中」 */
  loadingText?: string;
}

/** 快捷方法配置，url 与 method 由快捷方法内部指定 */
export type RequestOptions = Omit<RequestConfig, 'url' | 'method'>;

export type METHOD = 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH';

export interface RequestConfig extends Omit<RequestInit, 'body'> {
  url: string;
  isLoading?: boolean;
  method?: METHOD;
  data?: Record<string, any>;
  params?: Record<string, any>;
  abortKey?: symbol;
}

/** 分页信息 (仅分页接口返回) */
export interface PageInfo {
  /** 当前页码 */
  page: number;
  /** 每页条数 */
  pageSize: number;
  /** 总条数 */
  total: number;
}

export interface ResponseData<T = unknown> {
  code: number;
  message: string;
  data: T;
  pageInfo?: PageInfo;
}

export type METHOD = 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH';

export interface RequestConfig extends Omit<RequestInit, 'body'> {
  url: string;
  isLoading?: boolean;
  method?: METHOD;
  data?: Record<string, any>;
  params?: Record<string, any>;
}

export interface ResponseData<T = unknown> {
  code: number;
  message: string;
  data: T;
}

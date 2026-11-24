import Taro from '@tarojs/taro';
import type { RequestConfig, RequestOptions, ResponseData } from './type';

/** 接口基础地址，可通过环境变量 TARO_APP_BASE_URL 配置 */
const BASE_URL = process.env.TARO_APP_BASE_URL || '';
const DEFAULT_TIMEOUT = 15000;

/** 业务错误 / 传输层错误 */
export class RequestError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: number,
  ) {
    super(message);
    this.name = 'RequestError';
  }
}

/** loading 计数，避免并发请求时提前关闭 */
let loadingCount = 0;

const showLoading = (title: string) => {
  loadingCount += 1;
  if (loadingCount === 1) {
    Taro.showLoading({ title, mask: true });
  }
};

const hideLoading = () => {
  loadingCount = Math.max(loadingCount - 1, 0);
  if (loadingCount === 0) {
    Taro.hideLoading();
  }
};

/** 拼接 baseURL，完整 URL 直接返回 */
const resolveUrl = (url: string): string => {
  if (/^https?:\/\//.test(url)) {
    return url;
  }
  return `${BASE_URL.replace(/\/+$/, '')}/${url.replace(/^\/+/, '')}`;
};

/** 序列化查询参数，跳过空值并支持数组 */
const stringifyParams = (params?: Record<string, unknown>): string => {
  if (!params) {
    return '';
  }

  const parts: string[] = [];
  Object.keys(params).forEach((key) => {
    const value = params[key];
    if (value === undefined || value === null) {
      return;
    }

    const values = Array.isArray(value) ? value : [value];
    values.forEach((item) => {
      if (item === undefined || item === null) {
        return;
      }
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(item))}`);
    });
  });

  return parts.join('&');
};

const createRequestUrl = (url: string, params?: Record<string, unknown>): string => {
  const fullUrl = resolveUrl(url);
  const query = stringifyParams(params);
  if (!query) {
    return fullUrl;
  }
  return `${fullUrl}${fullUrl.includes('?') ? '&' : '?'}${query}`;
};

/**
 * 统一请求封装
 * - 统一处理 baseURL、查询参数、超时与错误提示
 * - 业务码 code === 0 视为成功，否则抛出 RequestError
 */
export async function request<T = unknown>(config: RequestConfig): Promise<ResponseData<T>> {
  const {
    url,
    method = 'GET',
    data,
    params,
    header,
    timeout = DEFAULT_TIMEOUT,
    silent = false,
    loading = false,
    loadingText = '加载中',
  } = config;

  const fullUrl = createRequestUrl(url, params);
  const hasBody = method !== 'GET';

  if (loading) {
    showLoading(loadingText);
  }

  try {
    const res = await Taro.request({
      url: fullUrl,
      method,
      data: hasBody ? data : undefined,
      header,
      timeout,
    });

    if (res.statusCode < 200 || res.statusCode >= 300) {
      throw new RequestError(`请求失败（HTTP ${res.statusCode}）`, res.statusCode);
    }

    const result = res.data as ResponseData<T>;
    if (result?.code !== 0) {
      throw new RequestError(result?.message || '请求失败', res.statusCode, result?.code);
    }

    return result;
  } catch (error) {
    const requestError =
      error instanceof RequestError ? error : new RequestError('网络异常，请稍后重试');

    if (!silent) {
      Taro.showToast({ title: requestError.message, icon: 'none' });
    }
    throw requestError;
  } finally {
    if (loading) {
      hideLoading();
    }
  }
}

export const get = <T = unknown>(
  url: string,
  options: Omit<RequestOptions, 'data'> = {},
) => request<T>({ ...options, url, method: 'GET' });

export const post = <T = unknown>(
  url: string,
  data?: Record<string, unknown>,
  options: RequestOptions = {},
) => request<T>({ ...options, url, method: 'POST', data });

export const put = <T = unknown>(
  url: string,
  data?: Record<string, unknown>,
  options: RequestOptions = {},
) => request<T>({ ...options, url, method: 'PUT', data });

export const patch = <T = unknown>(
  url: string,
  data?: Record<string, unknown>,
  options: RequestOptions = {},
) => request<T>({ ...options, url, method: 'PATCH', data });

export const del = <T = unknown>(
  url: string,
  options: Omit<RequestOptions, 'data'> = {},
) => request<T>({ ...options, url, method: 'DELETE' });

export default request;

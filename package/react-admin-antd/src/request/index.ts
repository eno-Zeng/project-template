import { message } from 'antd';
import qs from 'query-string';
import { useAccountStore } from '@/stores/account';
import { useAppStore } from '@/stores/app';
import useAbort from '@/hooks/useAbort';
import type { METHOD, RequestConfig, ResponseData } from './type';

const abort = useAbort();

const getIsUrlParams = (method?: METHOD) => {
  const _method = method || 'GET';
  return ['GET', 'DELETE'].includes(_method);
};

/** 判断是否为请求被主动取消产生的错误 */
const isAbortError = (error: unknown): boolean =>
  error instanceof DOMException && error.name === 'AbortError';

/** 传输层错误 (HTTP 状态码非 2xx) */
class HttpError extends Error {
  constructor(public status: number) {
    super(`请求失败: HTTP ${status}`);
    this.name = 'HttpError';
  }
}

/** 业务层错误 (HTTP 200 但 code 非 200) */
class BusinessError extends Error {
  constructor(
    public code: number,
    public serverMessage: string
  ) {
    super(`请求失败: code ${code}, message ${serverMessage}`);
    this.name = 'BusinessError';
  }
}

const createRequest = (config: RequestConfig): Request => {
  const { url, data, params, ...others } = config;

  // 处理参数
  const isUrlParams = getIsUrlParams(others.method);
  let fullUrl = url;
  let requestBody: string | undefined;
  if (isUrlParams && params) {
    fullUrl = `${url}?${qs.stringify(params)}`;
  } else {
    requestBody = data && JSON.stringify(data);
  }

  const request = new Request(fullUrl, { ...others, body: requestBody });

  // 仅在携带请求体时设置 Content-Type, 避免 GET 等无 body 请求产生多余的跨域预检
  if (requestBody !== undefined && !request.headers.has('Content-Type')) {
    request.headers.set('Content-Type', 'application/json;charset=utf-8');
  }

  // 处理 token
  const token = useAccountStore.getState().getToken();
  if (token) {
    request.headers.set('Authorization', `Bearer ${token}`);
  }

  return request;
};

/** 401: 清理本地登录态并跳转登录页 */
const handleUnauthorized = () => {
  useAccountStore.getState().clearAccount();
  if (window.location.hash !== '#/login') {
    window.location.hash = '#/login';
  }
};

/** 校验响应, 异常时抛出对应类型的错误, 由 handleError 统一处理 */
const handleResponse = async <T>(response: Response): Promise<ResponseData<T>> => {
  if (!response.ok) throw new HttpError(response.status);

  const data: ResponseData<T> = await response.json();
  if (data.code !== 200) throw new BusinessError(data.code, data.message);

  return data;
};

/** 统一错误处理: 主动取消静默中断, 401 清理登录态并跳转登录页, 其他错误提示后抛出 */
const handleError = async (error: unknown): Promise<never> => {
  // 主动取消: 直接抛出, 调用方无需感知取消事件
  if (isAbortError(error)) {
    return Promise.reject(error);
  }

  // 登录失效 (传输层 401 或业务码 401)
  if (
    (error instanceof HttpError && error.status === 401) ||
    (error instanceof BusinessError && error.code === 401)
  ) {
    handleUnauthorized();
    message.error('登录状态已失效，请重新登录');
    throw error;
  }

  // 业务错误: 提示服务端返回的 message
  if (error instanceof BusinessError) {
    message.error(error.serverMessage);
    throw error;
  }

  // HTTP 错误: 提示状态码
  if (error instanceof HttpError) {
    message.error(error.message);
    throw error;
  }

  // 网络异常等其他失败
  message.error('网络异常，请检查网络后重试');
  throw error;
};

/** 执行请求并统一处理错误 */
const execute = async <T>(config: RequestConfig, isLoading?: boolean): Promise<ResponseData<T>> => {
  try {
    const doFetch = () => fetch(createRequest(config));
    const response = await (isLoading ? useAppStore.getState().executorLoading(doFetch) : doFetch());
    return await handleResponse<T>(response);
  } catch (error) {
    return handleError(error);
  }
};

/** abort 生命周期管理: 挂 signal 并加计数, 执行结束(成功/失败/取消)后释放计数 */
const withAbort = async <T>(
  config: RequestConfig,
  abortKey: symbol | undefined,
  exec: () => Promise<T>
): Promise<T> => {
  if (!abortKey) return exec();

  abort.setItem(abortKey);
  config.signal = abort.getAbortControllerSignal(abortKey);
  try {
    return await exec();
  } finally {
    abort.removeItem(abortKey);
  }
};

export default function request<T>(config: RequestConfig | string): Promise<ResponseData<T>> {
  const { isLoading, abortKey, ..._config }: RequestConfig =
    typeof config === 'string' ? { url: config } : { ...config };

  return withAbort(_config, abortKey, () => execute<T>(_config, isLoading));
}

export const createAbort = (): [symbol, () => void] => {
  const abortKey = abort.getAbortKey();
  return [abortKey, () => abort.abort(abortKey)];
};

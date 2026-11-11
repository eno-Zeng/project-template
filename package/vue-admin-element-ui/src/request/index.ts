import { useAppStore } from '@/stores/app';
import type { METHOD, RequestConfig, ResponseData } from './type';
import { ElMessage } from 'element-plus';
import qs from 'query-string';
import { useAccountStore } from '@/stores/account';
import useAbort from '../hooks/useAbort';

let accountStore: ReturnType<typeof useAccountStore>;
const getAccountStore = () => {
  if (!accountStore) accountStore = useAccountStore();
  return accountStore;
};

let appStore: ReturnType<typeof useAppStore>;
const getAppStore = () => {
  if (!appStore) appStore = useAppStore();
  return appStore;
};

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
  const { getToken } = getAccountStore();
  const token = getToken();
  if (token) {
    request.headers.set('Authorization', `Bearer ${token}`);
  }

  return request;
};

/** 401: 清理本地登录态并跳转登录页 (动态引入 router, 避免与 request 产生循环依赖) */
const handleUnauthorized = async () => {
  getAccountStore().clearAccount();
  const { default: router } = await import('@/router');
  if (router.currentRoute.value.name !== 'Login') {
    await router.replace({ name: 'Login' });
  }
};

/** 校验响应, 异常时抛出对应类型的错误, 由 handleError 统一处理 */
const handleResponse = async <T>(
  response: Response,
  _config: RequestConfig
): Promise<ResponseData<T>> => {
  if (!response.ok) throw new HttpError(response.status);

  const data: ResponseData<T> = await response.json();
  if (data.code !== 200) throw new BusinessError(data.code, data.message);

  return data;
};

/** 统一错误处理: 主动取消静默中断, 401 清理登录态并跳转登录页, 其他错误提示后抛出 */
const handleError = async (error: unknown): Promise<never> => {
  // 主动取消: 返回永不 settle 的 Promise
  // 调用方无需感知取消事件, 不会产生 unhandled rejection, 也不会继续执行后续逻辑
  if (isAbortError(error)) {
    return Promise.reject(error);
  }

  // 登录失效 (传输层 401 或业务码 401)
  if (
    (error instanceof HttpError && error.status === 401) ||
    (error instanceof BusinessError && error.code === 401)
  ) {
    await handleUnauthorized();
    ElMessage.error('登录状态已失效，请重新登录');
    throw error;
  }

  // 业务错误: 提示服务端返回的 message
  if (error instanceof BusinessError) {
    ElMessage.error(error.serverMessage);
    throw error;
  }

  // HTTP 错误: 提示状态码
  if (error instanceof HttpError) {
    ElMessage.error(error.message);
    throw error;
  }

  // 网络异常等其他失败
  ElMessage.error('网络异常，请检查网络后重试');
  throw error;
};

export default async <T>(config: RequestConfig | string): Promise<ResponseData<T>> => {
  const { isLoading, abortKey, ..._config }: RequestConfig =
    typeof config === 'string' ? { url: config } : { ...config };

  const appStore = getAppStore();

  try {
    // 处理 abortKey: 与 finally 中的 removeItem 成对, 计数生命周期统一在此函数内管理
    if (abortKey) {
      abort.setItem(abortKey);
      _config.signal = abort.getAbortControllerSignal(abortKey);
    }

    const request = createRequest(_config);

    const response = await (isLoading
      ? appStore.executorLoading(() => fetch(request))
      : fetch(request));
    return await handleResponse<T>(response, _config);
  } catch (error) {
    return handleError(error);
  } finally {
    // 成功、失败、取消都释放 abort 计数, 避免泄漏
    if (abortKey) {
      abort.removeItem(abortKey);
    }
  }
};

export const createAbort = (): [symbol, () => void] => {
  const abortKey = abort.getAbortKey();
  return [abortKey, () => abort.abort(abortKey)];
};

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

const abort = useAbort();

const getIsUrlParams = (method?: METHOD) => {
  const _method = method || 'GET';
  return ['GET', 'DELETE'].includes(_method);
};

const createRequest = (config: RequestConfig): Request => {
  const { url, data, params, abortKey, ...others } = config;

  // 处理参数
  const isUrlParams = getIsUrlParams(others.method);
  let fullUrl = url;
  let requestBody: string | undefined;
  if (isUrlParams && params) {
    fullUrl = `${url}?${qs.stringify(params)}`;
  } else {
    requestBody = data && JSON.stringify(data);
  }

  // 处理 abortKey
  if (abortKey) {
    abort.setItem(abortKey);
    others.signal = abort.getAbortControllerSignal(abortKey);
  }

  const request = new Request(fullUrl, { ...others, body: requestBody });

  // 处理 Content-Type
  if (!request.headers.has('Content-Type'))
    request.headers.set('Content-Type', 'application/json;charset=utf-8');

  // 处理 token
  const { getToken } = getAccountStore();
  const token = getToken();
  if (token) {
    request.headers.set('Authorization', `Bearer ${token}`);
  }

  return request;
};

const handleResponse = async <T>(
  response: Response,
  requestConfig: RequestConfig
): Promise<ResponseData<T>> => {
  // 处理 abortKey
  if (requestConfig.abortKey) {
    abort.removeItem(requestConfig.abortKey);
  }

  if (!response.ok) throw new Error(`请求失败: HTTP ${response.status}`);

  const data: ResponseData<T> = await response.json();

  if (data.code !== 200) {
    ElMessage.error(data.message);
    throw new Error(`请求失败: code ${data.code}, message ${data.message}`);
  }

  return data;
};

export default async <T>(config: RequestConfig | string): Promise<ResponseData<T>> => {
  const { isLoading, ..._config }: RequestConfig =
    typeof config === 'string' ? { url: config } : { ...config };

  const appStore = useAppStore();

  const request = createRequest(_config);

  const response = await (isLoading
    ? appStore.executorLoading(() => fetch(request))
    : fetch(request));

  return handleResponse(response, _config);
};

export const createAbort = (): [symbol, () => void] => {
  const abortKey = abort.getAbortKey();
  return [abortKey, () => abort.abort(abortKey)];
};

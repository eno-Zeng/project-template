import { useAppStore } from '@/stores/app';
import type { METHOD, RequestConfig, ResponseData } from './type';
import { ElMessage } from 'element-plus';
import qs from 'query-string';

const getIsUrlParams = (method?: METHOD) => {
  const _method = method || 'GET';
  return ['GET', 'DELETE'].includes(_method);
};

const createRequest = (config: RequestConfig): Request => {
  const { url, isLoading, data, params, ...others } = config;

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

  // 处理 Content-Type
  if (!request.headers.has('Content-Type'))
    request.headers.set('Content-Type', 'application/json;charset=utf-8');

  // TODO: 处理 token

  return request;
};

const handleResponse = async <T>(response: Response): Promise<ResponseData<T>> => {
  if (!response.ok) throw new Error(`请求失败: HTTP ${response.status}`);

  const data: ResponseData<T> = await response.json();

  if (data.code !== 200) {
    ElMessage.error(data.message);
    throw new Error(`请求失败: code ${data.code}, message ${data.message}`);
  }

  return data;
};

export default async <T>(config: RequestConfig | string): Promise<ResponseData<T>> => {
  const _config: RequestConfig = typeof config === 'string' ? { url: config } : { ...config };

  const appStore = useAppStore();

  const request = createRequest(_config);

  const response = await appStore.executorLoading(() => fetch(request));

  return handleResponse(response);
};

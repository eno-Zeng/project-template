const BASE_URL = '/api';

export interface ApiResult<T> {
  code: number;
  message: string;
  data: T;
}

export class RequestError extends Error {
  readonly status: number | undefined;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'RequestError';
    this.status = status;
  }
}

export async function request<T>(url: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${BASE_URL}${url}`, { ...init, headers });

  if (!response.ok) {
    throw new RequestError(`请求失败：HTTP ${response.status}`, response.status);
  }

  const result = (await response.json()) as ApiResult<T>;

  if (result.code !== 0) {
    throw new RequestError(result.message);
  }

  return result.data;
}

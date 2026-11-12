import { type Ref, ref, watch } from 'vue';
import { get, cloneDeep, debounce } from 'lodash-es';
import type { ResponseData } from '@/request/type';
import useLoading from './useLoading';
import type { DeepReadonly } from '@/type';

interface UseListConfig<P = any, T = any> {
  request: {
    /**
     * 请求列表方法
     */
    api: (params: P) => Promise<ResponseData<T[]>>;
    /**
     * 请求参数
     */
    params?: P;
    /**
     * 分页参数键名, 默认 page
     */
    pageNumKey?: string;
    /**
     * 分页参数键名, 默认 pageSize
     */
    pageSizeKey?: string;
    /**
     * 搜索函数防抖延迟时间, 单位毫秒
     * 默认关闭防抖
     */
    lazy?: number;
    /**
     * 是否监听 params 变化(不包含 pageNumKey 和 pageSizeKey)并重新搜索
     * 默认不监听
     * 设置为 true 则监听并调用 handleSearch
     * 传入函数则作为监听函数调用
     */
    watchParams?: boolean | ((newParams: P, oldParams: P) => any);
    /**
     * 处理请求参数
     */
    handleParams?: (params: P) => any;
    /**
     * 校验函数返回true 往下执行
     */
    handleValidate?: (params: P) => boolean;
    /**
     * 自定义重置方法
     */
    handleCustomReset?: (params: P, defaultParams: P) => P;
    /**
     * 重置请求地址
     */
    resetApi?: (params: P) => (params: P) => Promise<ResponseData<T[]>>;
    /**
     * 取消请求函数
     */
    abortRequest?: () => void;
  };
  response?: {
    /**
     * 列表数据 默认 data
     * 例： 响应数据为 { data: { list: [] } } 则传递 data.list;
     */
    listDataKey?: string;
    /**
     * 总条数 默认 pageInfo.total
     * 例： 响应数据为 { data: { list: [], total: 0 } } 则传递 data.total;
     */
    totalKey?: string;
    /**
     * 处理响应数据
     */
    handleResponseData?: (list: T[]) => T[];
  };
}

export function useList<P extends object = any, T = any>(config: UseListConfig<P, T>) {
  const cacheConfig = cloneDeep(config);
  const defaultParams: DeepReadonly<P> = cloneDeep(config.request.params || ({} as P));

  const {
    pageNumKey = 'pageNum',
    pageSizeKey = 'pageSize',
    lazy,
    watchParams = false,
    handleParams,
    handleValidate,
    handleCustomReset,
    resetApi,
    abortRequest,
  } = cacheConfig.request;
  let { api } = cacheConfig.request;

  const {
    listDataKey = 'data',
    totalKey = 'pageInfo.total',
    handleResponseData,
  } = cacheConfig.response || {};

  const list = ref<T[]>([]);
  const total = ref(0);
  const params = ref(cloneDeep(defaultParams) as P) as Ref<P>;

  const { isLoading, executor } = useLoading();
  /**
   * 列表查询
   */
  const requestList = async (pageNum = 1) => {
    if (typeof pageNum !== 'number') pageNum = 1;

    abortRequest?.();

    if (pageNumKey in params.value) {
      (params.value as any)[pageNumKey] = pageNum;
    }

    let apiParams = { ...params.value };

    if (handleValidate && !handleValidate(params.value)) {
      return null;
    }

    if (handleParams) {
      apiParams = handleParams(cloneDeep(params.value));
    }

    if (resetApi) {
      api = resetApi(apiParams);
    }

    const res = await executor(api, apiParams);
    // 默认路径直接按类型读取(契约变更有 TS 报错保护), 自定义路径才回退到 lodash get
    let _list = (listDataKey === 'data' ? res.data : get(res, listDataKey)) as T[];
    total.value =
      totalKey === 'pageInfo.total' ? (res.pageInfo?.total ?? 0) : Number(get(res, totalKey) || 0);
    if (handleResponseData) _list = handleResponseData(_list);
    list.value = _list;
    return _list;
  };

  const handleSearch = lazy ? debounce(requestList, lazy) : requestList;

  /**
   * 重置查询参数并搜索
   */
  const handleReset = () => {
    if (handleCustomReset) {
      params.value = handleCustomReset(params.value as P, cloneDeep(defaultParams) as P);
    } else {
      params.value = cloneDeep(defaultParams as P);
    }
    return handleSearch();
  };

  /**
   * 切换分页大小 刷新列表
   */
  const handleSizeChange = (pageSize: number) => {
    if (pageSizeKey in params.value) {
      (params.value as any)[pageSizeKey] = pageSize;
    }
    return handleSearch(1);
  };

  /**
   * 切换页码 刷新列表
   */
  const handleCurrentChange = (pageNum: number) => {
    handleSearch(pageNum);
  };

  if (watchParams) {
    watch(
      () => {
        const _params: any = { ...params.value };
        delete _params[pageNumKey];
        delete _params[pageSizeKey];
        return JSON.stringify(_params);
      },
      (newVal, oldVal) => {
        if (watchParams === true) {
          handleSearch();
        } else {
          const { [pageNumKey]: pageNum, [pageSizeKey]: pageSize } = params.value as any;
          const newParams: any = {
            ...JSON.parse(newVal),
            [pageNumKey]: pageNum,
            [pageSizeKey]: pageSize,
          };
          const oldParams: any = {
            ...JSON.parse(oldVal),
            [pageNumKey]: pageNum,
            [pageSizeKey]: pageSize,
          };
          watchParams(newParams, oldParams);
        }
      }
    );
  }

  return {
    defaultParams,
    params,
    list,
    total,
    isLoading,
    handleSearch,
    handleReset,
    handleSizeChange,
    handleCurrentChange,
  };
}

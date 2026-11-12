import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { cloneDeep, debounce, get } from 'lodash-es';
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
     * 分页参数键名, 默认 pageNum
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
  // 配置仅在首次渲染时缓存, 与 Vue 版本保持一致的"初始化即固定"语义
  const configRef = useRef(config);
  const defaultParamsRef = useRef<DeepReadonly<P>>(
    cloneDeep(config.request.params || ({} as P)) as DeepReadonly<P>
  );

  const [list, setList] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState<P>(() => cloneDeep(defaultParamsRef.current as P));
  const paramsRef = useRef<P>(params);

  const { isLoading, executor } = useLoading();

  const updateParams = useCallback((patch: Partial<P>) => {
    const next = { ...paramsRef.current, ...patch } as P;
    paramsRef.current = next;
    setParams(next);
    return next;
  }, []);

  const setParam = useCallback((key: string, value: any) => {
    const next = { ...paramsRef.current, [key]: value } as P;
    paramsRef.current = next;
    setParams(next);
    return next;
  }, []);

  /**
   * 列表查询
   */
  const requestList = useCallback(
    async (pageNum = 1) => {
      const currentConfig = configRef.current;
      const {
        pageNumKey = 'pageNum',
        handleParams,
        handleValidate,
        resetApi,
        abortRequest,
      } = currentConfig.request;
      const {
        listDataKey = 'data',
        totalKey = 'pageInfo.total',
        handleResponseData,
      } = currentConfig.response || {};

      if (typeof pageNum !== 'number') pageNum = 1;

      abortRequest?.();

      let currentParams = paramsRef.current;
      if (pageNumKey in currentParams) {
        currentParams = setParam(pageNumKey, pageNum);
      }

      if (handleValidate && !handleValidate(currentParams)) {
        return null;
      }

      let apiParams: any = { ...currentParams };
      if (handleParams) {
        apiParams = handleParams(cloneDeep(currentParams));
      }

      let api = currentConfig.request.api;
      if (resetApi) {
        api = resetApi(apiParams);
      }

      let res;
      try {
        res = await executor(api, apiParams);
      } catch {
        // 请求错误(含主动取消)由请求层统一处理, 列表无需继续
        return null;
      }
      // 默认路径直接按类型读取(契约变更有 TS 报错保护), 自定义路径才回退到 lodash get
      let _list = (listDataKey === 'data' ? res.data : get(res, listDataKey)) as T[];
      setTotal(
        totalKey === 'pageInfo.total' ? (res.pageInfo?.total ?? 0) : Number(get(res, totalKey) || 0)
      );
      if (handleResponseData) _list = handleResponseData(_list);
      setList(_list);
      return _list;
    },
    [executor, setParam]
  );

  const handleSearch = useMemo(() => {
    if (!configRef.current.request.lazy) return requestList;
    return debounce(requestList, configRef.current.request.lazy);
  }, [requestList]);

  // 卸载时取消防抖, 避免组件销毁后仍发起请求
  useEffect(() => {
    return () => {
      const debounced = handleSearch as typeof handleSearch & { cancel?: () => void };
      debounced.cancel?.();
    };
  }, [handleSearch]);

  /**
   * 重置查询参数并搜索
   */
  const handleReset = useCallback(() => {
    const next = configRef.current.request.handleCustomReset
      ? configRef.current.request.handleCustomReset(
          paramsRef.current,
          cloneDeep(defaultParamsRef.current as P)
        )
      : cloneDeep(defaultParamsRef.current as P);

    paramsRef.current = next;
    setParams(next);
    return handleSearch();
  }, [handleSearch]);

  /**
   * 切换分页大小 刷新列表
   */
  const handleSizeChange = useCallback(
    (pageSize: number) => {
      const { pageSizeKey = 'pageSize' } = configRef.current.request;
      if (pageSizeKey in paramsRef.current) {
        setParam(pageSizeKey, pageSize);
      }
      return handleSearch(1);
    },
    [handleSearch, setParam]
  );

  /**
   * 切换页码 刷新列表
   */
  const handleCurrentChange = useCallback(
    (pageNum: number) => {
      handleSearch(pageNum);
    },
    [handleSearch]
  );

  // 监听 params 变化(排除分页参数) 并重新搜索
  const prevParamsRef = useRef('');
  useEffect(() => {
    const watchParams = configRef.current.request.watchParams;
    if (!watchParams) return;

    const { pageNumKey = 'page', pageSizeKey = 'pageSize' } = configRef.current.request;
    const _params: any = { ...params };
    delete _params[pageNumKey];
    delete _params[pageSizeKey];

    const serialized = JSON.stringify(_params);
    const prevSerialized = prevParamsRef.current;
    prevParamsRef.current = serialized;

    if (!prevSerialized || prevSerialized === serialized) return;

    if (watchParams === true) {
      handleSearch();
      return;
    }

    const pageNum = (params as any)[pageNumKey];
    const pageSize = (params as any)[pageSizeKey];
    watchParams({ ...JSON.parse(serialized), [pageNumKey]: pageNum, [pageSizeKey]: pageSize }, {
      ...JSON.parse(prevSerialized),
      [pageNumKey]: pageNum,
      [pageSizeKey]: pageSize,
    } as P);
  }, [params, handleSearch]);

  return {
    defaultParams: defaultParamsRef.current,
    params,
    updateParams,
    list,
    total,
    isLoading,
    handleSearch,
    handleReset,
    handleSizeChange,
    handleCurrentChange,
  };
}

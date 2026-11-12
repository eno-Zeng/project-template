import { Pagination as AntPagination } from 'antd';

interface PaginationProps {
  /** 总条数 */
  total: number;
  /** 当前页码 */
  current: number;
  /** 每页条数 */
  pageSize: number;
  /** 每页条数选项 */
  pageSizes?: number[];
  /** 是否禁用 */
  disabled?: boolean;
  /** 每页条数变化 */
  onSizeChange?: (pageSize: number) => void;
  /** 页码变化 */
  onCurrentChange?: (page: number) => void;
}

export default function Pagination({
  total,
  current,
  pageSize,
  pageSizes = [10, 20, 30, 40],
  disabled = false,
  onSizeChange,
  onCurrentChange,
}: PaginationProps) {
  return (
    <div className="flex justify-end">
      <AntPagination
        current={current}
        pageSize={pageSize}
        total={total}
        pageSizeOptions={pageSizes}
        showSizeChanger
        showTotal={count => `共 ${count} 条`}
        disabled={disabled}
        onShowSizeChange={onSizeChange}
        onChange={page => {
          if (page !== current) onCurrentChange?.(page);
        }}
      />
    </div>
  );
}

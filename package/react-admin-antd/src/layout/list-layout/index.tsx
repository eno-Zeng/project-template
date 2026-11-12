import { useEffect, useRef, useState, type ReactNode } from 'react';

interface ListLayoutProps {
  /** 搜索区域 */
  search?: ReactNode;
  /** 操作区域 */
  operate?: ReactNode;
  /** 底部区域 */
  footer?: ReactNode;
  /**
   * 内容区域, 接收可用高度 (用于表格滚动高度)
   */
  children: (height: number) => ReactNode;
}

export default function ListLayout({ search, operate, footer, children }: ListLayoutProps) {
  const layoutRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const operateRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    const computedContainerHeight = () => {
      const layoutHeight = layoutRef.current?.getBoundingClientRect().height || 0;
      const footerHeight = footerRef.current?.getBoundingClientRect().height || 0;
      const searchHeight = searchRef.current?.getBoundingClientRect().height || 0;
      const operateHeight = operateRef.current?.getBoundingClientRect().height || 0;

      setContainerHeight(Math.max(layoutHeight - footerHeight - searchHeight - operateHeight - 8, 0));
    };

    computedContainerHeight();

    // 监听窗口大小与容器尺寸变化
    window.addEventListener('resize', computedContainerHeight);
    const resizeObserver = new ResizeObserver(() => {
      computedContainerHeight();
    });
    if (layoutRef.current) resizeObserver.observe(layoutRef.current);

    return () => {
      window.removeEventListener('resize', computedContainerHeight);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div ref={layoutRef} className="h-full w-full">
      {search && (
        <div ref={searchRef} className="pb-2">
          {search}
        </div>
      )}
      {operate && (
        <div ref={operateRef} className="pb-2">
          {operate}
        </div>
      )}
      <div className="overflow-auto" style={{ height: `${containerHeight}px` }}>
        {children(containerHeight)}
      </div>
      {footer && (
        <div ref={footerRef} className="pt-2">
          {footer}
        </div>
      )}
    </div>
  );
}

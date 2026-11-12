import type { ReactNode } from 'react';

interface DetailLayoutProps {
  /** 操作区域 */
  operate?: ReactNode;
  /** 底部区域 */
  footer?: ReactNode;
  children?: ReactNode;
}

export default function DetailLayout({ operate, footer, children }: DetailLayoutProps) {
  return (
    <div className="flex h-full w-full flex-col">
      <div
        className="mb-2 flex h-[60px] shrink-0 items-center justify-end border-b pb-2"
        style={{ borderColor: 'var(--a-color-border-3)' }}
      >
        {operate}
      </div>
      <div className="flex-1 overflow-auto">{children}</div>
      {footer && (
        <div
          className="shrink-0 border-t pt-2"
          style={{ borderColor: 'var(--a-color-border-3)' }}
        >
          {footer}
        </div>
      )}
    </div>
  );
}

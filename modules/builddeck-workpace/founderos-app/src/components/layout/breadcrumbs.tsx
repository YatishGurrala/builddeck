"use client";

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const labelMap: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/products': 'Products',
  '/roadmap': 'Roadmap',
  '/tasks': 'Tasks',
  '/docs': 'Docs',
  '/team': 'Team',
  '/settings': 'Settings',
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const primary = `/${segments[0] ?? 'dashboard'}`;
  const baseLabel = labelMap[primary] ?? 'Dashboard';
  const detailLabel = segments[1]
    ? segments[0] === 'products'
      ? 'Product detail'
      : segments[1]
    : null;

  return (
    <div className="flex min-w-0 flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
      <span className="font-medium text-slate-950 dark:text-slate-50">BuilddeckWorkspace</span>
      <span>/</span>
      <span>{baseLabel}</span>
      {detailLabel ? (
        <>
          <span>/</span>
          <span className={cn('truncate')}>{detailLabel}</span>
        </>
      ) : null}
    </div>
  );
}
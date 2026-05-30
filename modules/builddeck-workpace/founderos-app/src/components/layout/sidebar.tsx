"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronsUpDown, CircleDot, Plus } from 'lucide-react';
import { workspaceSections } from '@/constants/navigation';
import { cn } from '@/lib/utils';

const workspaces = [
  { id: 'alpha', name: 'Builddeck Workspace' },
  { id: 'launchpad', name: 'Launchpad' },
  { id: 'studio', name: 'Studio' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-[280px] flex-col border-r border-slate-200 bg-white/90 px-4 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/70">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-950 dark:text-slate-50">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                F
              </span>
              BuilddeckWorkspace
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
              Lightweight founder operating system.
            </p>
          </div>
          <button className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900">
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <button className="mt-4 flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm dark:border-slate-800 dark:bg-slate-950">
          <span>
            <span className="block font-medium text-slate-950 dark:text-slate-50">Builddeck Workspace</span>
            <span className="block text-xs text-slate-500 dark:text-slate-400">Founder workspace</span>
          </span>
          <ChevronsUpDown className="h-4 w-4 text-slate-400" />
        </button>

        <div className="mt-3 space-y-1">
          {workspaces.map((workspace) => (
            <button
              key={workspace.id}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
            >
              <CircleDot className="h-3.5 w-3.5" />
              {workspace.name}
            </button>
          ))}
        </div>
      </div>

      <nav className="mt-4 space-y-1">
        {workspaceSections.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition',
                active
                  ? 'bg-slate-950 text-white shadow-sm dark:bg-white dark:text-slate-950'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900',
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-800 dark:bg-slate-900/70">
        <p className="font-medium text-slate-950 dark:text-slate-50">Workspace health</p>
        <p className="mt-1 text-slate-500 dark:text-slate-400">3 products active, 14 tasks open, 2 docs updated today.</p>
      </div>
    </aside>
  );
}
"use client";

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';

export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,rgba(255,255,255,0.7),rgba(255,255,255,0.9))] dark:bg-transparent">
      <div className="flex min-h-screen">
        <div className="hidden md:block">
          <Sidebar />
        </div>

        <div
          className={cn(
            'fixed inset-y-0 left-0 z-40 w-[280px] transition-transform md:hidden',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <Sidebar />
        </div>

        {sidebarOpen ? (
          <button
            aria-label="Close navigation"
            className="fixed inset-0 z-30 bg-slate-950/30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        ) : null}

        <main className="flex min-w-0 flex-1 flex-col">
          <Topbar onOpenSidebar={() => setSidebarOpen(true)} />
          <div className="shell-grid flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top,rgba(248,250,252,0.9),rgba(241,245,249,0.92))] p-4 md:p-6 dark:bg-none">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
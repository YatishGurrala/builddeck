"use client";

import { Menu, Search, Sparkles } from 'lucide-react';
import { Breadcrumbs } from './breadcrumbs';
import { Button } from '@/components/ui/button';

type TopbarProps = {
  onOpenSidebar?: () => void;
};

export function Topbar({ onOpenSidebar }: TopbarProps) {
  return (
    <header className="flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white/80 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80 md:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <Button variant="ghost" size="sm" className="md:hidden" onClick={onOpenSidebar} aria-label="Open navigation">
          <Menu className="h-4 w-4" />
        </Button>
        <div className="min-w-0">
          <Breadcrumbs />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="hidden gap-2 md:inline-flex">
          <Search className="h-4 w-4" />
          Search
        </Button>
        <Button variant="secondary" size="sm" className="gap-2">
          <Sparkles className="h-4 w-4" />
          New
        </Button>
      </div>
    </header>
  );
}
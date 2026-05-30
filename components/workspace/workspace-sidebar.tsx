"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Box,
  CheckSquare,
  FileText,
  Calendar,
  Users,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Products", href: "/dashboard/workspace/products", icon: Box },
  { label: "Tasks", href: "/dashboard/workspace/tasks", icon: CheckSquare },
  { label: "Docs", href: "/dashboard/workspace/docs", icon: FileText },
  { label: "Calendar", href: "/dashboard/workspace/calendar", icon: Calendar },
  { label: "Team", href: "/dashboard/workspace/team", icon: Users },
];

export function WorkspaceSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 border-r border-[var(--surface-container-high)] bg-[var(--surface-container-low)] flex flex-col h-full">
      <div className="px-4 py-5 border-b border-[var(--surface-container-high)]">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--on-surface-variant)]">
          Workspace
        </p>
      </div>

      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[var(--primary)] text-white"
                  : "text-[var(--on-surface-variant)] hover:bg-[var(--surface-container)] hover:text-[var(--on-surface)]"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{label}</span>
              {isActive && <ChevronRight className="h-3 w-3 opacity-60" />}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

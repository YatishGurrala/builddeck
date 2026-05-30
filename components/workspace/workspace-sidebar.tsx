"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Map,
  Calendar,
  CheckSquare,
  FileText,
  Settings,
  Plus,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard/workspace", icon: LayoutDashboard, exact: true },
  { label: "Products", href: "/dashboard/workspace/products", icon: Package },
  { label: "Roadmap", href: "/dashboard/workspace/roadmap", icon: Map },
  { label: "Calendar", href: "/dashboard/workspace/calendar", icon: Calendar },
  { label: "Tasks", href: "/dashboard/workspace/tasks", icon: CheckSquare },
];

const footerItems = [
  { label: "Docs", href: "/dashboard/workspace/docs", icon: FileText },
  { label: "Settings", href: "#", icon: Settings },
];

export default function WorkspaceSidebar() {
  const pathname = usePathname();

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-64 border-r border-[#27272a] bg-[#131315] flex flex-col py-8 z-50 hidden md:flex">
      {/* Brand */}
      <div className="px-6 mb-8">
        <p className="text-white font-bold text-lg tracking-tight ws-label" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "16px", letterSpacing: "0.05em" }}>BUILDDECK</p>
        <p className="text-[#a1a1aa] text-xs mt-0.5 ws-label">Founder Workspace</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map(({ label, href, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              className={
                active
                  ? "flex items-center gap-3 px-4 py-2 text-white bg-[#2a2a2c] border-r-2 border-white rounded-l text-sm font-mono tracking-wider"
                  : "flex items-center gap-3 px-4 py-2 text-[#a1a1aa] hover:text-[#e5e1e4] hover:bg-[#1c1b1d] rounded text-sm font-mono tracking-wider transition-colors"
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{label}</span>
            </Link>
          );
        })}

        {/* New Product button */}
        <div className="pt-4">
          <Link
            href="/dashboard/workspace/products/new"
            className="flex items-center gap-2 px-4 py-2 bg-white text-[#131315] rounded text-sm font-mono tracking-wider hover:bg-[#e2e2e2] transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Product
          </Link>
        </div>
      </nav>

      {/* Footer nav */}
      <div className="px-3 space-y-0.5 border-t border-[#27272a] pt-4 mt-4">
        {footerItems.map(({ label, href, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={
                active
                  ? "flex items-center gap-3 px-4 py-2 text-white bg-[#2a2a2c] border-r-2 border-white rounded-l text-sm font-mono tracking-wider"
                  : "flex items-center gap-3 px-4 py-2 text-[#a1a1aa] hover:text-[#e5e1e4] hover:bg-[#1c1b1d] rounded text-sm font-mono tracking-wider transition-colors"
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}

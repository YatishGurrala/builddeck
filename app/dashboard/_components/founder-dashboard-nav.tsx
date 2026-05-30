"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "profile", label: "Profile", href: "/dashboard/profile" },
  { id: "links", label: "Links", href: "/dashboard/links" },
  { id: "products", label: "Products", href: "/dashboard/products" },
  { id: "analytics", label: "Analytics", href: "/dashboard/analytics" },
] as const;

export type FounderDashboardTab = (typeof TABS)[number]["id"];

export function FounderDashboardNav({ active }: { active?: FounderDashboardTab }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-wrap gap-1 rounded-xl border border-white/5 bg-[#101419] p-1">
      {TABS.map((tab) => {
        const isActive = active ? active === tab.id : pathname?.startsWith(tab.href);
        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={cn(
              "inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-white/10 text-white"
                : "text-zinc-400 hover:bg-white/5 hover:text-white",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

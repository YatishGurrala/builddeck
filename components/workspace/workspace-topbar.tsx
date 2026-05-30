"use client";

import { Bell, Search } from "lucide-react";

interface WorkspaceTopBarProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

export default function WorkspaceTopBar({ user }: WorkspaceTopBarProps) {
  const initials = (user.name ?? user.email ?? "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header
      className="h-16 sticky top-0 z-40 flex items-center justify-between px-6 border-b border-[#27272a] backdrop-blur-md"
      style={{ backgroundColor: "rgba(24,24,27,0.8)" }}
    >
      {/* Left: brand */}
      <span
        className="text-[#a1a1aa] text-xs tracking-widest uppercase"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        BUILDDECK
      </span>

      {/* Center: search */}
      <div className="hidden md:flex items-center gap-2 bg-[#1c1b1d] border border-[#444748] rounded px-3 py-1.5 w-72">
        <Search className="h-3.5 w-3.5 text-[#a1a1aa] shrink-0" />
        <input
          type="text"
          placeholder="Search tasks, products..."
          className="bg-transparent text-sm text-[#e5e1e4] placeholder-[#a1a1aa] outline-none w-full"
        />
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-3">
        <button className="text-[#a1a1aa] hover:text-[#e5e1e4] transition-colors">
          <Bell className="h-4 w-4" />
        </button>
        <div
          className="w-8 h-8 rounded-full bg-[#6366f1] flex items-center justify-center text-white text-xs font-bold"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
          title={user.name ?? user.email ?? ""}
        >
          {initials}
        </div>
      </div>
    </header>
  );
}

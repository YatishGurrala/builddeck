"use client";

import { useState } from "react";

const TABS = ["Overview", "Roadmap", "Tasks", "Docs"] as const;
type Tab = (typeof TABS)[number];

interface ProductTabsProps {
  overview: React.ReactNode;
  roadmap: React.ReactNode;
  tasks: React.ReactNode;
  docs: React.ReactNode;
}

export function ProductTabs({ overview, roadmap, tasks, docs }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");

  const content: Record<Tab, React.ReactNode> = { Overview: overview, Roadmap: roadmap, Tasks: tasks, Docs: docs };

  return (
    <div>
      <div className="flex gap-6 border-b border-[#27272a] mb-6">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm transition-colors ws-label ${
              activeTab === tab
                ? "border-b-2 border-white text-white"
                : "text-[#a1a1aa] hover:text-[#e5e1e4]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div>{content[activeTab]}</div>
    </div>
  );
}

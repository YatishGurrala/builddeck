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
      <div className="flex gap-0 border-b border-[var(--surface-container-high)] mb-6">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              activeTab === tab
                ? "border-[var(--primary)] text-[var(--primary)]"
                : "border-transparent text-[var(--on-surface-variant)] hover:text-[var(--on-surface)]"
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

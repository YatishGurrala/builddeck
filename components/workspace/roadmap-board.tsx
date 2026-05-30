"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  createRoadmapItemAction,
  updateRoadmapItemAction,
  deleteRoadmapItemAction,
} from "@/actions/workspace/roadmap";

type RoadmapStatus = "PLANNED" | "IN_PROGRESS" | "COMPLETED";

interface RoadmapItem {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  order: number;
}

const COLUMNS: { status: RoadmapStatus; label: string; color: string }[] = [
  { status: "PLANNED", label: "Planned", color: "#a1a1aa" },
  { status: "IN_PROGRESS", label: "In Progress", color: "#6366f1" },
  { status: "COMPLETED", label: "Completed", color: "#22c55e" },
];

interface RoadmapBoardProps {
  productId: string;
  items: RoadmapItem[];
}

export function RoadmapBoard({ productId, items }: RoadmapBoardProps) {
  const [isPending, startTransition] = useTransition();
  const [addingTo, setAddingTo] = useState<RoadmapStatus | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");

  function itemsByStatus(status: RoadmapStatus) {
    return items.filter((i) => i.status === status);
  }

  function handleAddItem(status: RoadmapStatus) {
    if (!newTitle.trim()) return;
    const formData = new FormData();
    formData.set("title", newTitle.trim());
    formData.set("description", newDesc.trim());
    formData.set("status", status);
    startTransition(async () => {
      await createRoadmapItemAction(productId, formData);
      setNewTitle("");
      setNewDesc("");
      setAddingTo(null);
    });
  }

  function handleStatusChange(item: RoadmapItem, newStatus: RoadmapStatus) {
    startTransition(async () => {
      await updateRoadmapItemAction(item.id, productId, { status: newStatus });
    });
  }

  function handleDelete(itemId: string) {
    startTransition(async () => {
      await deleteRoadmapItemAction(itemId, productId);
    });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {COLUMNS.map(({ status, label, color }) => (
        <div key={status} className="flex flex-col gap-2">
          {/* Column header */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-[#e5e1e4] text-xs ws-label font-semibold uppercase tracking-wider">{label}</span>
              <span className="text-[#a1a1aa] text-xs ws-label">({itemsByStatus(status).length})</span>
            </div>
            <button
              onClick={() => setAddingTo(status)}
              className="text-[#a1a1aa] hover:text-[#e5e1e4] transition-colors"
              title="Add item"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Cards */}
          <div className="space-y-2">
            {itemsByStatus(status).map((item) => (
              <div
                key={item.id}
                className="bg-[#131315] border border-[#27272a] p-3 rounded cursor-pointer hover:border-[#444748] transition-colors group"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-[#e5e1e4] flex-1">{item.title}</p>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="opacity-0 group-hover:opacity-100 text-[#a1a1aa] hover:text-red-400 transition-all shrink-0"
                    disabled={isPending}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                {item.description && (
                  <p className="text-xs text-[#a1a1aa] mt-1 line-clamp-2">{item.description}</p>
                )}
                <div className="flex gap-1 mt-2 flex-wrap">
                  {COLUMNS.filter((c) => c.status !== status).map((c) => (
                    <button
                      key={c.status}
                      onClick={() => handleStatusChange(item, c.status)}
                      disabled={isPending}
                      className="bg-[#2a2a2c] text-[#a1a1aa] px-2 py-0.5 rounded text-[10px] ws-label hover:text-[#e5e1e4] transition-colors"
                    >
                      → {c.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {addingTo === status && (
              <div className="border border-[#6366f1] bg-[#131315] p-3 rounded space-y-2">
                <input
                  placeholder="Item title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  autoFocus
                  className="w-full bg-[#1c1b1d] border border-[#27272a] text-[#e5e1e4] rounded px-3 py-2 text-sm focus:border-[#6366f1] focus:outline-none"
                />
                <textarea
                  placeholder="Description (optional)"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  rows={2}
                  className="w-full bg-[#1c1b1d] border border-[#27272a] text-[#e5e1e4] rounded px-3 py-2 text-sm resize-none focus:border-[#6366f1] focus:outline-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddItem(status)}
                    disabled={isPending || !newTitle.trim()}
                    className="bg-white text-[#131315] px-3 py-1 rounded text-xs font-mono tracking-wider hover:bg-[#e2e2e2] disabled:opacity-50 transition-colors"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => { setAddingTo(null); setNewTitle(""); setNewDesc(""); }}
                    className="bg-[#1c1b1d] border border-[#27272a] text-[#a1a1aa] px-3 py-1 rounded text-xs font-mono tracking-wider hover:text-[#e5e1e4] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

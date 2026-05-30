"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/workspace/status-badge";
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

const COLUMNS: { status: RoadmapStatus; label: string }[] = [
  { status: "PLANNED", label: "Planned" },
  { status: "IN_PROGRESS", label: "In Progress" },
  { status: "COMPLETED", label: "Completed" },
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
      {COLUMNS.map(({ status, label }) => (
        <div
          key={status}
          className="rounded-xl border border-[var(--surface-container-high)] bg-[var(--surface-container-low)] p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <StatusBadge status={status} />
              <span className="text-xs text-[var(--on-surface-variant)]">
                {itemsByStatus(status).length}
              </span>
            </div>
            <button
              onClick={() => setAddingTo(status)}
              className="text-[var(--on-surface-variant)] hover:text-[var(--primary)] transition-colors"
              title="Add item"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-2">
            {itemsByStatus(status).map((item) => (
              <div
                key={item.id}
                className="rounded-lg border border-[var(--surface-container-high)] bg-[var(--surface)] p-3 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-[var(--on-surface)] flex-1">
                    {item.title}
                  </p>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="opacity-0 group-hover:opacity-100 text-[var(--on-surface-variant)] hover:text-red-500 transition-all"
                    disabled={isPending}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                {item.description && (
                  <p className="text-xs text-[var(--on-surface-variant)] mt-1 line-clamp-2">
                    {item.description}
                  </p>
                )}
                <div className="flex gap-1 mt-2">
                  {COLUMNS.filter((c) => c.status !== status).map((c) => (
                    <button
                      key={c.status}
                      onClick={() => handleStatusChange(item, c.status)}
                      disabled={isPending}
                      className="text-xs text-[var(--on-surface-variant)] hover:text-[var(--primary)] transition-colors"
                    >
                      → {c.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {addingTo === status && (
              <div className="rounded-lg border border-[var(--primary)] bg-[var(--surface)] p-3 space-y-2">
                <Input
                  placeholder="Item title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  autoFocus
                  className="text-sm h-8"
                />
                <Textarea
                  placeholder="Description (optional)"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  rows={2}
                  className="text-sm resize-none"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleAddItem(status)}
                    disabled={isPending || !newTitle.trim()}
                  >
                    Add
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => { setAddingTo(null); setNewTitle(""); setNewDesc(""); }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

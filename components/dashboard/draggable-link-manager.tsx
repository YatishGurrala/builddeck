"use client";

import { useRef, useState } from "react";
import { GripVertical, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { FounderLink } from "@/lib/founder-profile/types";
import { cn } from "@/lib/utils";
import {
  removeFounderLink,
  reorderFounderLinks,
  saveFounderLink,
  toggleFounderLink,
} from "@/actions/founder-profile";

interface DraggableLinkManagerProps {
  links: FounderLink[];
}

function reorderLinks(items: FounderLink[], draggedId: string, targetId: string) {
  const currentIndex = items.findIndex((item) => item.id === draggedId);
  const targetIndex = items.findIndex((item) => item.id === targetId);
  if (currentIndex < 0 || targetIndex < 0 || currentIndex === targetIndex) {
    return items;
  }

  const next = [...items];
  const [moved] = next.splice(currentIndex, 1);
  next.splice(targetIndex, 0, moved);
  return next;
}

export default function DraggableLinkManager({ links }: DraggableLinkManagerProps) {
  const [items, setItems] = useState(links);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragPreviewRef = useRef<HTMLElement | null>(null);

  const cleanupDragPreview = () => {
    if (dragPreviewRef.current) {
      dragPreviewRef.current.remove();
      dragPreviewRef.current = null;
    }
  };

  const commitOrder = (nextItems: FounderLink[]) => {
    if (!inputRef.current || !formRef.current) return;
    inputRef.current.value = JSON.stringify(nextItems.map((item) => item.id));
    formRef.current.requestSubmit();
  };

  if (items.length === 0) {
    return <p className="text-sm text-zinc-400">No links yet.</p>;
  }

  return (
    <div className="space-y-3">
      <form ref={formRef} action={reorderFounderLinks}>
        <input ref={inputRef} type="hidden" name="order" />
      </form>
      {items.map((link) => {
        const isDragging = draggedId === link.id;
        const isDropTarget = dropTargetId === link.id && draggedId !== link.id;
        return (
          <div
            key={link.id}
            data-draggable-card="true"
            onDragOver={(event) => {
              event.preventDefault();
              if (draggedId && draggedId !== link.id) {
                setDropTargetId(link.id);
              }
            }}
            onDragEnter={() => {
              if (draggedId && draggedId !== link.id) {
                setDropTargetId(link.id);
              }
            }}
            onDragLeave={() => {
              if (dropTargetId === link.id) {
                setDropTargetId(null);
              }
            }}
            onDrop={() => {
              if (!draggedId || draggedId === link.id) return;
              const nextItems = reorderLinks(items, draggedId, link.id);
              setItems(nextItems);
              setDraggedId(null);
              setDropTargetId(null);
              commitOrder(nextItems);
            }}
            className={cn(
              "relative rounded-xl border border-white/5 bg-[#101419] p-3 transition-all duration-200 ease-out",
              isDragging && "scale-[1.01] border-cyan-400/40 shadow-[0_16px_40px_rgba(34,211,238,0.16)] opacity-70",
              isDropTarget && "border-cyan-400/50 bg-[#0f1c24] shadow-[inset_0_0_0_1px_rgba(34,211,238,0.25)]",
            )}
          >
            {isDropTarget ? <div className="absolute inset-x-3 top-0 h-px bg-cyan-300/70" /> : null}
            <form action={saveFounderLink} className="grid gap-2 md:grid-cols-[auto_1fr_1fr_auto]">
              <input type="hidden" name="linkId" value={link.id} />
              <div className="flex items-center pt-2 md:pt-0">
                <button
                  type="button"
                  draggable
                  aria-label={`Drag ${link.title}`}
                  onDragStart={(event) => {
                    event.dataTransfer.effectAllowed = "move";
                    const cardElement = event.currentTarget.closest("[data-draggable-card='true']") as HTMLElement | null;
                    if (cardElement) {
                      cleanupDragPreview();
                      const clone = cardElement.cloneNode(true) as HTMLElement;
                      const rect = cardElement.getBoundingClientRect();
                      clone.style.position = "fixed";
                      clone.style.top = "-9999px";
                      clone.style.left = "-9999px";
                      clone.style.width = `${rect.width}px`;
                      clone.style.pointerEvents = "none";
                      clone.style.opacity = "0.95";
                      clone.style.transform = "scale(1.01)";
                      clone.style.boxShadow = "0 20px 40px rgba(34, 211, 238, 0.25)";
                      document.body.appendChild(clone);
                      dragPreviewRef.current = clone;
                      event.dataTransfer.setDragImage(clone, 24, 20);
                    }
                    setDraggedId(link.id);
                  }}
                  onDragEnd={() => {
                    setDraggedId(null);
                    setDropTargetId(null);
                    cleanupDragPreview();
                  }}
                  className={cn(
                    "cursor-grab text-zinc-500 transition-colors active:cursor-grabbing",
                    isDragging && "text-cyan-300",
                    isDropTarget && "text-cyan-200",
                  )}
                >
                  <GripVertical className="h-4 w-4" />
                </button>
              </div>
              <Input name="title" defaultValue={link.title} />
              <Input name="url" defaultValue={link.url} />
              <Button type="submit" variant="outline" className="gap-2">
                <Save className="h-4 w-4" /> Save
              </Button>
              <div className="md:col-start-2 md:col-end-5">
                <Input name="description" defaultValue={link.description ?? ""} placeholder="Description" />
              </div>
            </form>

            <div className="mt-2 flex items-center justify-between gap-2">
              <span
                className={
                  "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide " +
                  (link.isActive ? "bg-emerald-400/15 text-emerald-300" : "bg-white/10 text-zinc-400")
                }
              >
                {link.isActive ? "Active" : "Hidden"}
              </span>
              <div className="flex items-center gap-2">
                <form action={toggleFounderLink}>
                  <input type="hidden" name="linkId" value={link.id} />
                  <Button type="submit" size="sm" variant="outline">
                    {link.isActive ? "Hide" : "Show"}
                  </Button>
                </form>
                <form action={removeFounderLink}>
                  <input type="hidden" name="linkId" value={link.id} />
                  <Button type="submit" size="sm" variant="outline" className="gap-2 text-red-300 hover:text-red-200">
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </Button>
                </form>
              </div>
            </div>
          </div>
        );
      })}
      <p className="pt-1 text-xs text-zinc-500">Drag links by the handle. Lift and guide states show the active card and drop position.</p>
    </div>
  );
}

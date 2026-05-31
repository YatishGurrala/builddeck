"use client";

import { useRef, useState } from "react";
import { GripVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { CreatorPageBlock } from "@/lib/founder-profile/editor-data";
import { reorderCreatorBlocks } from "@/actions/founder-profile";
import { cn } from "@/lib/utils";

interface DraggableBlockListProps {
  blocks: CreatorPageBlock[];
}

function reorderBlocks(items: CreatorPageBlock[], draggedId: string, targetId: string) {
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

export function DraggableBlockList({ blocks }: DraggableBlockListProps) {
  const [items, setItems] = useState(blocks);
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

  const commitOrder = (nextItems: CreatorPageBlock[]) => {
    if (!inputRef.current || !formRef.current) return;
    inputRef.current.value = JSON.stringify(nextItems.map((item) => item.id));
    formRef.current.requestSubmit();
  };

  return (
    <div className="space-y-3">
      <form ref={formRef} action={reorderCreatorBlocks}>
        <input ref={inputRef} type="hidden" name="order" />
      </form>
      {items.map((block) => {
        const isDragging = draggedId === block.id;
        const isDropTarget = dropTargetId === block.id && draggedId !== block.id;
        return (
          <div
            key={block.id}
            data-draggable-card="true"
            onDragOver={(event) => {
              event.preventDefault();
              if (draggedId && draggedId !== block.id) {
                setDropTargetId(block.id);
              }
            }}
            onDragEnter={() => {
              if (draggedId && draggedId !== block.id) {
                setDropTargetId(block.id);
              }
            }}
            onDragLeave={() => {
              if (dropTargetId === block.id) {
                setDropTargetId(null);
              }
            }}
            onDrop={() => {
              if (!draggedId || draggedId === block.id) return;
              const nextItems = reorderBlocks(items, draggedId, block.id);
              setItems(nextItems);
              setDraggedId(null);
              setDropTargetId(null);
              commitOrder(nextItems);
            }}
            className={cn(
              "relative flex items-start gap-3 rounded-2xl border border-white/10 bg-[#101419] p-4 transition-all duration-200 ease-out",
              isDragging && "scale-[1.02] border-cyan-400/40 shadow-[0_16px_40px_rgba(34,211,238,0.18)] opacity-70",
              isDropTarget && "border-cyan-400/50 bg-[#0f1c24] shadow-[inset_0_0_0_1px_rgba(34,211,238,0.25)]",
            )}
          >
            {isDropTarget ? <div className="absolute inset-x-4 top-0 h-px bg-cyan-300/70" /> : null}
            <button
              type="button"
              draggable
              aria-label={`Drag ${block.title}`}
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
                setDraggedId(block.id);
              }}
              onDragEnd={() => {
                setDraggedId(null);
                setDropTargetId(null);
                cleanupDragPreview();
              }}
              className={cn(
                "mt-0.5 cursor-grab text-zinc-500 transition-colors active:cursor-grabbing",
                isDragging && "text-cyan-300",
                isDropTarget && "text-cyan-200",
              )}
            >
              <GripVertical className="h-4 w-4" />
            </button>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-white">{block.title}</p>
                <Badge className={block.isActive ? "bg-cyan-400/15 text-cyan-300" : "bg-white/10 text-zinc-400"}>
                  {block.isActive ? "Active" : "Draft"}
                </Badge>
              </div>
              <p className="mt-1 text-xs text-zinc-400">{block.description}</p>
            </div>
          </div>
        );
      })}
      <p className="pt-1 text-xs text-zinc-500">Drag blocks by the handle. The lifted card and cyan guide show where the block will drop.</p>
    </div>
  );
}

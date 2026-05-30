"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { updateWorkspaceTaskAction } from "@/actions/workspace/tasks";

type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE" | "BLOCKED";
type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  priority: string;
  productId: string;
}

interface TaskDetailDrawerProps {
  task: Task;
  productName?: string;
  onClose: () => void;
}

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "TODO", label: "To Do" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "DONE", label: "Done" },
  { value: "BLOCKED", label: "Blocked" },
];

const PRIORITY_OPTIONS: { value: TaskPriority; label: string; color: string }[] = [
  { value: "LOW", label: "Low", color: "#22c55e" },
  { value: "MEDIUM", label: "Medium", color: "#f59e0b" },
  { value: "HIGH", label: "High", color: "#ef4444" },
];

export function TaskDetailDrawer({ task, productName, onClose }: TaskDetailDrawerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [status, setStatus] = useState(task.status);
  const [priority, setPriority] = useState(task.priority);

  function handleSave() {
    const formData = new FormData();
    formData.set("title", title);
    formData.set("description", description);
    formData.set("status", status);
    formData.set("priority", priority);

    startTransition(async () => {
      await updateWorkspaceTaskAction(task.id, task.productId, formData);
      router.refresh();
      onClose();
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#131315]/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative z-10 w-full sm:w-[480px] h-full bg-[#131315] border-l border-[#27272a] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#27272a] flex-shrink-0">
          <span className="text-xs text-[#a1a1aa] ws-label truncate">
            {productName ?? "Task"}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={isPending}
              className="px-3 py-1 bg-[#6366f1] text-white text-xs rounded hover:bg-[#818cf8] disabled:opacity-50 transition-colors ws-label"
            >
              {isPending ? "Saving..." : "Save"}
            </button>
            <button
              onClick={onClose}
              className="text-[#a1a1aa] hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Editable title */}
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent text-white text-xl font-semibold border-b border-[#444748] focus:border-white outline-none pb-2 transition-colors"
          />

          {/* Properties panel */}
          <div className="bg-[#1c1b1d] border border-[#27272a] rounded-lg p-4 space-y-4">
            <h3 className="text-[#a1a1aa] text-xs ws-label uppercase tracking-wider">
              Properties
            </h3>

            {/* Status */}
            <div>
              <p className="text-[#a1a1aa] text-xs ws-label mb-2">Status</p>
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setStatus(s.value)}
                    className={`px-3 py-1 rounded text-xs ws-label border transition-all ${
                      status === s.value
                        ? "border-[#6366f1] bg-[#6366f1]/10 text-[#818cf8]"
                        : "border-[#27272a] text-[#a1a1aa] hover:border-[#444748]"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority */}
            <div>
              <p className="text-[#a1a1aa] text-xs ws-label mb-2">Priority</p>
              <div className="flex gap-2">
                {PRIORITY_OPTIONS.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setPriority(p.value)}
                    className={`px-3 py-1 rounded text-xs ws-label border transition-all ${
                      priority === p.value
                        ? "border-[#6366f1] bg-[#6366f1]/10 text-[#818cf8]"
                        : "border-[#27272a] text-[#a1a1aa] hover:border-[#444748]"
                    }`}
                  >
                    <span
                      className="inline-block w-1.5 h-1.5 rounded-full mr-1.5"
                      style={{ backgroundColor: priority === p.value ? p.color : "#444748" }}
                    />
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[#a1a1aa] text-xs ws-label uppercase tracking-wider mb-3">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add notes, context, links..."
              rows={7}
              className="w-full bg-[#1c1b1d] border border-[#27272a] rounded-lg px-4 py-3 text-sm text-[#e5e1e4] placeholder:text-[#444748] focus:border-[#6366f1] outline-none resize-none transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

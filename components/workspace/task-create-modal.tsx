"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { createWorkspaceTaskAction } from "@/actions/workspace/tasks";

interface Product {
  id: string;
  name: string;
}

interface TaskCreateModalProps {
  products: Product[];
  defaultProductId?: string;
  onClose: () => void;
}

export function TaskCreateModal({
  products,
  defaultProductId,
  onClose,
}: TaskCreateModalProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [addAnother, setAddAnother] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(
    defaultProductId ?? products[0]?.id ?? ""
  );
  const [status, setStatus] = useState("TODO");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("status", status);

    startTransition(async () => {
      const result = await createWorkspaceTaskAction(selectedProductId, formData);
      if (result.success) {
        router.refresh();
        if (addAnother) {
          form.reset();
          setStatus("TODO");
        } else {
          onClose();
        }
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-[#131315]/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-2xl mx-4 bg-[#0e0e10] border border-[#27272a] rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#27272a]">
          <h2 className="text-white text-base font-semibold">New Task</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-[#a1a1aa] hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-5">
            {/* Title */}
            <input
              name="title"
              type="text"
              placeholder="Task title..."
              required
              autoFocus
              className="w-full bg-transparent text-white text-xl font-medium placeholder:text-[#444748] border-b border-[#444748] focus:border-white outline-none pb-2 transition-colors"
            />

            {/* Description */}
            <textarea
              name="description"
              placeholder="Add a description..."
              rows={3}
              className="w-full bg-[#1c1b1d] border border-[#27272a] rounded-lg px-4 py-3 text-sm text-[#e5e1e4] placeholder:text-[#444748] focus:border-[#6366f1] outline-none resize-none transition-colors"
            />

            {/* Selectors */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[#a1a1aa] text-xs ws-label mb-2">
                  PRODUCT
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full bg-[#201f22] border border-[#27272a] rounded px-3 py-2.5 text-sm text-[#e5e1e4] focus:border-[#6366f1] outline-none"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[#a1a1aa] text-xs ws-label mb-2">
                  PRIORITY
                </label>
                <select
                  name="priority"
                  defaultValue="MEDIUM"
                  className="w-full bg-[#201f22] border border-[#27272a] rounded px-3 py-2.5 text-sm text-[#e5e1e4] focus:border-[#6366f1] outline-none"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
            </div>

            {/* Status pills */}
            <div>
              <label className="block text-[#a1a1aa] text-xs ws-label mb-2">
                STATUS
              </label>
              <div className="flex gap-2 flex-wrap">
                {["TODO", "IN_PROGRESS", "BLOCKED"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className={`px-3 py-1 rounded text-xs ws-label border transition-all ${
                      status === s
                        ? "border-[#6366f1] bg-[#6366f1]/10 text-[#818cf8]"
                        : "border-[#27272a] text-[#a1a1aa] hover:border-[#444748]"
                    }`}
                  >
                    {s.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 bg-[#0a0a0b] border-t border-[#27272a]">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={addAnother}
                onChange={(e) => setAddAnother(e.target.checked)}
                className="rounded border-[#444748]"
              />
              <span className="text-xs text-[#a1a1aa] ws-label">
                Create and add another
              </span>
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-[#a1a1aa] hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending || !selectedProductId}
                className="px-5 py-2 bg-white text-[#131315] rounded text-sm font-semibold hover:bg-[#e2e2e2] disabled:opacity-50 transition-colors"
              >
                {isPending ? "Creating..." : "Create Task"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

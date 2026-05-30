"use client";

import { useState } from "react";
import { Plus, LayoutList, LayoutGrid } from "lucide-react";
import { TaskCreateModal } from "./task-create-modal";
import { TaskDetailDrawer } from "./task-detail-drawer";

interface Product {
  id: string;
  name: string;
}

interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  priority: string;
  productId: string;
  productName: string;
}

interface TasksToolbarProps {
  products: Product[];
  tasks: Task[];
  view: "list" | "board";
  onViewChange: (v: "list" | "board") => void;
}

export function TasksToolbar({ products, tasks, view, onViewChange }: TasksToolbarProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  return (
    <>
      <div className="flex items-center gap-2">
        {/* View toggle */}
        <div className="flex border border-[#27272a] rounded overflow-hidden">
          <button
            onClick={() => onViewChange("list")}
            className={`p-2 transition-colors ${view === "list" ? "bg-[#27272a] text-white" : "text-[#a1a1aa] hover:text-white"}`}
          >
            <LayoutList className="h-4 w-4" />
          </button>
          <button
            onClick={() => onViewChange("board")}
            className={`p-2 transition-colors ${view === "board" ? "bg-[#27272a] text-white" : "text-[#a1a1aa] hover:text-white"}`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>

        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-white text-[#131315] px-3 py-2 rounded text-sm font-semibold hover:bg-[#e2e2e2] transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Task
        </button>
      </div>

      {showCreate && products.length > 0 && (
        <TaskCreateModal
          products={products}
          onClose={() => setShowCreate(false)}
        />
      )}

      {selectedTask && (
        <TaskDetailDrawer
          task={selectedTask}
          productName={selectedTask.productName}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </>
  );
}

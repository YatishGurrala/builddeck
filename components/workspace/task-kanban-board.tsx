"use client";

import { useState } from "react";
import { TaskDetailDrawer } from "./task-detail-drawer";
import { StatusBadge } from "./status-badge";

type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE" | "BLOCKED";

interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  priority: string;
  productId: string;
  productName: string;
}

interface TaskKanbanBoardProps {
  tasks: Task[];
}

const COLUMNS: { status: TaskStatus; label: string; color: string }[] = [
  { status: "TODO", label: "To Do", color: "#a1a1aa" },
  { status: "IN_PROGRESS", label: "In Progress", color: "#6366f1" },
  { status: "DONE", label: "Done", color: "#22c55e" },
  { status: "BLOCKED", label: "Blocked", color: "#ef4444" },
];

export function TaskKanbanBoard({ tasks }: TaskKanbanBoardProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const grouped = COLUMNS.reduce<Record<TaskStatus, Task[]>>((acc, col) => {
    acc[col.status] = tasks.filter((t) => t.status === col.status);
    return acc;
  }, { TODO: [], IN_PROGRESS: [], DONE: [], BLOCKED: [] });

  return (
    <>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((col) => {
          const colTasks = grouped[col.status];
          return (
            <div key={col.status} className="flex-shrink-0 w-72">
              {/* Column header */}
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: col.color }}
                  />
                  <span className="text-sm font-semibold text-[#e5e1e4]">
                    {col.label}
                  </span>
                </div>
                <span className="text-xs text-[#a1a1aa] ws-label bg-[#27272a] px-2 py-0.5 rounded-full">
                  {colTasks.length}
                </span>
              </div>

              {/* Cards */}
              <div className="space-y-2">
                {colTasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    className="w-full text-left bg-[#1c1b1d] border border-[#27272a] rounded-lg p-3 hover:border-[#444748] transition-colors group"
                  >
                    <p
                      className={`text-sm text-[#e5e1e4] mb-2 leading-snug group-hover:text-white transition-colors ${
                        task.status === "DONE" ? "line-through text-[#444748]" : ""
                      }`}
                    >
                      {task.title}
                    </p>
                    <div className="flex items-center justify-between">
                      <StatusBadge status={task.priority} />
                      <span className="text-xs text-[#a1a1aa] ws-label truncate max-w-[120px]">
                        {task.productName}
                      </span>
                    </div>
                  </button>
                ))}

                {colTasks.length === 0 && (
                  <div className="border border-dashed border-[#27272a] rounded-lg p-4 text-center">
                    <p className="text-xs text-[#444748] ws-label">No tasks</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

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

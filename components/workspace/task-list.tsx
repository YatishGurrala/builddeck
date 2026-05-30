"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, Circle, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/workspace/status-badge";
import {
  createWorkspaceTaskAction,
  updateWorkspaceTaskAction,
  deleteWorkspaceTaskAction,
} from "@/actions/workspace/tasks";

type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE" | "BLOCKED";

const statusIcon: Record<TaskStatus, React.ReactNode> = {
  TODO: <Circle className="h-4 w-4 text-zinc-400" />,
  IN_PROGRESS: <Clock className="h-4 w-4 text-blue-500" />,
  DONE: <CheckCircle2 className="h-4 w-4 text-green-500" />,
  BLOCKED: <AlertCircle className="h-4 w-4 text-red-500" />,
};

const STATUS_OPTIONS: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE", "BLOCKED"];

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
}

interface TaskListProps {
  productId: string;
  tasks: Task[];
}

export function TaskList({ productId, tasks }: TaskListProps) {
  const [isPending, startTransition] = useTransition();
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  function handleAdd() {
    if (!newTitle.trim()) return;
    const formData = new FormData();
    formData.set("title", newTitle.trim());
    startTransition(async () => {
      await createWorkspaceTaskAction(productId, formData);
      setNewTitle("");
      setIsAdding(false);
    });
  }

  function handleStatusChange(task: Task, newStatus: TaskStatus) {
    const formData = new FormData();
    formData.set("status", newStatus);
    startTransition(async () => {
      await updateWorkspaceTaskAction(task.id, productId, formData);
    });
  }

  function handleDelete(taskId: string) {
    startTransition(async () => {
      await deleteWorkspaceTaskAction(taskId, productId);
    });
  }

  const grouped = STATUS_OPTIONS.reduce<Record<TaskStatus, Task[]>>((acc, s) => {
    acc[s] = tasks.filter((t) => t.status === s);
    return acc;
  }, { TODO: [], IN_PROGRESS: [], DONE: [], BLOCKED: [] });

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setIsAdding(true)} disabled={isAdding}>
          <Plus className="h-4 w-4 mr-1" /> Add Task
        </Button>
      </div>

      {isAdding && (
        <div className="flex gap-2 items-center p-3 rounded-lg border border-[var(--primary)] bg-[var(--surface)]">
          <Input
            autoFocus
            placeholder="Task title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); if (e.key === "Escape") { setIsAdding(false); setNewTitle(""); } }}
            className="h-8 text-sm"
          />
          <Button size="sm" onClick={handleAdd} disabled={isPending || !newTitle.trim()}>Add</Button>
          <Button size="sm" variant="outline" onClick={() => { setIsAdding(false); setNewTitle(""); }}>Cancel</Button>
        </div>
      )}

      {STATUS_OPTIONS.map((status) => {
        const group = grouped[status];
        if (group.length === 0) return null;
        return (
          <div key={status}>
            <div className="flex items-center gap-2 mb-2">
              {statusIcon[status]}
              <span className="text-sm font-medium text-[var(--on-surface)]">
                <StatusBadge status={status} />
              </span>
              <span className="text-xs text-[var(--on-surface-variant)]">({group.length})</span>
            </div>
            <div className="space-y-1.5 pl-6">
              {group.map((task) => (
                <div
                  key={task.id}
                  className="group flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-[var(--surface-container)] transition-colors"
                >
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task, e.target.value as TaskStatus)}
                    disabled={isPending}
                    className="text-xs rounded border-none bg-transparent text-[var(--on-surface-variant)] cursor-pointer focus:outline-none"
                  >
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                  </select>
                  <span className={`flex-1 text-sm ${task.status === "DONE" ? "line-through text-[var(--on-surface-variant)]" : "text-[var(--on-surface)]"}`}>
                    {task.title}
                  </span>
                  <StatusBadge status={task.priority} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  <button
                    onClick={() => handleDelete(task.id)}
                    disabled={isPending}
                    className="opacity-0 group-hover:opacity-100 text-[var(--on-surface-variant)] hover:text-red-500 transition-all"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {tasks.length === 0 && !isAdding && (
        <p className="text-sm text-center text-[var(--on-surface-variant)] py-8">
          No tasks yet. Add your first task to get started.
        </p>
      )}
    </div>
  );
}

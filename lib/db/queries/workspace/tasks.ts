import { getRecords, getRecord, createRecord, updateRecord, deleteRecord } from "@/lib/buildstack/records";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE" | "BLOCKED";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

interface TaskData {
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string | null;
  productId: string;
  userId: string;
}

export async function getWorkspaceTasks(productId: string, userId: string) {
  const all = await getRecords<TaskData>("workspace_tasks", userId);
  return all
    .filter((r) => r.data.productId === productId)
    .sort((a, b) => a.data.status.localeCompare(b.data.status) || a.createdAt.localeCompare(b.createdAt))
    .map((r) => ({ id: r.id, ...r.data, createdAt: new Date(r.createdAt), updatedAt: new Date(r.updatedAt) }));
}

export async function createWorkspaceTask(userId: string, data: { title: string; description?: string; status?: TaskStatus; priority?: TaskPriority; dueDate?: Date; productId: string; }) {
  return createRecord<TaskData>("workspace_tasks", userId, {
    status: "TODO",
    priority: "LOW",
    ...data,
    dueDate: data.dueDate ? data.dueDate.toISOString() : null,
    userId,
  });
}

export async function updateWorkspaceTask(id: string, userId: string, data: Partial<{ title: string; description: string; status: TaskStatus; priority: TaskPriority; dueDate: Date | null; }>) {
  const record = await getRecord<TaskData>(id);
  if (!record || record.ownerId !== userId) throw new Error("Not found");
  return updateRecord<TaskData>(id, {
    ...data,
    dueDate: data.dueDate !== undefined ? (data.dueDate ? data.dueDate.toISOString() : null) : undefined,
  });
}

export async function deleteWorkspaceTask(id: string, userId: string) {
  const record = await getRecord<TaskData>(id);
  if (!record || record.ownerId !== userId) throw new Error("Not found");
  return deleteRecord(id);
}

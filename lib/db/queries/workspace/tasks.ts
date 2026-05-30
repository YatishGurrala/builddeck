import { prisma } from "@/lib/db/prisma";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE" | "BLOCKED";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export async function getWorkspaceTasks(productId: string, userId: string) {
  return prisma.workspaceTask.findMany({
    where: { productId, userId },
    orderBy: [{ status: "asc" }, { createdAt: "asc" }],
  });
}

export async function createWorkspaceTask(
  userId: string,
  data: {
    title: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    dueDate?: Date;
    productId: string;
  }
) {
  return prisma.workspaceTask.create({ data: { ...data, userId } });
}

export async function updateWorkspaceTask(
  id: string,
  userId: string,
  data: Partial<{
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: Date | null;
  }>
) {
  return prisma.workspaceTask.updateMany({
    where: { id, userId },
    data,
  });
}

export async function deleteWorkspaceTask(id: string, userId: string) {
  return prisma.workspaceTask.deleteMany({ where: { id, userId } });
}

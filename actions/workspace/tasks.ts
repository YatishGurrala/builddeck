"use server";

import { auth } from "@/lib/auth/config";
import { revalidatePath } from "next/cache";
import {
  createWorkspaceTask,
  updateWorkspaceTask,
  deleteWorkspaceTask,
} from "@/lib/db/queries/workspace/tasks";
import type { ActionResponse } from "@/types";

export async function createWorkspaceTaskAction(
  productId: string,
  formData: FormData
): Promise<ActionResponse> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Not authenticated" };

  const title = formData.get("title") as string;
  if (!title?.trim()) return { success: false, error: "Task title is required" };

  await createWorkspaceTask(session.user.id, {
    title: title.trim(),
    description: (formData.get("description") as string) || undefined,
    status: (formData.get("status") as "TODO" | "IN_PROGRESS" | "DONE" | "BLOCKED") || "TODO",
    priority: (formData.get("priority") as "LOW" | "MEDIUM" | "HIGH") || "MEDIUM",
    productId,
  });

  revalidatePath(`/dashboard/workspace/products/${productId}`);
  return { success: true };
}

export async function updateWorkspaceTaskAction(
  id: string,
  productId: string,
  formData: FormData
): Promise<ActionResponse> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Not authenticated" };

  await updateWorkspaceTask(id, session.user.id, {
    title: (formData.get("title") as string) || undefined,
    description: (formData.get("description") as string) || undefined,
    status: (formData.get("status") as "TODO" | "IN_PROGRESS" | "DONE" | "BLOCKED") || undefined,
    priority: (formData.get("priority") as "LOW" | "MEDIUM" | "HIGH") || undefined,
  });

  revalidatePath(`/dashboard/workspace/products/${productId}`);
  return { success: true };
}

export async function deleteWorkspaceTaskAction(
  id: string,
  productId: string
): Promise<ActionResponse> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Not authenticated" };

  await deleteWorkspaceTask(id, session.user.id);
  revalidatePath(`/dashboard/workspace/products/${productId}`);
  return { success: true };
}

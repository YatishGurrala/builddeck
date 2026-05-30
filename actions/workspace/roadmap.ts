"use server";

import { auth } from "@/lib/auth/config";
import { revalidatePath } from "next/cache";
import {
  createRoadmapItem,
  updateRoadmapItem,
  deleteRoadmapItem,
} from "@/lib/db/queries/workspace/roadmap";
import type { ActionResponse } from "@/types";

export async function createRoadmapItemAction(
  productId: string,
  formData: FormData
): Promise<ActionResponse> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Not authenticated" };

  const title = formData.get("title") as string;
  if (!title?.trim()) return { success: false, error: "Roadmap item title is required" };

  await createRoadmapItem(session.user.id, {
    title: title.trim(),
    description: (formData.get("description") as string) || undefined,
    status: (formData.get("status") as "PLANNED" | "IN_PROGRESS" | "COMPLETED") || "PLANNED",
    productId,
  });

  revalidatePath(`/dashboard/workspace/products/${productId}`);
  return { success: true };
}

export async function updateRoadmapItemAction(
  id: string,
  productId: string,
  data: Partial<{
    title: string;
    description: string;
    status: "PLANNED" | "IN_PROGRESS" | "COMPLETED";
    order: number;
  }>
): Promise<ActionResponse> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Not authenticated" };

  await updateRoadmapItem(id, session.user.id, data);
  revalidatePath(`/dashboard/workspace/products/${productId}`);
  return { success: true };
}

export async function deleteRoadmapItemAction(
  id: string,
  productId: string
): Promise<ActionResponse> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Not authenticated" };

  await deleteRoadmapItem(id, session.user.id);
  revalidatePath(`/dashboard/workspace/products/${productId}`);
  return { success: true };
}

"use server";

import { auth } from "@/lib/auth/config";
import { revalidatePath } from "next/cache";
import {
  createWorkspaceDoc,
  updateWorkspaceDoc,
  deleteWorkspaceDoc,
} from "@/lib/db/queries/workspace/docs";
import type { ActionResponse } from "@/types";

export async function createWorkspaceDocAction(
  productId: string,
  formData: FormData
): Promise<ActionResponse> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Not authenticated" };

  const title = formData.get("title") as string;
  if (!title?.trim()) return { success: false, error: "Doc title is required" };

  await createWorkspaceDoc(session.user.id, {
    title: title.trim(),
    content: (formData.get("content") as string) || "",
    productId,
  });

  revalidatePath(`/dashboard/workspace/products/${productId}`);
  return { success: true };
}

export async function updateWorkspaceDocAction(
  id: string,
  productId: string,
  formData: FormData
): Promise<ActionResponse> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Not authenticated" };

  await updateWorkspaceDoc(id, session.user.id, {
    title: (formData.get("title") as string) || undefined,
    content: (formData.get("content") as string) ?? undefined,
  });

  revalidatePath(`/dashboard/workspace/products/${productId}`);
  return { success: true };
}

export async function deleteWorkspaceDocAction(
  id: string,
  productId: string
): Promise<ActionResponse> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Not authenticated" };

  await deleteWorkspaceDoc(id, session.user.id);
  revalidatePath(`/dashboard/workspace/products/${productId}`);
  return { success: true };
}

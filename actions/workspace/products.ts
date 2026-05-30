"use server";

import { auth } from "@/lib/auth/config";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createWorkspaceProduct,
  updateWorkspaceProduct,
  deleteWorkspaceProduct,
  type WorkspaceProductStatus,
  type RoadmapPhase,
} from "@/lib/db/queries/workspace/products";
import type { ActionResponse } from "@/types";

export async function createWorkspaceProductAction(
  formData: FormData
): Promise<ActionResponse> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Not authenticated" };

  const name = formData.get("name") as string;
  if (!name?.trim()) return { success: false, error: "Product name is required" };

  const product = await createWorkspaceProduct(session.user.id, {
    name: name.trim(),
    tagline: (formData.get("tagline") as string) || undefined,
    description: (formData.get("description") as string) || undefined,
    websiteUrl: (formData.get("websiteUrl") as string) || undefined,
    status: ((formData.get("status") as string) || undefined) as WorkspaceProductStatus | undefined,
    roadmapPhase: ((formData.get("roadmapPhase") as string) || undefined) as RoadmapPhase | undefined,
  });

  revalidatePath("/dashboard/workspace/products");
  redirect(`/dashboard/workspace/products/${product.id}`);
}

export async function updateWorkspaceProductAction(
  id: string,
  formData: FormData
): Promise<ActionResponse> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Not authenticated" };

  const name = formData.get("name") as string;
  if (!name?.trim()) return { success: false, error: "Product name is required" };

  await updateWorkspaceProduct(id, session.user.id, {
    name: name.trim(),
    tagline: (formData.get("tagline") as string) || undefined,
    description: (formData.get("description") as string) || undefined,
    websiteUrl: (formData.get("websiteUrl") as string) || undefined,
    status: ((formData.get("status") as string) || undefined) as WorkspaceProductStatus | undefined,
    roadmapPhase: ((formData.get("roadmapPhase") as string) || undefined) as RoadmapPhase | undefined,
  });

  revalidatePath(`/dashboard/workspace/products/${id}`);
  revalidatePath("/dashboard/workspace/products");
  redirect(`/dashboard/workspace/products/${id}`);
}

export async function deleteWorkspaceProductAction(
  id: string
): Promise<ActionResponse> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Not authenticated" };

  await deleteWorkspaceProduct(id, session.user.id);
  revalidatePath("/dashboard/workspace/products");
  redirect("/dashboard/workspace/products");
}

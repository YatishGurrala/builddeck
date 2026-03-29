"use server";

import { auth } from "@/lib/auth/config";
import { revalidatePath } from "next/cache";
import {
  getAllSocialPosts,
  getSocialPostsForProduct,
  updateSocialPost,
  publishSocialPost,
  deleteSocialPost,
  regenerateDrafts,
} from "@/lib/social";
import type { ActionResponse } from "@/types";
import type { SocialPlatform, PublishResult } from "@/lib/social/types";

/**
 * Get all social posts (admin only)
 */
export async function getSocialPosts(options?: {
  status?: string;
  platform?: SocialPlatform;
}) {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return { success: false, error: "Not authorized", data: [] };
  }

  try {
    const posts = await getAllSocialPosts(options);
    return { success: true, data: posts };
  } catch (error) {
    console.error("Get social posts error:", error);
    return { success: false, error: "Failed to fetch social posts", data: [] };
  }
}

/**
 * Get social posts for a specific product
 */
export async function getProductSocialPosts(productId: string) {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return { success: false, error: "Not authorized", data: [] };
  }

  try {
    const posts = await getSocialPostsForProduct(productId);
    return { success: true, data: posts };
  } catch (error) {
    console.error("Get product social posts error:", error);
    return { success: false, error: "Failed to fetch social posts", data: [] };
  }
}

/**
 * Update a social post's content
 */
export async function editSocialPost(
  postId: string,
  content: string
): Promise<ActionResponse> {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return { success: false, error: "Not authorized" };
  }

  if (!content.trim()) {
    return { success: false, error: "Content cannot be empty" };
  }

  try {
    await updateSocialPost(postId, content);
    revalidatePath("/admin/social");
    return { success: true };
  } catch (error) {
    console.error("Update social post error:", error);
    return { success: false, error: "Failed to update post" };
  }
}

/**
 * Publish a social post to its platform
 */
export async function publishPost(postId: string): Promise<ActionResponse & { publishResult?: PublishResult }> {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return { success: false, error: "Not authorized" };
  }

  try {
    const result = await publishSocialPost(postId);
    revalidatePath("/admin/social");
    
    if (result.success) {
      return { success: true, publishResult: result };
    } else {
      return { success: false, error: result.error, publishResult: result };
    }
  } catch (error) {
    console.error("Publish social post error:", error);
    return { success: false, error: "Failed to publish post" };
  }
}

/**
 * Delete a social post
 */
export async function removeSocialPost(postId: string): Promise<ActionResponse> {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return { success: false, error: "Not authorized" };
  }

  try {
    await deleteSocialPost(postId);
    revalidatePath("/admin/social");
    return { success: true };
  } catch (error) {
    console.error("Delete social post error:", error);
    return { success: false, error: "Failed to delete post" };
  }
}

/**
 * Regenerate drafts for a product
 */
export async function regenerateProductDrafts(productId: string): Promise<ActionResponse> {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return { success: false, error: "Not authorized" };
  }

  try {
    await regenerateDrafts(productId);
    revalidatePath("/admin/social");
    return { success: true };
  } catch (error) {
    console.error("Regenerate drafts error:", error);
    return { success: false, error: "Failed to regenerate drafts" };
  }
}

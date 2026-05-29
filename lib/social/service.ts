import { XProvider, LinkedInProvider } from "./providers";
import { generateDrafts } from "./draft-generator";
import {
  createSocialPost,
  getSocialPosts as bsGetSocialPosts,
  getSocialPostsByProduct,
  getSocialPostById,
  updateSocialPostContent,
  updateSocialPostStatus,
  deleteSocialPostById,
  deleteSocialPostsByProduct,
} from "@/lib/buildstack/queries/social";
import { getProductById } from "@/lib/buildstack/queries/products";
import { getCategoryById } from "@/lib/buildstack/queries/categories";
import type { SocialPlatform, SocialProvider, PublishResult } from "./types";

// Initialize providers
const providers: Record<SocialPlatform, SocialProvider> = {
  X: new XProvider(),
  LINKEDIN: new LinkedInProvider(),
};

/**
 * Create social post drafts for a product
 * Called when a product is approved
 */
export async function createDraftsForProduct(productId: string) {
  const productRecord = await getProductById(productId);
  if (!productRecord) {
    throw new Error(`Product not found: ${productId}`);
  }

  const categoryRecord = productRecord.data.categoryId
    ? await getCategoryById(productRecord.data.categoryId)
    : null;

  const drafts = generateDrafts({
    name: productRecord.data.name,
    tagline: productRecord.data.tagline,
    description: productRecord.data.description,
    websiteUrl: productRecord.data.websiteUrl,
    category: categoryRecord ? { name: categoryRecord.data.name } : null,
  });

  const socialPosts = await Promise.all(
    drafts.map((draft) =>
      createSocialPost({
        platform: draft.platform,
        content: draft.content,
        status: "DRAFT",
        productId,
        publishedAt: null,
        publishedId: null,
        errorMessage: null,
      })
    )
  );

  return socialPosts;
}

/**
 * Get all social posts for a product
 */
export async function getSocialPostsForProduct(productId: string) {
  return getSocialPostsByProduct(productId);
}

/**
 * Get all social posts with optional filters
 */
export async function getAllSocialPosts(options?: {
  status?: string;
  platform?: SocialPlatform;
}) {
  return bsGetSocialPosts(options);
}

/**
 * Update a social post's content
 */
export async function updateSocialPost(postId: string, content: string) {
  return updateSocialPostContent(postId, content);
}

/**
 * Publish a social post to its platform
 */
export async function publishSocialPost(postId: string): Promise<PublishResult> {
  const post = await getSocialPostById(postId);

  if (!post) {
    return { success: false, error: "Post not found" };
  }

  if (post.data.status === "PUBLISHED") {
    return { success: false, error: "Post already published" };
  }

  const provider = providers[post.data.platform as SocialPlatform];

  if (!provider) {
    return { success: false, error: `Unknown platform: ${post.data.platform}` };
  }

  if (!provider.isConfigured()) {
    return { success: false, error: `${post.data.platform} provider is not configured` };
  }

  const result = await provider.publish(post.data.content);

  if (result.success) {
    await updateSocialPostStatus(postId, "PUBLISHED", {
      publishedAt: new Date().toISOString(),
      publishedId: result.postId,
      errorMessage: undefined,
    });
  } else {
    await updateSocialPostStatus(postId, "FAILED", {
      errorMessage: result.error,
    });
  }

  return result;
}

/**
 * Delete a social post
 */
export async function deleteSocialPost(postId: string) {
  return deleteSocialPostById(postId);
}

/**
 * Regenerate drafts for a product (delete existing drafts and create new ones)
 */
export async function regenerateDrafts(productId: string) {
  await deleteSocialPostsByProduct(productId, "DRAFT");
  return createDraftsForProduct(productId);
}

/**
 * Check if a provider is configured
 */
export function isProviderConfigured(platform: SocialPlatform): boolean {
  const provider = providers[platform];
  return provider?.isConfigured() ?? false;
}

import { prisma } from "@/lib/db/prisma";
import { XProvider, LinkedInProvider } from "./providers";
import { generateDrafts } from "./draft-generator";
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
  // Get the product with its category
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { category: true },
  });
  
  if (!product) {
    throw new Error(`Product not found: ${productId}`);
  }
  
  // Generate drafts for each platform
  const drafts = generateDrafts({
    name: product.name,
    tagline: product.tagline,
    description: product.description,
    websiteUrl: product.websiteUrl,
    category: product.category,
  });
  
  // Store drafts in database
  const socialPosts = await Promise.all(
    drafts.map(draft =>
      prisma.socialPost.create({
        data: {
          platform: draft.platform,
          content: draft.content,
          status: "DRAFT",
          productId: product.id,
        },
      })
    )
  );
  
  return socialPosts;
}

/**
 * Get all social posts for a product
 */
export async function getSocialPostsForProduct(productId: string) {
  return prisma.socialPost.findMany({
    where: { productId },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Get all social posts with optional filters
 */
export async function getAllSocialPosts(options?: {
  status?: string;
  platform?: SocialPlatform;
}) {
  const where: { status?: string; platform?: string } = {};
  
  if (options?.status) {
    where.status = options.status;
  }
  
  if (options?.platform) {
    where.platform = options.platform;
  }
  
  return prisma.socialPost.findMany({
    where,
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          tagline: true,
          logoUrl: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Update a social post's content
 */
export async function updateSocialPost(postId: string, content: string) {
  return prisma.socialPost.update({
    where: { id: postId },
    data: { content },
  });
}

/**
 * Publish a social post to its platform
 */
export async function publishSocialPost(postId: string): Promise<PublishResult> {
  // Get the post
  const post = await prisma.socialPost.findUnique({
    where: { id: postId },
  });
  
  if (!post) {
    return { success: false, error: "Post not found" };
  }
  
  if (post.status === "PUBLISHED") {
    return { success: false, error: "Post already published" };
  }
  
  // Get the provider
  const provider = providers[post.platform as SocialPlatform];
  
  if (!provider) {
    return { success: false, error: `Unknown platform: ${post.platform}` };
  }
  
  if (!provider.isConfigured()) {
    return { success: false, error: `${post.platform} provider is not configured` };
  }
  
  // Attempt to publish
  const result = await provider.publish(post.content);
  
  // Update post status
  if (result.success) {
    await prisma.socialPost.update({
      where: { id: postId },
      data: {
        status: "PUBLISHED",
        publishedAt: new Date(),
        publishedId: result.postId,
        errorMessage: null,
      },
    });
  } else {
    await prisma.socialPost.update({
      where: { id: postId },
      data: {
        status: "FAILED",
        errorMessage: result.error,
      },
    });
  }
  
  return result;
}

/**
 * Delete a social post
 */
export async function deleteSocialPost(postId: string) {
  return prisma.socialPost.delete({
    where: { id: postId },
  });
}

/**
 * Regenerate drafts for a product (delete existing drafts and create new ones)
 */
export async function regenerateDrafts(productId: string) {
  // Delete existing draft posts (not published ones)
  await prisma.socialPost.deleteMany({
    where: {
      productId,
      status: "DRAFT",
    },
  });
  
  // Create new drafts
  return createDraftsForProduct(productId);
}

/**
 * Check if a provider is configured
 */
export function isProviderConfigured(platform: SocialPlatform): boolean {
  const provider = providers[platform];
  return provider?.isConfigured() ?? false;
}

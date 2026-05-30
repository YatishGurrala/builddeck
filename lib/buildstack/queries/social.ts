import { getRecords, createRecord, updateRecord, deleteRecord, getRecord } from "@/lib/buildstack/records";
import type { BsRecord } from "@/lib/buildstack/records";
import type { SocialPlatform } from "@/lib/social/types";

export interface SocialPostData {
  platform: string;
  content: string;
  status: string;
  productId: string;
  publishedAt: string | null;
  publishedId: string | null;
  errorMessage: string | null;
}

export type SocialPostRecord = BsRecord<SocialPostData>;

/** Shape expected by SocialPostCard component */
export interface SocialPostWithProduct {
  id: string;
  platform: string;
  content: string;
  status: string;
  productId: string;
  publishedAt: Date | null;
  publishedId: string | null;
  errorMessage: string | null;
  createdAt: Date;
  updatedAt: Date;
  product: {
    id: string;
    name: string;
    slug: string;
    tagline: string;
    logoUrl: string | null;
    websiteUrl: string | null;
  };
}

export async function createSocialPost(data: SocialPostData): Promise<SocialPostRecord> {
  return createRecord<SocialPostData>("social_posts", data.productId, data);
}

export async function getSocialPosts(options?: {
  status?: string;
  platform?: SocialPlatform;
}): Promise<SocialPostRecord[]> {
  let all = await getRecords<SocialPostData>("social_posts");
  if (options?.status) all = all.filter((r) => r.data.status === options.status);
  if (options?.platform) all = all.filter((r) => r.data.platform === options.platform);
  return all.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getSocialPostsByProduct(productId: string): Promise<SocialPostRecord[]> {
  return getRecords<SocialPostData>("social_posts", productId);
}

export async function getSocialPostById(id: string): Promise<SocialPostRecord | null> {
  return getRecord<SocialPostData>(id);
}

export async function updateSocialPostContent(id: string, content: string): Promise<SocialPostRecord> {
  return updateRecord<SocialPostData>(id, { content });
}

export async function updateSocialPostStatus(
  id: string,
  status: string,
  extra?: { publishedAt?: string; publishedId?: string; errorMessage?: string }
): Promise<SocialPostRecord> {
  return updateRecord<SocialPostData>(id, { status, ...extra });
}

export async function deleteSocialPostById(id: string): Promise<void> {
  return deleteRecord(id);
}

export async function deleteSocialPostsByProduct(productId: string, status = "DRAFT"): Promise<void> {
  const posts = await getSocialPostsByProduct(productId);
  const toDelete = posts.filter((p) => p.data.status === status);
  await Promise.all(toDelete.map((p) => deleteRecord(p.id)));
}

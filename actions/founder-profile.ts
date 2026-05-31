"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth/config";
import {
  activateBlockForUser,
  createFounderLinkForUser,
  createFounderProductForUser,
  deactivateBlockForUser,
  deleteFounderLinkForUser,
  deleteFounderProductForUser,
  getFounderProfileForUser,
  moveFounderBlockForUser,
  moveFounderLinkForUser,
  moveFounderProductForUser,
  setFounderBlockOrderForUser,
  setFounderLinkOrderForUser,
  setFounderPublishedForUser,
  setFounderThemeForUser,
  toggleFounderLinkForUser,
  updateFounderLinkForUser,
  updateFounderProductForUser,
  updateFounderProfileForUser,
} from "@/lib/founder-profile/store";
import type { CreatorBlockType } from "@/lib/founder-profile/editor-data";
import type { FounderProductStatus, FounderThemeId } from "@/lib/founder-profile/types";

async function requireSessionUser() {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    throw new Error("Unauthorized");
  }
  const sessionUser = session.user as typeof session.user & { username?: string | null };
  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name || null,
    username: sessionUser.username || null,
    avatarUrl: session.user.image || null,
  };
}

async function revalidateFounderPaths(userId: string) {
  const session = await auth();
  const sessionUser = session?.user as ({ username?: string | null } & Record<string, unknown>) | undefined;
  const user = {
    id: userId,
    email: session?.user?.email || "",
    name: session?.user?.name || null,
    username: sessionUser?.username || null,
    avatarUrl: session?.user?.image || null,
  };

  const profile = await getFounderProfileForUser(user);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/editor");
  revalidatePath("/dashboard/blocks");
  revalidatePath("/dashboard/themes");
  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard/links");
  revalidatePath("/dashboard/products");
  revalidatePath("/dashboard/analytics");
  revalidatePath(`/${profile.username}`);
}

export async function saveFounderProfile(formData: FormData) {
  const user = await requireSessionUser();
  await updateFounderProfileForUser(user.id, {
    username: (formData.get("username") as string) || user.username || "founder",
    displayName: (formData.get("displayName") as string) || user.name || "Founder",
    headline: (formData.get("headline") as string) || "Building in public",
    bio: (formData.get("bio") as string) || "",
    currentlyBuilding: (formData.get("currentlyBuilding") as string) || "",
    featuredContentTitle: (formData.get("featuredContentTitle") as string) || "",
    featuredContentDescription: (formData.get("featuredContentDescription") as string) || "",
    featuredContentUrl: (formData.get("featuredContentUrl") as string) || "",
    videoEmbedTitle: (formData.get("videoEmbedTitle") as string) || "",
    videoEmbedUrl: (formData.get("videoEmbedUrl") as string) || "",
    testimonialQuote: (formData.get("testimonialQuote") as string) || "",
    testimonialAuthor: (formData.get("testimonialAuthor") as string) || "",
    testimonialRole: (formData.get("testimonialRole") as string) || "",
    newsletterHeadline: (formData.get("newsletterHeadline") as string) || "",
    newsletterDescription: (formData.get("newsletterDescription") as string) || "",
    newsletterCtaLabel: (formData.get("newsletterCtaLabel") as string) || "",
    newsletterCtaUrl: (formData.get("newsletterCtaUrl") as string) || "",
  });

  await revalidateFounderPaths(user.id);
}

export async function applyFounderTheme(formData: FormData) {
  const user = await requireSessionUser();
  const theme = (formData.get("theme") as FounderThemeId) || "founder-gradient";
  await setFounderThemeForUser(user.id, theme);
  await revalidateFounderPaths(user.id);
}

export async function toggleFounderPublish() {
  const user = await requireSessionUser();
  const profile = await getFounderProfileForUser(user);
  await setFounderPublishedForUser(user.id, !profile.isPublished);
  await revalidateFounderPaths(user.id);
}

export async function addFounderLink(formData: FormData) {
  const user = await requireSessionUser();
  await createFounderLinkForUser(user.id, {
    title: (formData.get("title") as string) || "New Link",
    url: (formData.get("url") as string) || "#",
    description: (formData.get("description") as string) || "",
  });
  await revalidateFounderPaths(user.id);
}

export async function saveFounderLink(formData: FormData) {
  const user = await requireSessionUser();
  const linkId = (formData.get("linkId") as string) || "";
  if (!linkId) return;

  await updateFounderLinkForUser(user.id, linkId, {
    title: (formData.get("title") as string) || "",
    url: (formData.get("url") as string) || "",
    description: (formData.get("description") as string) || "",
  });
  await revalidateFounderPaths(user.id);
}

export async function toggleFounderLink(formData: FormData) {
  const user = await requireSessionUser();
  const linkId = (formData.get("linkId") as string) || "";
  if (!linkId) return;
  await toggleFounderLinkForUser(user.id, linkId);
  await revalidateFounderPaths(user.id);
}

export async function removeFounderLink(formData: FormData) {
  const user = await requireSessionUser();
  const linkId = (formData.get("linkId") as string) || "";
  if (!linkId) return;
  await deleteFounderLinkForUser(user.id, linkId);
  await revalidateFounderPaths(user.id);
}

export async function moveFounderLink(formData: FormData) {
  const user = await requireSessionUser();
  const linkId = (formData.get("linkId") as string) || "";
  const direction = (formData.get("direction") as "up" | "down") || "up";
  if (!linkId) return;
  await moveFounderLinkForUser(user.id, linkId, direction);
  await revalidateFounderPaths(user.id);
}

export async function addFounderProduct(formData: FormData) {
  const user = await requireSessionUser();
  const status = ((formData.get("status") as string) || "building") as FounderProductStatus;
  await createFounderProductForUser(user.id, {
    name: (formData.get("name") as string) || "New Product",
    description: (formData.get("description") as string) || "Describe your product",
    url: (formData.get("url") as string) || "",
    imageUrl: (formData.get("imageUrl") as string) || "",
    status,
  });
  await revalidateFounderPaths(user.id);
}

export async function saveFounderProduct(formData: FormData) {
  const user = await requireSessionUser();
  const productId = (formData.get("productId") as string) || "";
  if (!productId) return;

  const status = ((formData.get("status") as string) || "building") as FounderProductStatus;
  await updateFounderProductForUser(user.id, productId, {
    name: (formData.get("name") as string) || "",
    description: (formData.get("description") as string) || "",
    url: (formData.get("url") as string) || "",
    imageUrl: (formData.get("imageUrl") as string) || "",
    status,
  });
  await revalidateFounderPaths(user.id);
}

export async function removeFounderProduct(formData: FormData) {
  const user = await requireSessionUser();
  const productId = (formData.get("productId") as string) || "";
  if (!productId) return;
  await deleteFounderProductForUser(user.id, productId);
  await revalidateFounderPaths(user.id);
}

export async function moveFounderProduct(formData: FormData) {
  const user = await requireSessionUser();
  const productId = (formData.get("productId") as string) || "";
  const direction = (formData.get("direction") as "up" | "down") || "up";
  if (!productId) return;
  await moveFounderProductForUser(user.id, productId, direction);
  await revalidateFounderPaths(user.id);
}

export async function activateCreatorBlock(formData: FormData) {
  const user = await requireSessionUser();
  const type = formData.get("type") as CreatorBlockType;
  if (!type) return;
  await activateBlockForUser(user.id, type);
  await revalidateFounderPaths(user.id);
}

export async function deactivateCreatorBlock(formData: FormData) {
  const user = await requireSessionUser();
  const type = formData.get("type") as CreatorBlockType;
  if (!type) return;
  await deactivateBlockForUser(user.id, type);
  await revalidateFounderPaths(user.id);
}

export async function moveCreatorBlock(formData: FormData) {
  const user = await requireSessionUser();
  const blockId = (formData.get("blockId") as string) || "";
  const direction = (formData.get("direction") as "up" | "down") || "up";
  if (!blockId) return;
  await moveFounderBlockForUser(user.id, blockId, direction);
  await revalidateFounderPaths(user.id);
}

export async function reorderFounderLinks(formData: FormData) {
  const user = await requireSessionUser();
  const rawOrder = (formData.get("order") as string) || "[]";
  const order = JSON.parse(rawOrder) as string[];
  if (!Array.isArray(order) || order.length === 0) return;
  await setFounderLinkOrderForUser(user.id, order);
  await revalidateFounderPaths(user.id);
}

export async function reorderCreatorBlocks(formData: FormData) {
  const user = await requireSessionUser();
  const rawOrder = (formData.get("order") as string) || "[]";
  const order = JSON.parse(rawOrder) as string[];
  if (!Array.isArray(order) || order.length === 0) return;
  await setFounderBlockOrderForUser(user.id, order);
  await revalidateFounderPaths(user.id);
}

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { slugify } from "@/lib/utils";
import {
  getDefaultMockFounderProfile,
  getMockFounderProfileByUsername,
} from "./mock-data";
import type {
  FounderAnalyticsEvent,
  FounderAnalyticsEventType,
  FounderProduct,
  FounderProductStatus,
  FounderProfile,
  FounderSocialLink,
  FounderThemeId,
} from "./types";
import {
  getCreatorBlockTemplates,
  getMockCreatorPageBlocks,
  type CreatorBlockType,
  type CreatorPageBlock,
} from "./editor-data";

interface FounderWorkspaceRecord {
  profile: FounderProfile;
  blocks: CreatorPageBlock[];
  analytics: FounderAnalyticsEvent[];
  usernameAliases?: string[];
}

interface FounderStoreFile {
  workspaces: Record<string, FounderWorkspaceRecord>;
}

interface BasicUser {
  id: string;
  email: string;
  name: string | null;
  username: string | null;
  avatarUrl?: string | null;
}

interface UpdateProfileInput {
  username: string;
  displayName: string;
  avatarUrl?: string;
  headline: string;
  bio?: string;
  currentlyBuilding?: string;
  featuredContentTitle?: string;
  featuredContentDescription?: string;
  featuredContentUrl?: string;
  videoEmbedTitle?: string;
  videoEmbedUrl?: string;
  testimonialQuote?: string;
  testimonialAuthor?: string;
  testimonialRole?: string;
  newsletterHeadline?: string;
  newsletterDescription?: string;
  newsletterCtaLabel?: string;
  newsletterCtaUrl?: string;
}

interface UpsertLinkInput {
  title: string;
  url: string;
  description?: string;
}

interface UpsertProductInput {
  name: string;
  description: string;
  url?: string;
  imageUrl?: string;
  status: FounderProductStatus;
}

type MoveDirection = "up" | "down";

const STORE_DIR = path.join(process.cwd(), ".data");
const STORE_PATH = path.join(STORE_DIR, "founder-workspaces.json");

function dedupeIds<T extends { id: string }>(items: T[], suffix: string) {
  const seen = new Map<string, number>();
  let changed = false;

  const nextItems = items.map((item, index) => {
    const count = seen.get(item.id) || 0;
    seen.set(item.id, count + 1);

    if (count === 0) {
      return item;
    }

    changed = true;
    return {
      ...item,
      id: `${item.id}__${suffix}_${index + 1}`,
    };
  });

  return { items: nextItems, changed };
}

function normalizeWorkspaceIds(workspace: FounderWorkspaceRecord, userId: string) {
  const dedupedProducts = dedupeIds(workspace.profile.products, `product_${userId}`);
  const dedupedLinks = dedupeIds(workspace.profile.links, `link_${userId}`);
  const dedupedBlocks = dedupeIds(workspace.blocks, `block_${userId}`);

  const changed = dedupedProducts.changed || dedupedLinks.changed || dedupedBlocks.changed;
  if (!changed) {
    return { workspace, changed: false };
  }

  return {
    changed: true,
    workspace: {
      ...workspace,
      profile: {
        ...workspace.profile,
        products: dedupedProducts.items,
        links: dedupedLinks.items,
      },
      blocks: dedupedBlocks.items,
    },
  };
}

function ensureCurrentProjectBlock(workspace: FounderWorkspaceRecord, userId: string) {
  const desiredIndex = 2;
  const sortedBlocks = [...workspace.blocks].sort((a, b) => a.position - b.position);
  const currentProjectIndex = sortedBlocks.findIndex((block) => block.type === "current-project");

  if (currentProjectIndex >= 0) {
    if (currentProjectIndex === desiredIndex) {
      return { workspace, changed: false };
    }

    const nextBlocks = [...sortedBlocks];
    const [currentProjectBlock] = nextBlocks.splice(currentProjectIndex, 1);
    nextBlocks.splice(Math.min(desiredIndex, nextBlocks.length), 0, currentProjectBlock);

    return {
      changed: true,
      workspace: {
        ...workspace,
        blocks: nextBlocks.map((block, index) => ({ ...block, position: index + 1 })),
      },
    };
  }

  const template = getCreatorBlockTemplates().find((block) => block.type === "current-project");
  if (!template) {
    return { workspace, changed: false };
  }

  const nextBlocks = [...sortedBlocks];
  nextBlocks.splice(Math.min(desiredIndex, nextBlocks.length), 0, {
    id: `block_${userId}_current_project`,
    type: template.type,
    title: template.title,
    description: template.description,
    position: 0,
    isActive: true,
  });

  return {
    changed: true,
    workspace: {
      ...workspace,
      blocks: nextBlocks.map((block, index) => ({ ...block, position: index + 1 })),
    },
  };
}

async function readStore(): Promise<FounderStoreFile> {
  try {
    const raw = await readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as FounderStoreFile;
    const store = parsed.workspaces ? parsed : { workspaces: {} };

    let changed = false;
    for (const [userId, workspace] of Object.entries(store.workspaces)) {
      const normalized = normalizeWorkspaceIds(workspace, userId);
      const withCurrentProject = ensureCurrentProjectBlock(normalized.workspace, userId);
      if (!normalized.changed && !withCurrentProject.changed) continue;
      store.workspaces[userId] = withCurrentProject.workspace;
      changed = true;
    }

    if (changed) {
      await writeStore(store);
    }

    return store;
  } catch {
    return { workspaces: {} };
  }
}

async function writeStore(store: FounderStoreFile) {
  await mkdir(STORE_DIR, { recursive: true });
  await writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

function buildDefaultWorkspace(user: BasicUser): FounderWorkspaceRecord {
  const seed = getDefaultMockFounderProfile();
  const usernameBase = user.username || user.name || user.email.split("@")[0] || "founder";
  const normalizedUsername = slugify(usernameBase).slice(0, 30) || `founder-${user.id.slice(-4)}`;

  return {
    profile: {
      ...seed,
      id: `profile_${user.id}`,
      userId: user.id,
      username: normalizedUsername,
      displayName: user.name || seed.displayName,
      headline: seed.headline,
      bio: seed.bio,
      avatarUrl: user.avatarUrl || seed.avatarUrl,
      isPublished: true,
      links: seed.links.map((link, index) => ({
        ...link,
        id: `link_${user.id}_${index + 1}`,
        profileId: `profile_${user.id}`,
      })),
      products: seed.products.map((product, index) => ({
        ...product,
        id: `product_${user.id}_${index + 1}`,
        profileId: `profile_${user.id}`,
      })),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    blocks: getMockCreatorPageBlocks().map((block, index) => ({
      ...block,
      id: `block_${user.id}_${index + 1}`,
    })),
    analytics: [],
    usernameAliases: [],
  };
}

function cleanText(value: string | null | undefined, fallback = "") {
  return (value || fallback).trim();
}

function reorderByPosition<T extends { id: string; position: number }>(
  items: T[],
  itemId: string,
  direction: MoveDirection,
): T[] {
  const sorted = [...items].sort((a, b) => a.position - b.position);
  const currentIndex = sorted.findIndex((item) => item.id === itemId);
  if (currentIndex < 0) return sorted;

  const nextIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
  if (nextIndex < 0 || nextIndex >= sorted.length) return sorted;

  const [item] = sorted.splice(currentIndex, 1);
  sorted.splice(nextIndex, 0, item);

  return sorted.map((entry, index) => ({ ...entry, position: index + 1 }));
}

function reorderByExplicitIds<T extends { id: string; position: number }>(items: T[], orderedIds: string[]) {
  const itemsById = new Map(items.map((item) => [item.id, item]));
  const seen = new Set<string>();

  const orderedItems = orderedIds
    .map((id) => {
      const item = itemsById.get(id);
      if (!item) return null;
      seen.add(id);
      return item;
    })
    .filter((item): item is T => item !== null);

  const remainder = [...items]
    .sort((a, b) => a.position - b.position)
    .filter((item) => !seen.has(item.id));

  return [...orderedItems, ...remainder].map((item, index) => ({
    ...item,
    position: index + 1,
  }));
}

async function updateWorkspace(
  userId: string,
  updater: (workspace: FounderWorkspaceRecord) => FounderWorkspaceRecord,
) {
  const store = await readStore();
  const existing = store.workspaces[userId];
  if (!existing) return null;
  store.workspaces[userId] = updater(existing);
  await writeStore(store);
  return store.workspaces[userId];
}

export async function getFounderWorkspaceForUser(user: BasicUser) {
  const store = await readStore();
  if (!store.workspaces[user.id]) {
    store.workspaces[user.id] = buildDefaultWorkspace(user);
    await writeStore(store);
  }
  return store.workspaces[user.id];
}

export async function getFounderProfileForUser(user: BasicUser): Promise<FounderProfile> {
  const workspace = await getFounderWorkspaceForUser(user);
  return workspace.profile;
}

export async function getFounderBlocksForUser(user: BasicUser): Promise<CreatorPageBlock[]> {
  const workspace = await getFounderWorkspaceForUser(user);
  return [...workspace.blocks].sort((a, b) => a.position - b.position);
}

export async function getFounderProfileByUsername(username: string): Promise<FounderProfile | null> {
  const normalized = username.toLowerCase();
  const store = await readStore();
  for (const workspace of Object.values(store.workspaces)) {
    const aliases = (workspace.usernameAliases || []).map((alias) => alias.toLowerCase());
    if (workspace.profile.username.toLowerCase() === normalized || aliases.includes(normalized)) {
      return workspace.profile;
    }
  }
  return getMockFounderProfileByUsername(normalized);
}

export async function getFounderPublicWorkspaceByUsername(username: string): Promise<{
  profile: FounderProfile;
  blocks: CreatorPageBlock[];
} | null> {
  const normalized = username.toLowerCase();
  const store = await readStore();
  for (const workspace of Object.values(store.workspaces)) {
    const aliases = (workspace.usernameAliases || []).map((alias) => alias.toLowerCase());
    if (workspace.profile.username.toLowerCase() === normalized || aliases.includes(normalized)) {
      return {
        profile: workspace.profile,
        blocks: [...workspace.blocks].sort((a, b) => a.position - b.position),
      };
    }
  }

  const fallbackProfile = getMockFounderProfileByUsername(normalized);
  if (fallbackProfile) {
    return {
      profile: fallbackProfile,
      blocks: getMockCreatorPageBlocks().sort((a, b) => a.position - b.position),
    };
  }

  return null;
}

export async function updateFounderProfileForUser(userId: string, input: UpdateProfileInput) {
  return updateWorkspace(userId, (workspace) => {
    const previousUsername = workspace.profile.username;
    const nextUsername = slugify(input.username).slice(0, 30) || workspace.profile.username;
    const normalizedNext = nextUsername.toLowerCase();
    const aliases = new Set((workspace.usernameAliases || []).map((alias) => alias.toLowerCase()));
    if (previousUsername.toLowerCase() !== normalizedNext) {
      aliases.add(previousUsername.toLowerCase());
    }
    aliases.delete(normalizedNext);

    const profile = {
      ...workspace.profile,
      username: nextUsername,
      displayName: cleanText(input.displayName, workspace.profile.displayName),
      avatarUrl: cleanText(input.avatarUrl, workspace.profile.avatarUrl || ""),
      headline: cleanText(input.headline, workspace.profile.headline),
      bio: cleanText(input.bio, workspace.profile.bio || ""),
      currentlyBuilding: cleanText(input.currentlyBuilding, workspace.profile.currentlyBuilding || ""),
      featuredContent: {
        title: cleanText(
          input.featuredContentTitle,
          workspace.profile.featuredContent?.title || workspace.profile.links[0]?.title || "Featured Content",
        ),
        description: cleanText(
          input.featuredContentDescription,
          workspace.profile.featuredContent?.description ||
            workspace.profile.links[0]?.description ||
            "Highlight the post, product, or page you want visitors to see first.",
        ),
        url: cleanText(
          input.featuredContentUrl,
          workspace.profile.featuredContent?.url || workspace.profile.links[0]?.url || "",
        ),
      },
      videoEmbed: {
        title: cleanText(input.videoEmbedTitle, workspace.profile.videoEmbed?.title || "Featured Video"),
        url: cleanText(input.videoEmbedUrl, workspace.profile.videoEmbed?.url || ""),
      },
      testimonial: {
        quote: cleanText(
          input.testimonialQuote,
          workspace.profile.testimonial?.quote ||
            `${workspace.profile.displayName} ships consistently and explains the work clearly.`,
        ),
        author: cleanText(
          input.testimonialAuthor,
          workspace.profile.testimonial?.author || "Builddeck visitor",
        ),
        role: cleanText(input.testimonialRole, workspace.profile.testimonial?.role || "Founder"),
      },
      newsletterCta: {
        headline: cleanText(input.newsletterHeadline, workspace.profile.newsletterCta?.headline || "Join my newsletter"),
        description: cleanText(
          input.newsletterDescription,
          workspace.profile.newsletterCta?.description || "Weekly notes on product and distribution.",
        ),
        ctaLabel: cleanText(input.newsletterCtaLabel, workspace.profile.newsletterCta?.ctaLabel || "Subscribe"),
        ctaUrl: cleanText(input.newsletterCtaUrl, workspace.profile.newsletterCta?.ctaUrl || ""),
      },
      updatedAt: new Date(),
    };

    return { ...workspace, profile, usernameAliases: [...aliases] };
  });
}

export async function setFounderThemeForUser(userId: string, theme: FounderThemeId) {
  return updateWorkspace(userId, (workspace) => ({
    ...workspace,
    profile: {
      ...workspace.profile,
      theme,
      updatedAt: new Date(),
    },
  }));
}

export async function setFounderCurrentlyBuildingForUser(userId: string, currentlyBuilding: string) {
  return updateWorkspace(userId, (workspace) => ({
    ...workspace,
    profile: {
      ...workspace.profile,
      currentlyBuilding: cleanText(currentlyBuilding, workspace.profile.currentlyBuilding || ""),
      updatedAt: new Date(),
    },
  }));
}

export async function setFounderSocialsForUser(userId: string, socials: FounderSocialLink[]) {
  return updateWorkspace(userId, (workspace) => ({
    ...workspace,
    profile: {
      ...workspace.profile,
      socials: socials.filter((social) => cleanText(social.url).length > 0),
      updatedAt: new Date(),
    },
  }));
}

export async function setFounderPublishedForUser(userId: string, isPublished: boolean) {
  return updateWorkspace(userId, (workspace) => ({
    ...workspace,
    profile: {
      ...workspace.profile,
      isPublished,
      updatedAt: new Date(),
    },
  }));
}

export async function createFounderLinkForUser(userId: string, input: UpsertLinkInput) {
  return updateWorkspace(userId, (workspace) => {
    const links = [...workspace.profile.links];
    links.push({
      id: `link_${Date.now()}`,
      profileId: workspace.profile.id,
      title: cleanText(input.title, "New Link"),
      url: cleanText(input.url, "#"),
      description: cleanText(input.description),
      position: links.length + 1,
      isActive: true,
    });
    return {
      ...workspace,
      profile: { ...workspace.profile, links, updatedAt: new Date() },
    };
  });
}

export async function updateFounderLinkForUser(userId: string, linkId: string, input: UpsertLinkInput) {
  return updateWorkspace(userId, (workspace) => ({
    ...workspace,
    profile: {
      ...workspace.profile,
      links: workspace.profile.links.map((link) =>
        link.id === linkId
          ? {
              ...link,
              title: cleanText(input.title, link.title),
              url: cleanText(input.url, link.url),
              description: cleanText(input.description, link.description || ""),
            }
          : link,
      ),
      updatedAt: new Date(),
    },
  }));
}

export async function toggleFounderLinkForUser(userId: string, linkId: string) {
  return updateWorkspace(userId, (workspace) => ({
    ...workspace,
    profile: {
      ...workspace.profile,
      links: workspace.profile.links.map((link) =>
        link.id === linkId ? { ...link, isActive: !link.isActive } : link,
      ),
      updatedAt: new Date(),
    },
  }));
}

export async function deleteFounderLinkForUser(userId: string, linkId: string) {
  return updateWorkspace(userId, (workspace) => {
    const links = workspace.profile.links
      .filter((link) => link.id !== linkId)
      .map((link, index) => ({ ...link, position: index + 1 }));

    return {
      ...workspace,
      profile: { ...workspace.profile, links, updatedAt: new Date() },
    };
  });
}

export async function moveFounderLinkForUser(
  userId: string,
  linkId: string,
  direction: MoveDirection,
) {
  return updateWorkspace(userId, (workspace) => ({
    ...workspace,
    profile: {
      ...workspace.profile,
      links: reorderByPosition(workspace.profile.links, linkId, direction),
      updatedAt: new Date(),
    },
  }));
}

export async function setFounderLinkOrderForUser(userId: string, orderedIds: string[]) {
  return updateWorkspace(userId, (workspace) => ({
    ...workspace,
    profile: {
      ...workspace.profile,
      links: reorderByExplicitIds(workspace.profile.links, orderedIds),
      updatedAt: new Date(),
    },
  }));
}

export async function createFounderProductForUser(userId: string, input: UpsertProductInput) {
  return updateWorkspace(userId, (workspace) => {
    const products = [...workspace.profile.products];
    const product: FounderProduct = {
      id: `product_${Date.now()}`,
      profileId: workspace.profile.id,
      name: cleanText(input.name, "New Product"),
      description: cleanText(input.description, "Describe your product"),
      url: cleanText(input.url),
      imageUrl: cleanText(input.imageUrl),
      status: input.status,
      position: products.length + 1,
      isFeatured: true,
    };
    products.push(product);

    return {
      ...workspace,
      profile: { ...workspace.profile, products, updatedAt: new Date() },
    };
  });
}

export async function updateFounderProductForUser(userId: string, productId: string, input: UpsertProductInput) {
  return updateWorkspace(userId, (workspace) => {
    const targetIndex = workspace.profile.products.findIndex((product) => product.id === productId);
    if (targetIndex < 0) return workspace;

    const products = [...workspace.profile.products];
    const target = products[targetIndex];
    products[targetIndex] = {
      ...target,
      name: cleanText(input.name, target.name),
      description: cleanText(input.description, target.description),
      url: cleanText(input.url, target.url || ""),
      imageUrl: cleanText(input.imageUrl, target.imageUrl || ""),
      status: input.status,
    };

    return {
      ...workspace,
      profile: {
        ...workspace.profile,
        products,
        updatedAt: new Date(),
      },
    };
  });
}

export async function deleteFounderProductForUser(userId: string, productId: string) {
  return updateWorkspace(userId, (workspace) => {
    const products = workspace.profile.products
      .filter((product) => product.id !== productId)
      .map((product, index) => ({ ...product, position: index + 1 }));

    return {
      ...workspace,
      profile: { ...workspace.profile, products, updatedAt: new Date() },
    };
  });
}

export async function moveFounderProductForUser(
  userId: string,
  productId: string,
  direction: MoveDirection,
) {
  return updateWorkspace(userId, (workspace) => ({
    ...workspace,
    profile: {
      ...workspace.profile,
      products: reorderByPosition(workspace.profile.products, productId, direction),
      updatedAt: new Date(),
    },
  }));
}

export async function activateBlockForUser(userId: string, type: CreatorBlockType) {
  return updateWorkspace(userId, (workspace) => {
    const existing = workspace.blocks.find((block) => block.type === type);
    if (existing) {
      return {
        ...workspace,
        blocks: workspace.blocks.map((block) =>
          block.type === type ? { ...block, isActive: true } : block,
        ),
      };
    }

    const template = getCreatorBlockTemplates().find((block) => block.type === type);
    if (!template) return workspace;

    return {
      ...workspace,
      blocks: [
        ...workspace.blocks,
        {
          id: `block_${Date.now()}`,
          type,
          title: template.title,
          description: template.description,
          position: workspace.blocks.length + 1,
          isActive: true,
        },
      ],
    };
  });
}

export async function deactivateBlockForUser(userId: string, type: CreatorBlockType) {
  return updateWorkspace(userId, (workspace) => ({
    ...workspace,
    blocks: workspace.blocks.map((block) =>
      block.type === type ? { ...block, isActive: false } : block,
    ),
  }));
}

export async function setFounderBlockActiveForUser(
  userId: string,
  blockId: string,
  isActive: boolean,
) {
  return updateWorkspace(userId, (workspace) => ({
    ...workspace,
    blocks: workspace.blocks.map((block) =>
      block.id === blockId ? { ...block, isActive } : block,
    ),
  }));
}

export async function moveFounderBlockForUser(
  userId: string,
  blockId: string,
  direction: MoveDirection,
) {
  return updateWorkspace(userId, (workspace) => ({
    ...workspace,
    blocks: reorderByPosition(workspace.blocks, blockId, direction),
  }));
}

export async function setFounderBlockOrderForUser(userId: string, orderedIds: string[]) {
  return updateWorkspace(userId, (workspace) => ({
    ...workspace,
    blocks: reorderByExplicitIds(workspace.blocks, orderedIds),
  }));
}

export async function recordFounderEvent(event: {
  profileId: string;
  eventType: FounderAnalyticsEventType;
  targetId?: string;
  referrer?: string;
}) {
  const store = await readStore();
  for (const [userId, workspace] of Object.entries(store.workspaces)) {
    if (workspace.profile.id !== event.profileId) continue;

    const analyticsEvent: FounderAnalyticsEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      profileId: event.profileId,
      eventType: event.eventType,
      targetId: event.targetId,
      referrer: event.referrer,
      createdAt: new Date(),
    };

    const analytics = [...workspace.analytics, analyticsEvent].slice(-2000);
    store.workspaces[userId] = { ...workspace, analytics };
    await writeStore(store);
    return analyticsEvent;
  }

  return null;
}

export async function getFounderAnalyticsForUser(user: BasicUser) {
  const workspace = await getFounderWorkspaceForUser(user);
  const now = Date.now();
  const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

  const recent = workspace.analytics.filter((event) => {
    const createdAt = new Date(event.createdAt).getTime();
    return now - createdAt <= THIRTY_DAYS;
  });

  const countByType = (eventType: FounderAnalyticsEventType) =>
    recent.filter((event) => event.eventType === eventType).length;

  const linkClicks = recent.filter((event) => event.eventType === "link_click");
  const topLinksMap = new Map<string, number>();
  for (const event of linkClicks) {
    const key = event.targetId || "unknown";
    topLinksMap.set(key, (topLinksMap.get(key) || 0) + 1);
  }

  const topLinks = [...topLinksMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([targetId, clicks]) => ({
      targetId,
      label:
        workspace.profile.links.find((link) => link.id === targetId)?.title ||
        workspace.profile.socials.find((social) => social.platform === targetId)?.platform ||
        targetId,
      clicks,
    }));

  return {
    profileViews: countByType("profile_view"),
    linkClicks: countByType("link_click"),
    productClicks: countByType("product_click"),
    newsletterClicks: countByType("newsletter_click"),
    socialClicks: countByType("social_click"),
    topLinks,
  };
}

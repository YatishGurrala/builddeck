/**
 * Founder Profile module — shared types.
 *
 * MVP only. Backed by mock data today; structured so a Prisma-backed
 * data layer can be swapped in without touching component code.
 */

export type FounderThemeId = "minimal-dark" | "minimal-light" | "founder-gradient";

export type FounderProductStatus = "building" | "launched" | "paused";

export type FounderAnalyticsEventType =
  | "profile_view"
  | "link_click"
  | "product_click"
  | "newsletter_click"
  | "social_click";

export interface FounderSocialLink {
  platform: string; // e.g. "LinkedIn", "X", "GitHub", "Website"
  url: string;
}

export interface FounderLink {
  id: string;
  profileId?: string;
  title: string;
  url: string;
  description?: string;
  icon?: string; // lucide-react icon name (optional)
  position: number;
  isActive: boolean;
}

export interface FounderProduct {
  id: string;
  profileId?: string;
  name: string;
  description: string;
  url?: string;
  status: FounderProductStatus;
  imageUrl?: string;
  position: number;
  isFeatured: boolean;
}

export interface FounderProfile {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  headline: string;
  bio?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  theme: FounderThemeId;
  isPublished: boolean;
  socials: FounderSocialLink[];
  links: FounderLink[];
  products: FounderProduct[];
  currentlyBuilding?: string;
  newsletterCta?: {
    headline: string;
    description: string;
    ctaLabel: string;
    ctaUrl?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FounderAnalyticsEvent {
  id: string;
  profileId: string;
  eventType: FounderAnalyticsEventType;
  targetId?: string;
  referrer?: string;
  userAgent?: string;
  createdAt: Date;
}

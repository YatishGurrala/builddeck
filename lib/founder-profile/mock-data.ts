import type { FounderProfile } from "./types";

/**
 * Mock founder profiles used by the MVP public profile route and dashboard.
 * Replace with a Prisma-backed query (`getFounderProfileByUsername`) when
 * persistence is implemented — public components only need a `FounderProfile`.
 */
export const mockFounderProfiles: FounderProfile[] = [
  {
    id: "profile_001",
    userId: "user_001",
    username: "yatish",
    displayName: "Yatish Gurrala",
    headline: "Building AI-native products, founder tools, and growth systems.",
    bio: "Android engineer, product builder, and founder building tools for modern creators and startups.",
    avatarUrl: "",
    bannerUrl: "",
    theme: "founder-gradient",
    isPublished: true,
    currentlyBuilding: "Builddeck — a founder identity & product hub for builders.",
    newsletterCta: {
      headline: "Build in public with me",
      description:
        "Weekly notes on shipping AI-native products, founder tooling, and growth experiments.",
      ctaLabel: "Subscribe to the newsletter",
      ctaUrl: "https://builddeck.io",
    },
    socials: [
      { platform: "LinkedIn", url: "https://linkedin.com" },
      { platform: "X", url: "https://x.com" },
      { platform: "GitHub", url: "https://github.com" },
      { platform: "Website", url: "https://builddeck.io" },
    ],
    links: [
      {
        id: "link_001",
        profileId: "profile_001",
        title: "Visit Builddeck",
        url: "https://builddeck.io",
        description: "Founder identity and product discovery platform.",
        icon: "Sparkles",
        position: 1,
        isActive: true,
      },
      {
        id: "link_002",
        profileId: "profile_001",
        title: "Read the latest build log",
        url: "https://builddeck.io/blog",
        description: "Follow the journey of building products in public.",
        icon: "BookOpen",
        position: 2,
        isActive: true,
      },
      {
        id: "link_003",
        profileId: "profile_001",
        title: "Book a 1:1",
        url: "#",
        description: "Founder advisory and product strategy sessions.",
        icon: "Calendar",
        position: 3,
        isActive: true,
      },
    ],
    products: [
      {
        id: "product_001",
        profileId: "profile_001",
        name: "Builddeck",
        description: "A founder identity and product hub for builders.",
        url: "https://builddeck.io",
        status: "building",
        position: 1,
        isFeatured: true,
      },
      {
        id: "product_002",
        profileId: "profile_001",
        name: "RoomAccord",
        description:
          "A roommate management app for shared living agreements, chores, and expenses.",
        url: "https://roomaccord.com",
        status: "building",
        position: 2,
        isFeatured: true,
      },
      {
        id: "product_003",
        profileId: "profile_001",
        name: "ResumeLoopAI",
        description:
          "AI-powered resume improvement system for better job application conversion.",
        url: "https://resumeloopai.com",
        status: "launched",
        position: 3,
        isFeatured: true,
      },
    ],
  },
];

export function getMockFounderProfileByUsername(
  username: string,
): FounderProfile | null {
  const normalized = username.toLowerCase();
  return (
    mockFounderProfiles.find((p) => p.username.toLowerCase() === normalized) ?? null
  );
}

export function getDefaultMockFounderProfile(): FounderProfile {
  return mockFounderProfiles[0];
}

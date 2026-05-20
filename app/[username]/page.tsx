import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { FounderProfilePage } from "@/components/founder-profile/founder-profile-page";
import { getMockFounderProfileByUsername } from "@/lib/founder-profile/mock-data";

/**
 * Reserved top-level route segments — these must NOT be matched by the
 * `/[username]` catch-all. Keep this list in sync with `app/` directories
 * and any first-class slugs we want to protect.
 */
const RESERVED_USERNAMES = new Set<string>([
  "about",
  "admin",
  "api",
  "blog",
  "categories",
  "contact",
  "dashboard",
  "login",
  "logout",
  "privacy",
  "products",
  "signup",
  "submit",
  "settings",
  "support",
  "terms",
  "_next",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
]);

interface FounderProfileRouteProps {
  params: Promise<{ username: string }>;
}

async function loadProfile(username: string) {
  const normalized = username.toLowerCase();
  if (RESERVED_USERNAMES.has(normalized)) return null;
  // MVP: mock data only. Swap with `getFounderProfileByUsername(normalized)` later.
  return getMockFounderProfileByUsername(normalized);
}

export async function generateMetadata({
  params,
}: FounderProfileRouteProps): Promise<Metadata> {
  const { username } = await params;
  const profile = await loadProfile(username);
  if (!profile) {
    return { title: "Profile not found · Builddeck" };
  }
  const title = `${profile.displayName} (@${profile.username}) · Builddeck`;
  const description = profile.headline || profile.bio || "Founder profile on Builddeck";
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function FounderProfileRoute({
  params,
}: FounderProfileRouteProps) {
  const { username } = await params;
  const profile = await loadProfile(username);
  if (!profile || !profile.isPublished) notFound();
  return <FounderProfilePage profile={profile} />;
}

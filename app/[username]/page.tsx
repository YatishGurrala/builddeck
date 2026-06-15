import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { FounderProfilePage } from "@/components/founder-profile/founder-profile-page";
import { getFounderPublicWorkspaceByUsername } from "@/lib/founder-profile/store";
import { RESERVED_FOUNDER_USERNAMES } from "@/lib/founder-profile/reserved-usernames";

interface FounderProfileRouteProps {
  params: Promise<{ username: string }>;
}

async function loadProfile(username: string) {
  const normalized = username.toLowerCase();
  if (RESERVED_FOUNDER_USERNAMES.has(normalized)) return null;
  const workspace = await getFounderPublicWorkspaceByUsername(normalized);
  return workspace;
}

export async function generateMetadata({
  params,
}: FounderProfileRouteProps): Promise<Metadata> {
  const { username } = await params;
  const workspace = await loadProfile(username);
  if (!workspace || !workspace.profile.isPublished) {
    return { title: "Profile not found · Builddeck" };
  }
  const { profile } = workspace;
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
  const workspace = await loadProfile(username);
  if (!workspace || !workspace.profile.isPublished) notFound();
  return <FounderProfilePage profile={workspace.profile} blocks={workspace.blocks} />;
}

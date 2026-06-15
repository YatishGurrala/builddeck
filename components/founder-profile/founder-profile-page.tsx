import type { CreatorPageBlock } from "@/lib/founder-profile/editor-data";
import type { FounderProfile } from "@/lib/founder-profile/types";
import { FounderThemeWrapper } from "./founder-theme-wrapper";
import { FounderProfileViewTracker } from "./founder-profile-view-tracker";
import { FounderProfileSections } from "./founder-profile-sections";

interface FounderProfilePageProps {
  profile: FounderProfile;
  blocks?: CreatorPageBlock[];
}

export function FounderProfilePage({ profile, blocks }: FounderProfilePageProps) {
  return (
    <FounderThemeWrapper theme={profile.theme}>
      <FounderProfileViewTracker profileId={profile.id} />
      <FounderProfileSections profile={profile} blocks={blocks} />
    </FounderThemeWrapper>
  );
}

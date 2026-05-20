import Link from "next/link";
import { cn } from "@/lib/utils";
import type { FounderProfile } from "@/lib/founder-profile/types";
import { getFounderTheme } from "@/lib/founder-profile/themes";
import { FounderThemeWrapper } from "./founder-theme-wrapper";
import { FounderHero } from "./founder-hero";
import { FounderLinkList } from "./founder-link-card";
import { FounderProductGrid } from "./founder-product-card";
import { FounderNewsletterCta } from "./founder-newsletter-cta";
import { FounderProfileViewTracker } from "./founder-profile-view-tracker";

interface FounderProfilePageProps {
  profile: FounderProfile;
}

export function FounderProfilePage({ profile }: FounderProfilePageProps) {
  const tokens = getFounderTheme(profile.theme);

  return (
    <FounderThemeWrapper theme={profile.theme}>
      <FounderProfileViewTracker profileId={profile.id} />

      <FounderHero profile={profile} />

      {profile.currentlyBuilding ? (
        <p
          className={cn(
            "mt-8 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]",
            tokens.borderClass,
            tokens.mutedTextClass,
          )}
        >
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          Currently building · {profile.currentlyBuilding}
        </p>
      ) : null}

      <FounderLinkList links={profile.links} theme={profile.theme} profileId={profile.id} />

      <FounderProductGrid
        products={profile.products}
        theme={profile.theme}
        profileId={profile.id}
      />

      <FounderNewsletterCta profile={profile} />

      <footer className={cn("mt-16 flex flex-col items-center gap-1 text-xs", tokens.mutedTextClass)}>
        <Link href="/" className="font-semibold tracking-wide hover:underline">
          Built with Builddeck
        </Link>
        <p className="opacity-70">Founder identity · Product hub · Build in public</p>
      </footer>
    </FounderThemeWrapper>
  );
}

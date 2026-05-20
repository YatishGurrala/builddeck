import Image from "next/image";
import { cn } from "@/lib/utils";
import type { FounderProfile } from "@/lib/founder-profile/types";
import { getFounderTheme } from "@/lib/founder-profile/themes";
import { FounderSocialLinks } from "./founder-social-links";

interface FounderHeroProps {
  profile: FounderProfile;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function FounderHero({ profile }: FounderHeroProps) {
  const tokens = getFounderTheme(profile.theme);

  return (
    <section className="flex w-full flex-col items-center text-center">
      <div
        className={cn(
          "relative mb-4 h-28 w-28 overflow-hidden rounded-full border-2 shadow-xl sm:h-32 sm:w-32",
          tokens.borderClass,
          tokens.cardClass,
        )}
      >
        {profile.avatarUrl ? (
          <Image
            src={profile.avatarUrl}
            alt={profile.displayName}
            fill
            sizes="128px"
            className="object-cover"
          />
        ) : (
          <div
            className={cn(
              "flex h-full w-full items-center justify-center text-3xl font-semibold",
              tokens.accentTextClass,
            )}
          >
            {initials(profile.displayName)}
          </div>
        )}
      </div>

      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
        {profile.displayName}
      </h1>
      <p className={cn("mt-1 text-sm font-medium uppercase tracking-[0.2em]", tokens.mutedTextClass)}>
        @{profile.username}
      </p>

      {profile.headline ? (
        <p
          className={cn(
            "mt-4 max-w-2xl text-lg font-semibold sm:text-xl",
            tokens.accentTextClass,
          )}
        >
          {profile.headline}
        </p>
      ) : null}

      {profile.bio ? (
        <p className={cn("mt-3 max-w-xl text-sm leading-relaxed sm:text-base", tokens.mutedTextClass)}>
          {profile.bio}
        </p>
      ) : null}

      <FounderSocialLinks
        socials={profile.socials}
        theme={profile.theme}
        profileId={profile.id}
      />
    </section>
  );
}

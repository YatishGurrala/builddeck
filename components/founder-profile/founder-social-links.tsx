import { Github, Linkedin, Twitter, Globe, Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FounderSocialLink } from "@/lib/founder-profile/types";
import { getFounderTheme } from "@/lib/founder-profile/themes";
import type { FounderThemeId } from "@/lib/founder-profile/types";
import { TrackedAnchor } from "./tracked-anchor";

interface FounderSocialLinksProps {
  socials: FounderSocialLink[];
  theme: FounderThemeId;
  profileId: string;
}

function iconFor(platform: string) {
  const p = platform.toLowerCase();
  if (p.includes("linkedin")) return Linkedin;
  if (p === "x" || p.includes("twitter")) return Twitter;
  if (p.includes("github")) return Github;
  if (p.includes("website") || p.includes("site")) return Globe;
  return LinkIcon;
}

export function FounderSocialLinks({
  socials,
  theme,
  profileId,
}: FounderSocialLinksProps) {
  if (!socials.length) return null;
  const tokens = getFounderTheme(theme);

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
      {socials.map((s) => {
        const Icon = iconFor(s.platform);
        return (
          <TrackedAnchor
            key={`${s.platform}-${s.url}`}
            href={s.url}
            event={{ profileId, eventType: "social_click", targetId: s.platform }}
            aria-label={s.platform}
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-200 hover:scale-105",
              tokens.cardClass,
              tokens.borderClass,
              tokens.mutedTextClass,
              "hover:text-current",
            )}
          >
            <Icon className="h-4 w-4" />
          </TrackedAnchor>
        );
      })}
    </div>
  );
}

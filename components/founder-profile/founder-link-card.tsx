import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FounderLink, FounderThemeId } from "@/lib/founder-profile/types";
import { getFounderTheme } from "@/lib/founder-profile/themes";
import { TrackedAnchor } from "./tracked-anchor";

interface FounderLinkCardProps {
  link: FounderLink;
  theme: FounderThemeId;
  profileId: string;
}

export function FounderLinkCard({ link, theme, profileId }: FounderLinkCardProps) {
  const tokens = getFounderTheme(theme);

  return (
    <TrackedAnchor
      href={link.url}
      event={{ profileId, eventType: "link_click", targetId: link.id }}
      className={cn(
        "group relative flex w-full items-center justify-between gap-4 overflow-hidden p-4 transition-all duration-300 hover:scale-[1.01]",
        tokens.cardClass,
        "hover:border-white/20",
      )}
    >
      <div className="min-w-0 flex-1 text-left">
        <p className={cn("truncate text-sm font-semibold sm:text-base", tokens.accentTextClass)}>
          {link.title}
        </p>
        {link.description ? (
          <p className={cn("mt-0.5 truncate text-xs sm:text-sm", tokens.mutedTextClass)}>
            {link.description}
          </p>
        ) : null}
      </div>
      <ArrowUpRight
        className={cn(
          "h-4 w-4 shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5",
          tokens.mutedTextClass,
        )}
      />
    </TrackedAnchor>
  );
}

interface FounderLinkListProps {
  links: FounderLink[];
  theme: FounderThemeId;
  profileId: string;
}

export function FounderLinkList({ links, theme, profileId }: FounderLinkListProps) {
  const active = links
    .filter((l) => l.isActive)
    .sort((a, b) => a.position - b.position);
  if (!active.length) return null;
  return (
    <div className="mt-10 flex w-full flex-col gap-3">
      {active.map((link) => (
        <FounderLinkCard
          key={link.id}
          link={link}
          theme={theme}
          profileId={profileId}
        />
      ))}
    </div>
  );
}

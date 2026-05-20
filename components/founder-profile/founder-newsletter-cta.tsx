import { Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FounderProfile } from "@/lib/founder-profile/types";
import { getFounderTheme } from "@/lib/founder-profile/themes";
import { TrackedAnchor } from "./tracked-anchor";

interface FounderNewsletterCtaProps {
  profile: FounderProfile;
}

export function FounderNewsletterCta({ profile }: FounderNewsletterCtaProps) {
  const cta = profile.newsletterCta;
  if (!cta) return null;
  const tokens = getFounderTheme(profile.theme);

  return (
    <section
      className={cn(
        "relative mt-12 flex w-full flex-col items-center gap-4 overflow-hidden p-6 text-center sm:p-8",
        tokens.cardClass,
      )}
    >
      <div
        className={cn(
          "inline-flex h-12 w-12 items-center justify-center rounded-full",
          tokens.cardClass,
        )}
      >
        <Mail className={cn("h-5 w-5", tokens.accentTextClass)} />
      </div>
      <h3 className={cn("text-xl font-semibold sm:text-2xl", tokens.accentTextClass)}>
        {cta.headline}
      </h3>
      <p className={cn("max-w-md text-sm sm:text-base", tokens.mutedTextClass)}>
        {cta.description}
      </p>
      <TrackedAnchor
        href={cta.ctaUrl ?? "#"}
        event={{ profileId: profile.id, eventType: "newsletter_click" }}
        className={cn(
          "mt-2 inline-flex h-11 items-center justify-center rounded-lg px-6 text-sm font-semibold transition-all duration-200 hover:scale-[1.02]",
          tokens.primaryButtonClass,
        )}
      >
        {cta.ctaLabel}
      </TrackedAnchor>
    </section>
  );
}

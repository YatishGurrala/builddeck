import { cn } from "@/lib/utils";
import type { FounderThemeId } from "@/lib/founder-profile/types";
import { getFounderTheme } from "@/lib/founder-profile/themes";

interface FounderThemeWrapperProps {
  theme: FounderThemeId;
  className?: string;
  children: React.ReactNode;
}

/**
 * Outer wrapper for the public founder profile. Renders the theme background,
 * optional ambient gradient layer, and a centered mobile-first content column.
 */
export function FounderThemeWrapper({
  theme,
  className,
  children,
}: FounderThemeWrapperProps) {
  const tokens = getFounderTheme(theme);

  return (
    <div
      data-founder-theme={tokens.id}
      className={cn("min-h-screen w-full overflow-x-hidden", tokens.wrapperClass, className)}
    >
      {tokens.ambientClass ? <div aria-hidden className={tokens.ambientClass} /> : null}
      <div className="relative mx-auto flex w-full max-w-2xl flex-col items-center px-4 pb-24 pt-10 sm:px-6 md:max-w-3xl md:pt-16">
        {children}
      </div>
    </div>
  );
}

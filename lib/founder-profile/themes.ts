import type { FounderThemeId } from "./types";

export interface FounderThemeTokens {
  id: FounderThemeId;
  label: string;
  description: string;
  /** Outer page wrapper — controls background + text. */
  wrapperClass: string;
  /** Optional ambient background layer (rendered absolutely behind content). */
  ambientClass?: string;
  /** Card surface (links, product cards, CTA). */
  cardClass: string;
  /** Subtle muted text used for descriptions / metadata. */
  mutedTextClass: string;
  /** Accent text used for headlines / highlights. */
  accentTextClass: string;
  /** Primary CTA button class (overrides Button variant when present). */
  primaryButtonClass: string;
  /** Border tone used for avatar / dividers. */
  borderClass: string;
}

const founderGradient: FounderThemeTokens = {
  id: "founder-gradient",
  label: "Founder Gradient",
  description: "Dark midnight slate with violet/cyan ambient gradients.",
  wrapperClass: "relative bg-[#0b1326] text-white",
  ambientClass:
    "pointer-events-none absolute inset-0 -z-10 overflow-hidden " +
    "before:absolute before:-top-24 before:-left-24 before:h-[600px] before:w-[600px] before:rounded-full before:bg-[#8B5CF6] before:opacity-[0.15] before:blur-[120px] " +
    "after:absolute after:-bottom-24 after:-right-24 after:h-[600px] after:w-[600px] after:rounded-full after:bg-[#22D3EE] after:opacity-[0.15] after:blur-[120px]",
  cardClass:
    "rounded-2xl border border-white/[0.08] bg-[#1E293B] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]",
  mutedTextClass: "text-[#CBD5E1]",
  accentTextClass: "text-[#d0bcff]",
  primaryButtonClass:
    "bg-gradient-to-b from-[#A78BFA] to-[#8B5CF6] text-white hover:from-[#C4B5FD] hover:to-[#A78BFA] shadow-[0_8px_24px_rgba(139,92,246,0.35)]",
  borderClass: "border-white/[0.08]",
};

const minimalDark: FounderThemeTokens = {
  id: "minimal-dark",
  label: "Minimal Dark",
  description: "Pure dark slate, no ambient gradients, maximum focus.",
  wrapperClass: "relative bg-[#0a0d12] text-white",
  cardClass:
    "rounded-2xl border border-white/[0.06] bg-[#14181f] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]",
  mutedTextClass: "text-[#b4bbcb]",
  accentTextClass: "text-white",
  primaryButtonClass:
    "bg-white text-[#0a0d12] hover:bg-white/90",
  borderClass: "border-white/[0.06]",
};

const minimalLight: FounderThemeTokens = {
  id: "minimal-light",
  label: "Minimal Light",
  description: "Clean light surface for editorial founder pages.",
  wrapperClass: "relative bg-[#f7f8fa] text-[#0b1326]",
  cardClass:
    "rounded-2xl border border-black/[0.06] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
  mutedTextClass: "text-[#475569]",
  accentTextClass: "text-[#0b1326]",
  primaryButtonClass:
    "bg-[#0b1326] text-white hover:bg-[#1a2436]",
  borderClass: "border-black/[0.08]",
};

export const FOUNDER_THEMES: Record<FounderThemeId, FounderThemeTokens> = {
  "founder-gradient": founderGradient,
  "minimal-dark": minimalDark,
  "minimal-light": minimalLight,
};

export function getFounderTheme(id: FounderThemeId | undefined): FounderThemeTokens {
  if (!id) return FOUNDER_THEMES["founder-gradient"];
  return FOUNDER_THEMES[id] ?? FOUNDER_THEMES["founder-gradient"];
}

export const FOUNDER_THEME_LIST: FounderThemeTokens[] = [
  founderGradient,
  minimalDark,
  minimalLight,
];

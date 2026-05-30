/**
 * Founder profile analytics helper.
 *
 * Lightweight, fire-and-forget tracking for the founder profile module.
 * Today this only logs in development and forwards to Vercel Analytics
 * (`window.va`) in production if available — same pattern as `lib/analytics.ts`.
 *
 * When persistence is added, route this through a server action that writes
 * `FounderAnalyticsEvent` rows.
 */

import type { FounderAnalyticsEventType } from "./types";

export interface TrackFounderEventInput {
  profileId: string;
  eventType: FounderAnalyticsEventType;
  targetId?: string;
  referrer?: string;
}

export function trackFounderEvent(input: TrackFounderEventInput): void {
  const payload = {
    profileId: input.profileId,
    eventType: input.eventType,
    targetId: input.targetId,
    referrer: input.referrer,
  };

  if (typeof window === "undefined") {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.log("[FounderAnalytics:server]", payload);
    }
    return;
  }

  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.log("[FounderAnalytics]", payload);
  }

  try {
    const va = (window as unknown as { va?: (event: string, data: Record<string, unknown>) => void }).va;
    if (typeof va === "function") {
      va("event", { name: `founder_${input.eventType}`, ...payload });
    }
  } catch {
    // Silently ignore — analytics must never break the page.
  }
}

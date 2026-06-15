import { NextResponse } from "next/server";
import { recordFounderEvent } from "@/lib/founder-profile/store";
import type { FounderAnalyticsEventType } from "@/lib/founder-profile/types";

interface FounderAnalyticsPayload {
  profileId?: string;
  eventType?: FounderAnalyticsEventType;
  targetId?: string;
  referrer?: string;
}

const ALLOWED_EVENT_TYPES = new Set<FounderAnalyticsEventType>([
  "profile_view",
  "link_click",
  "product_click",
  "newsletter_click",
  "social_click",
]);

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as FounderAnalyticsPayload;

    if (!payload.profileId || !payload.eventType || !ALLOWED_EVENT_TYPES.has(payload.eventType)) {
      return NextResponse.json({ ok: false, error: "Invalid analytics payload" }, { status: 400 });
    }

    await recordFounderEvent({
      profileId: payload.profileId,
      eventType: payload.eventType,
      targetId: payload.targetId,
      referrer: payload.referrer,
    });

    return NextResponse.json({ ok: true });
  } catch {
    // Analytics must never break product flow.
    return NextResponse.json({ ok: true });
  }
}

"use client";

import * as React from "react";
import { trackFounderEvent } from "@/lib/founder-profile/analytics";

/**
 * Fires a single `profile_view` analytics event on mount.
 * Rendered inside the public founder profile page.
 */
export function FounderProfileViewTracker({ profileId }: { profileId: string }) {
  React.useEffect(() => {
    trackFounderEvent({ profileId, eventType: "profile_view" });
  }, [profileId]);
  return null;
}

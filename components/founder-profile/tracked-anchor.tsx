"use client";

import * as React from "react";
import {
  trackFounderEvent,
  type TrackFounderEventInput,
} from "@/lib/founder-profile/analytics";

interface TrackedAnchorProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  event: TrackFounderEventInput;
}

/**
 * Anchor that fires a founder analytics event on click.
 * Used for link cards, product cards, social icons, and the newsletter CTA.
 *
 * Kept as a tiny client component so the surrounding profile page can stay
 * a server component.
 */
export function TrackedAnchor({
  event,
  onClick,
  rel,
  target,
  ...rest
}: TrackedAnchorProps) {
  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      try {
        trackFounderEvent(event);
      } catch {
        // never block navigation
      }
      onClick?.(e);
    },
    [event, onClick],
  );

  const isExternal = (rest.href ?? "").startsWith("http");

  return (
    <a
      {...rest}
      target={target ?? (isExternal ? "_blank" : undefined)}
      rel={rel ?? (isExternal ? "noopener noreferrer" : undefined)}
      onClick={handleClick}
    />
  );
}

const FALLBACK_BASE_URL = "http://localhost:3002";

export function getFounderPublicProfileUrl(username: string) {
  const baseUrl = process.env.NEXT_PUBLIC_FOUNDER_BASE_URL || FALLBACK_BASE_URL;
  return `${baseUrl.replace(/\/$/, "")}/${username}`;
}

export function getFounderPublicProfileUrl(username: string) {
  const absoluteUrlsEnabled = process.env.NEXT_PUBLIC_FOUNDER_ABSOLUTE_URLS === "true";
  const configuredBaseUrl = process.env.NEXT_PUBLIC_FOUNDER_BASE_URL?.trim();

  if (absoluteUrlsEnabled && configuredBaseUrl) {
    return `${configuredBaseUrl.replace(/\/$/, "")}/${username}`;
  }

  return `/${username}`;
}

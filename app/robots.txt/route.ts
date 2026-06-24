function getBaseUrl() {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim();
  return (configured && configured.length > 0 ? configured : "https://builddeck.io").replace(/\/$/, "");
}

export async function GET() {
  const baseUrl = getBaseUrl();
  const body = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /admin",
    "Disallow: /api",
    "Disallow: /dashboard",
    "Disallow: /login",
    "Disallow: /signup",
    "Disallow: /submit",
    `Sitemap: ${baseUrl}/sitemap.xml`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
import { readFile } from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/db/prisma";
import { mockFounderProfiles } from "@/lib/founder-profile/mock-data";

type FounderWorkspaceStore = {
  workspaces?: Record<
    string,
    {
      profile?: {
        username?: string;
        isPublished?: boolean;
        updatedAt?: string | Date;
      };
    }
  >;
};

const BLOG_SLUGS = [
  "how-to-launch-a-saas-in-30-days",
  "mastering-the-viral-loop",
  "introducing-digital-curator-engine",
  "why-boring-ui-is-your-greatest-asset",
  "building-in-public-lessons-learned",
  "pricing-strategy-for-early-stage",
];

const STATIC_ROUTES = [
  "",
  "/about",
  "/blog",
  "/categories",
  "/contact",
  "/login",
  "/privacy",
  "/products",
  "/signup",
  "/submit",
];

function getBaseUrl() {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim();
  return (configured && configured.length > 0 ? configured : "https://builddeck.io").replace(/\/$/, "");
}

function toAbsoluteUrl(baseUrl: string, route: string) {
  return route ? `${baseUrl}${route}` : baseUrl;
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toIsoDate(input: Date | string | undefined) {
  if (!input) return new Date().toISOString();
  return new Date(input).toISOString();
}

async function getProductUrls(baseUrl: string) {
  try {
    const approvedProducts = await prisma.product.findMany({
      where: { status: "APPROVED" },
      select: { slug: true, updatedAt: true },
    });

    return approvedProducts.map((product) => ({
      loc: toAbsoluteUrl(baseUrl, `/products/${product.slug}`),
      lastmod: toIsoDate(product.updatedAt),
      changefreq: "weekly",
      priority: "0.7",
    }));
  } catch {
    return [];
  }
}

async function getFounderUrls(baseUrl: string) {
  const entries = new Map<string, Date>();

  for (const profile of mockFounderProfiles) {
    if (!profile.isPublished) continue;
    entries.set(profile.username.toLowerCase(), profile.updatedAt ?? new Date());
  }

  try {
    const storePath = path.join(process.cwd(), ".data", "founder-workspaces.json");
    const rawStore = await readFile(storePath, "utf8");
    const parsedStore = JSON.parse(rawStore) as FounderWorkspaceStore;

    for (const workspace of Object.values(parsedStore.workspaces || {})) {
      const profile = workspace.profile;
      if (!profile?.username || profile.isPublished === false) continue;
      entries.set(profile.username.toLowerCase(), profile.updatedAt ? new Date(profile.updatedAt) : new Date());
    }
  } catch {
    // File may not exist in all environments.
  }

  return Array.from(entries.entries()).map(([username, updatedAt]) => ({
    loc: toAbsoluteUrl(baseUrl, `/${username}`),
    lastmod: toIsoDate(updatedAt),
    changefreq: "weekly",
    priority: "0.7",
  }));
}

export async function GET() {
  const baseUrl = getBaseUrl();
  const now = new Date().toISOString();

  const staticUrls = STATIC_ROUTES.map((route) => ({
    loc: toAbsoluteUrl(baseUrl, route),
    lastmod: now,
    changefreq: route === "" ? "daily" : "weekly",
    priority: route === "" ? "1.0" : "0.8",
  }));

  const blogUrls = BLOG_SLUGS.map((slug) => ({
    loc: toAbsoluteUrl(baseUrl, `/blog/${slug}`),
    lastmod: now,
    changefreq: "monthly",
    priority: "0.6",
  }));

  const [productUrls, founderUrls] = await Promise.all([
    getProductUrls(baseUrl),
    getFounderUrls(baseUrl),
  ]);

  const allUrls = [...staticUrls, ...blogUrls, ...productUrls, ...founderUrls];

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${allUrls
    .map(
      (url) =>
        `  <url>\n    <loc>${escapeXml(url.loc)}</loc>\n    <lastmod>${url.lastmod}</lastmod>\n    <changefreq>${url.changefreq}</changefreq>\n    <priority>${url.priority}</priority>\n  </url>`,
    )
    .join("\n")}\n</urlset>\n`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

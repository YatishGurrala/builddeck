import { ExternalLink, PlayCircle, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CreatorPageBlock } from "@/lib/founder-profile/editor-data";
import type { FounderProfile } from "@/lib/founder-profile/types";
import { getFounderTheme } from "@/lib/founder-profile/themes";
import { FounderHero } from "./founder-hero";
import { FounderLinkList } from "./founder-link-card";
import { FounderNewsletterCta } from "./founder-newsletter-cta";
import { FounderProductGrid } from "./founder-product-card";
import { FounderSocialLinks } from "./founder-social-links";
import { TrackedAnchor } from "./tracked-anchor";

interface FounderProfileSectionsProps {
  profile: FounderProfile;
  blocks?: CreatorPageBlock[];
  interactive?: boolean;
}

function getFeaturedContent(profile: FounderProfile) {
  if (profile.featuredContent?.title || profile.featuredContent?.description || profile.featuredContent?.url) {
    return {
      title: profile.featuredContent.title,
      description: profile.featuredContent.description,
      url: profile.featuredContent.url,
      eventType: "link_click" as const,
      targetId: profile.featuredContent.url || "featured-content",
    };
  }

  const firstActiveLink = [...profile.links]
    .filter((link) => link.isActive)
    .sort((a, b) => a.position - b.position)[0];

  if (firstActiveLink) {
    return {
      title: firstActiveLink.title,
      description: firstActiveLink.description || "Point people to the page, post, or offer you want them to open first.",
      url: firstActiveLink.url,
      eventType: "link_click" as const,
      targetId: firstActiveLink.id,
    };
  }

  const firstProduct = [...profile.products]
    .filter((product) => product.isFeatured)
    .sort((a, b) => a.position - b.position)[0];

  if (firstProduct) {
    return {
      title: firstProduct.name,
      description: firstProduct.description,
      url: firstProduct.url,
      eventType: "product_click" as const,
      targetId: firstProduct.id,
    };
  }

  return {
    title: "Featured Content",
    description: "Use this slot to spotlight your latest release, announcement, or flagship resource.",
    url: "",
    eventType: "link_click" as const,
    targetId: "featured-content",
  };
}

function toEmbedUrl(rawUrl?: string) {
  if (!rawUrl) return null;

  try {
    const url = new URL(rawUrl);
    const host = url.hostname.toLowerCase();

    if (host.includes("youtu.be")) {
      const videoId = url.pathname.replace(/^\//, "");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }

    if (host.includes("youtube.com")) {
      if (url.pathname.startsWith("/embed/")) {
        return rawUrl;
      }
      const videoId = url.searchParams.get("v");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }

    if (host.includes("vimeo.com")) {
      const videoId = url.pathname.split("/").filter(Boolean)[0];
      return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
    }
  } catch {
    return null;
  }

  return null;
}

function CurrentProjectSection({ profile }: { profile: FounderProfile }) {
  const tokens = getFounderTheme(profile.theme);
  if (!profile.currentlyBuilding) return null;

  return (
    <section
      className={cn(
        "mt-10 flex w-full flex-col gap-3 rounded-3xl border px-5 py-6 sm:px-6",
        tokens.cardClass,
        tokens.borderClass,
      )}
    >
      <p className={cn("text-[11px] font-semibold uppercase tracking-[0.24em]", tokens.mutedTextClass)}>
        Current Project
      </p>
      <p className={cn("text-lg font-semibold sm:text-xl", tokens.accentTextClass)}>
        {profile.currentlyBuilding}
      </p>
    </section>
  );
}

function FeaturedContentSection({ profile, interactive }: { profile: FounderProfile; interactive: boolean }) {
  const tokens = getFounderTheme(profile.theme);
  const content = getFeaturedContent(profile);
  const ctaClassName = cn(
    "mt-5 inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold transition-colors hover:bg-white/5",
    tokens.borderClass,
    tokens.accentTextClass,
  );

  return (
    <section
      className={cn(
        "mt-12 w-full rounded-3xl border p-6 sm:p-7",
        tokens.cardClass,
        tokens.borderClass,
      )}
    >
      <p className={cn("text-[11px] font-semibold uppercase tracking-[0.24em]", tokens.mutedTextClass)}>
        Featured Content
      </p>
      <div className="mt-3 flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h2 className={cn("text-2xl font-semibold sm:text-3xl", tokens.accentTextClass)}>
            {content.title}
          </h2>
          <p className={cn("mt-3 max-w-2xl text-sm leading-relaxed sm:text-base", tokens.mutedTextClass)}>
            {content.description}
          </p>
        </div>
        {content.url ? <ExternalLink className={cn("mt-1 h-5 w-5 shrink-0", tokens.mutedTextClass)} /> : null}
      </div>
      {content.url ? (
        interactive ? (
          <TrackedAnchor
            href={content.url}
            event={{ profileId: profile.id, eventType: content.eventType, targetId: content.targetId }}
            className={ctaClassName}
          >
            Open featured item
          </TrackedAnchor>
        ) : (
          <a href={content.url} className={ctaClassName}>
            Open featured item
          </a>
        )
      ) : null}
    </section>
  );
}

function VideoEmbedSection({ profile }: { profile: FounderProfile }) {
  const tokens = getFounderTheme(profile.theme);
  const embedUrl = toEmbedUrl(profile.videoEmbed?.url);

  return (
    <section className="mt-12 w-full">
      <div className="mb-4 flex items-center gap-2">
        <PlayCircle className={cn("h-5 w-5", tokens.accentTextClass)} />
        <h2 className={cn("text-2xl font-semibold sm:text-3xl", tokens.accentTextClass)}>
          {profile.videoEmbed?.title || "Featured Video"}
        </h2>
      </div>
      {embedUrl ? (
        <div className={cn("overflow-hidden rounded-3xl border", tokens.borderClass)}>
          <div className="aspect-video w-full">
            <iframe
              src={embedUrl}
              title={profile.videoEmbed?.title || `${profile.displayName} featured video`}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "rounded-3xl border p-6 text-sm leading-relaxed sm:text-base",
            tokens.cardClass,
            tokens.borderClass,
            tokens.mutedTextClass,
          )}
        >
          Add a YouTube or Vimeo URL in your profile settings to show an embedded video here.
        </div>
      )}
    </section>
  );
}

function TestimonialSection({ profile }: { profile: FounderProfile }) {
  const tokens = getFounderTheme(profile.theme);
  const testimonial = profile.testimonial || {
    quote: `${profile.displayName} ships consistently and explains the work clearly.`,
    author: "Builddeck visitor",
    role: "Founder",
  };

  return (
    <section
      className={cn(
        "mt-12 w-full rounded-3xl border p-6 sm:p-7",
        tokens.cardClass,
        tokens.borderClass,
      )}
    >
      <div className="flex items-start gap-4">
        <Quote className={cn("mt-1 h-5 w-5 shrink-0", tokens.accentTextClass)} />
        <div>
          <p className={cn("text-lg leading-relaxed sm:text-xl", tokens.accentTextClass)}>
            “{testimonial.quote}”
          </p>
          <p className={cn("mt-4 text-sm font-semibold", tokens.accentTextClass)}>
            {testimonial.author}
          </p>
          {testimonial.role ? (
            <p className={cn("text-xs uppercase tracking-[0.2em]", tokens.mutedTextClass)}>
              {testimonial.role}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export function FounderProfileSections({
  profile,
  blocks,
  interactive = true,
}: FounderProfileSectionsProps) {
  const activeBlocks = (blocks || []).filter((block) => block.isActive);
  const renderDefaultLayout = activeBlocks.length === 0;
  const hasExplicitSocialLinksBlock = activeBlocks.some((block) => block.type === "social-links");

  function renderBlock(type: CreatorPageBlock["type"]) {
    if (type === "hero") {
      return (
        <FounderHero
          profile={profile}
          interactive={interactive}
          showSocials={!hasExplicitSocialLinksBlock}
        />
      );
    }

    if (type === "current-project") {
      return <CurrentProjectSection profile={profile} />;
    }

    if (type === "social-links") {
      return (
        <FounderSocialLinks
          socials={profile.socials}
          theme={profile.theme}
          profileId={profile.id}
          interactive={interactive}
        />
      );
    }

    if (type === "resources") {
      return (
        <FounderLinkList
          links={profile.links}
          theme={profile.theme}
          profileId={profile.id}
          interactive={interactive}
        />
      );
    }

    if (type === "digital-product") {
      return (
        <FounderProductGrid
          products={profile.products}
          theme={profile.theme}
          profileId={profile.id}
          interactive={interactive}
        />
      );
    }

    if (type === "newsletter") {
      return <FounderNewsletterCta profile={profile} interactive={interactive} />;
    }

    if (type === "featured-content") {
      return <FeaturedContentSection profile={profile} interactive={interactive} />;
    }

    if (type === "video-embed") {
      return <VideoEmbedSection profile={profile} />;
    }

    if (type === "testimonial") {
      return <TestimonialSection profile={profile} />;
    }

    return null;
  }

  if (renderDefaultLayout) {
    return (
      <>
        <FounderHero profile={profile} interactive={interactive} />
        <CurrentProjectSection profile={profile} />
        <FounderLinkList
          links={profile.links}
          theme={profile.theme}
          profileId={profile.id}
          interactive={interactive}
        />
        <FounderProductGrid
          products={profile.products}
          theme={profile.theme}
          profileId={profile.id}
          interactive={interactive}
        />
        <FounderNewsletterCta profile={profile} interactive={interactive} />
      </>
    );
  }

  return (
    <>
      {activeBlocks.map((block) => (
        <section key={block.id}>{renderBlock(block.type)}</section>
      ))}
    </>
  );
}

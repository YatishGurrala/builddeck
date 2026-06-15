import Image from "next/image";
import { cn } from "@/lib/utils";
import type {
  FounderProduct,
  FounderProductStatus,
  FounderThemeId,
} from "@/lib/founder-profile/types";
import { getFounderTheme } from "@/lib/founder-profile/themes";
import { TrackedAnchor } from "./tracked-anchor";

const STATUS_LABELS: Record<FounderProductStatus, string> = {
  building: "Building",
  launched: "Launched",
  paused: "Paused",
};

const STATUS_STYLES: Record<FounderProductStatus, string> = {
  building: "bg-orange-500/12 text-orange-700 dark:text-orange-300 border-orange-500/30",
  launched: "bg-green-500/12 text-green-700 dark:text-green-300 border-green-500/30",
  paused: "bg-red-500/12 text-red-700 dark:text-red-300 border-red-500/30",
};

interface FounderProductCardProps {
  product: FounderProduct;
  theme: FounderThemeId;
  profileId: string;
}

export function FounderProductCard({
  product,
  theme,
  profileId,
}: FounderProductCardProps) {
  const tokens = getFounderTheme(theme);
  const inner = (
    <div
      className={cn(
        "group flex h-full min-h-[20rem] flex-col overflow-hidden rounded-3xl border p-5 transition-colors duration-300 hover:border-white/20",
        tokens.cardClass,
      )}
    >
      <div
        className={cn(
          "relative mb-4 aspect-square w-full overflow-hidden rounded-2xl border",
          tokens.borderClass,
          tokens.cardClass,
        )}
      >
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover opacity-90 transition-opacity duration-300 group-hover:opacity-100"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-2xl font-bold opacity-60">
            {product.name.slice(0, 1).toUpperCase()}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className={cn("text-base font-semibold leading-tight", tokens.accentTextClass)}>
            {product.name}
          </h3>
          <span
            className={cn(
              "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]",
              STATUS_STYLES[product.status],
            )}
          >
            {STATUS_LABELS[product.status]}
          </span>
        </div>
        <p className={cn("flex-1 text-sm leading-relaxed", tokens.mutedTextClass)}>
          {product.description}
        </p>
      </div>
    </div>
  );

  if (!product.url) return inner;

  return (
    <TrackedAnchor
      href={product.url}
      event={{ profileId, eventType: "product_click", targetId: product.id }}
      className="block h-full"
    >
      {inner}
    </TrackedAnchor>
  );
}

interface FounderProductGridProps {
  products: FounderProduct[];
  theme: FounderThemeId;
  profileId: string;
}

export function FounderProductGrid({
  products,
  theme,
  profileId,
}: FounderProductGridProps) {
  const featured = products
    .filter((p) => p.isFeatured)
    .sort((a, b) => a.position - b.position);
  if (!featured.length) return null;

  const tokens = getFounderTheme(theme);

  return (
    <section className="mt-12 w-full">
      <h2 className={cn("mb-4 text-2xl font-semibold sm:text-3xl", tokens.accentTextClass)}>
        Currently Building
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {featured.map((product) => (
          <FounderProductCard
            key={product.id}
            product={product}
            theme={theme}
            profileId={profileId}
          />
        ))}
      </div>
    </section>
  );
}

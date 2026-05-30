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
  building: "bg-[#8B5CF6]/15 text-[#d0bcff] border-[#8B5CF6]/30",
  launched: "bg-[#22D3EE]/15 text-[#5de6ff] border-[#22D3EE]/30",
  paused: "bg-white/10 text-white/70 border-white/20",
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
        "group flex h-full flex-col overflow-hidden p-4 transition-colors duration-300 hover:border-white/20",
        tokens.cardClass,
      )}
    >
      <div
        className={cn(
          "relative mb-4 aspect-video w-full overflow-hidden rounded-xl",
          tokens.cardClass,
          "border-0",
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

      <div className="flex flex-1 flex-col">
        <div className="mb-2 flex items-center gap-2">
          <h3 className={cn("text-base font-semibold", tokens.accentTextClass)}>
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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

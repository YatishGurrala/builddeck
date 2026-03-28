import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.slug}`}>
      <Card className="group h-full hover:border-zinc-700 transition-all hover:shadow-lg hover:shadow-violet-500/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-zinc-800">
              {product.logoUrl ? (
                <Image
                  src={product.logoUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-zinc-600">
                  {product.name[0]}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white group-hover:text-violet-400 transition-colors truncate">
                  {product.name}
                </h3>
                {product.featured && (
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                )}
              </div>
              <p className="mt-1 text-sm text-zinc-400 line-clamp-2">
                {product.tagline}
              </p>
              <div className="mt-3 flex items-center gap-2">
                {product.category && (
                  <Badge variant="secondary" className="text-xs">
                    {product.category.name}
                  </Badge>
                )}
                <ExternalLink className="h-3 w-3 text-zinc-500 ml-auto" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

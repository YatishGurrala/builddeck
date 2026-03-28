import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Star, ArrowLeft } from "lucide-react";
import { getProductBySlug } from "@/lib/db/queries/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product || product.status !== "APPROVED") {
    notFound();
  }

  // Parse screenshots from JSON string
  const screenshots = product.screenshots ? JSON.parse(product.screenshots) : [];

  return (
    <div className="container mx-auto px-4 py-12">
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <div className="flex items-start gap-6">
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-zinc-800">
              {product.logoUrl ? (
                <Image
                  src={product.logoUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-zinc-600">
                  {product.name[0]}
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white">{product.name}</h1>
                {product.featured && (
                  <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                )}
              </div>
              <p className="text-lg text-zinc-400 mb-4">{product.tagline}</p>
              <div className="flex items-center gap-3">
                {product.category && (
                  <Link href={`/products?category=${product.category.slug}`}>
                    <Badge variant="secondary">{product.category.name}</Badge>
                  </Link>
                )}
                <span className="text-sm text-zinc-500">
                  Added {formatDate(product.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">About</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-zinc-300 whitespace-pre-wrap">
                {product.description}
              </p>
            </div>
          </div>

          {/* Screenshots */}
          {screenshots && screenshots.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Screenshots</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {screenshots.map((screenshot: string, index: number) => (
                  <div
                    key={index}
                    className="relative aspect-video overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900"
                  >
                    <Image
                      src={screenshot}
                      alt={`${product.name} screenshot ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <a
              href={product.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" className="w-full gap-2">
                Visit Website
                <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
          </div>

          {product.user && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
              <h3 className="text-sm font-medium text-zinc-400 mb-4">
                Submitted by
              </h3>
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-full bg-zinc-800">
                  {product.user.avatarUrl ? (
                    <Image
                      src={product.user.avatarUrl}
                      alt={product.user.name || "User"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm font-medium text-zinc-500">
                      {(product.user.name || product.user.email)[0].toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium text-white">
                    {product.user.name || "Anonymous"}
                  </p>
                  {product.user.username && (
                    <p className="text-sm text-zinc-500">
                      @{product.user.username}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, ArrowLeft, CheckCircle, Share2, Bookmark } from "lucide-react";
import { getProductBySlug, toProduct } from "@/lib/buildstack/queries/products";
import { getCategoryById } from "@/lib/buildstack/queries/categories";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const productRecord = await getProductBySlug(slug);

  if (!productRecord || productRecord.data.status !== "APPROVED") {
    notFound();
  }

  const categoryRecord = productRecord.data.categoryId
    ? await getCategoryById(productRecord.data.categoryId)
    : null;

  const product = toProduct(productRecord, {
    category: categoryRecord
      ? {
          id: categoryRecord.id,
          name: categoryRecord.data.name,
          slug: categoryRecord.data.slug,
          description: categoryRecord.data.description,
          icon: categoryRecord.data.icon,
          color: categoryRecord.data.color,
          displayOrder: categoryRecord.data.displayOrder,
          isActive: categoryRecord.data.isActive,
          createdAt: new Date(categoryRecord.createdAt),
          updatedAt: new Date(categoryRecord.updatedAt),
        }
      : null,
  });

  // Parse screenshots from JSON string
  const screenshots = product.screenshots ? JSON.parse(product.screenshots) : [];

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Back Navigation */}
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-[#8b90a0] hover:text-white mb-8 transition-colors font-medium"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to products
      </Link>

      {/* Product Hero */}
      <header className="flex flex-col md:flex-row items-center md:items-end justify-between gap-8 mb-16">
        <div className="flex flex-col md:flex-row items-center md:items-center gap-8 text-center md:text-left">
          <div className="w-32 h-32 md:w-40 md:h-40 bg-[#1c2025] rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center p-6 group">
            {product.logoUrl ? (
              <Image
                src={product.logoUrl}
                alt={product.name}
                width={100}
                height={100}
                className="object-contain group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <span className="text-5xl font-bold text-[#0070f3]">
                {product.name[0]}
              </span>
            )}
          </div>
          <div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
              {product.category && (
                <Link href={`/products?category=${product.category.slug}`}>
                  <span className="bg-[#6807ba]/20 text-[#dbb8ff] px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase">
                    {product.category.name}
                  </span>
                </Link>
              )}
              {product.featured && (
                <span className="flex items-center gap-1 text-[#3ce36a] text-xs font-bold">
                  <CheckCircle className="h-4 w-4" />
                  FEATURED
                </span>
              )}
            </div>
            <h1 className="text-5xl md:text-7xl font-headline font-extrabold tracking-tighter text-white mb-2 leading-none">
              {product.name}
            </h1>
            <p className="text-xl text-[#8b90a0] max-w-xl leading-relaxed">
              {product.tagline}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col gap-4 w-full md:w-auto">
          <a
            href={product.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="w-full bg-[#0070f3] text-white px-10 py-4 h-auto rounded-full font-headline font-extrabold text-lg flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(0,112,243,0.4)] transition-all active:scale-95">
              Visit Website
              <ExternalLink className="h-5 w-5" />
            </Button>
          </a>
          <div className="flex items-center justify-center md:justify-end gap-6 text-[#8b90a0]">
            <span className="text-sm">
              Added {formatDate(product.createdAt)}
            </span>
          </div>
        </div>
      </header>

      {/* Media Gallery (Asymmetric Bento Grid) */}
      {screenshots && screenshots.length > 0 && (
        <section className="mb-24">
          <div className={`grid gap-6 ${
            screenshots.length === 1 
              ? 'grid-cols-1' 
              : screenshots.length === 2 
                ? 'grid-cols-1 md:grid-cols-2' 
                : 'grid-cols-1 md:grid-cols-12'
          } h-auto md:h-[600px]`}>
            {screenshots.length >= 1 && (
              <div className={`${screenshots.length >= 3 ? 'md:col-span-8' : ''} bg-[#1c2025] rounded-3xl overflow-hidden group relative`}>
                <Image
                  src={screenshots[0]}
                  alt={`${product.name} screenshot 1`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e13]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                  <p className="text-white font-medium">Main Preview</p>
                </div>
              </div>
            )}
            {screenshots.length >= 2 && (
              <div className={`${screenshots.length >= 3 ? 'md:col-span-4' : ''} grid ${screenshots.length >= 3 ? 'grid-rows-2' : ''} gap-6`}>
                {screenshots.slice(1, 3).map((screenshot: string, index: number) => (
                  <div key={index} className="bg-[#1c2025] rounded-3xl overflow-hidden group relative">
                    <Image
                      src={screenshot}
                      alt={`${product.name} screenshot ${index + 2}`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e13]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <p className="text-white text-sm font-medium">Screenshot {index + 2}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Description */}
        <div className="lg:col-span-8 space-y-12">
          <div className="space-y-6">
            <h2 className="text-3xl font-headline font-bold text-white tracking-tight">About {product.name}</h2>
            <div className="prose prose-invert prose-lg max-w-none text-[#c1c6d7] leading-relaxed">
              <p className="whitespace-pre-wrap">{product.description}</p>
            </div>
            
            {/* Core Features Box */}
            <div className="bg-[#1c2025] p-8 rounded-3xl border border-white/5 mt-12">
              <h3 className="text-xl font-headline font-bold text-white mb-4">Highlights</h3>
              <ul className="grid md:grid-cols-2 gap-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-[#3ce36a] mt-0.5" />
                  <span className="text-[#c1c6d7]">High-quality curated product</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-[#3ce36a] mt-0.5" />
                  <span className="text-[#c1c6d7]">Active development & support</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-[#3ce36a] mt-0.5" />
                  <span className="text-[#c1c6d7]">Community verified</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-[#3ce36a] mt-0.5" />
                  <span className="text-[#c1c6d7]">Regular updates</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Product Info Card */}
          <div className="bg-[#1c2025] rounded-3xl p-6 border border-white/5 shadow-xl">
            <h3 className="text-xs text-[#8b90a0] uppercase tracking-widest font-bold mb-4">Product Info</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-white/5">
                <span className="text-[#8b90a0] text-sm">Category</span>
                <span className="text-white font-medium">{product.category?.name || "Uncategorized"}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/5">
                <span className="text-[#8b90a0] text-sm">Last Updated</span>
                <span className="text-white font-medium">{formatDate(product.updatedAt)}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-[#8b90a0] text-sm">Status</span>
                <span className="text-[#3ce36a] font-medium">Active</span>
              </div>
            </div>
          </div>
          
          {/* Maker Details */}
          {product.user && (
            <div className="bg-[#1c2025] rounded-3xl p-6 border border-white/5 shadow-xl">
              <h3 className="text-xs text-[#8b90a0] uppercase tracking-widest font-bold mb-4">Maker Details</h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#31353b] flex items-center justify-center overflow-hidden">
                  {product.user.avatarUrl ? (
                    <Image
                      src={product.user.avatarUrl}
                      alt={product.user.name || "User"}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-lg font-bold text-[#0070f3]">
                      {(product.user.name || product.user.email)[0].toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-bold text-white">{product.user.name || "Anonymous"}</p>
                  {product.user.username && (
                    <p className="text-sm text-[#8b90a0]">@{product.user.username}</p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex gap-3">
            <button className="flex-1 py-3 bg-[#31353b] hover:bg-[#36393f] text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
              <Share2 className="h-4 w-4" />
              Share
            </button>
            <button className="flex-1 py-3 bg-[#31353b] hover:bg-[#36393f] text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
              <Bookmark className="h-4 w-4" />
              Save
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

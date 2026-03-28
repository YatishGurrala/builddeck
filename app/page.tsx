import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Rocket,
  Zap,
  Shield,
  TrendingUp,
  Users,
  Star,
  ExternalLink,
  Sparkles,
  Code,
  Palette,
  BarChart3,
  Bot,
  Megaphone,
  Layers,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { getFeaturedProducts } from "@/lib/db/queries/products";

// Mock featured products data (fallback)
const mockFeaturedProducts = [
  {
    id: "1",
    name: "Raycast",
    slug: "raycast",
    tagline: "Supercharged productivity tool for Mac power users",
    logoUrl: null,
    featured: true,
    category: { name: "Productivity", slug: "productivity" },
  },
  {
    id: "2",
    name: "Linear",
    slug: "linear",
    tagline: "The issue tracking tool you'll enjoy using",
    logoUrl: null,
    featured: true,
    category: { name: "Developer Tools", slug: "developer-tools" },
  },
  {
    id: "3",
    name: "Framer",
    slug: "framer",
    tagline: "Design and publish stunning websites in minutes",
    logoUrl: null,
    featured: true,
    category: { name: "Design", slug: "design" },
  },
  {
    id: "4",
    name: "Notion AI",
    slug: "notion-ai",
    tagline: "AI-powered workspace for notes, docs, and projects",
    logoUrl: null,
    featured: true,
    category: { name: "AI & Machine Learning", slug: "ai-machine-learning" },
  },
  {
    id: "5",
    name: "Vercel",
    slug: "vercel",
    tagline: "Build and deploy web applications with zero configuration",
    logoUrl: null,
    featured: true,
    category: { name: "Developer Tools", slug: "developer-tools" },
  },
  {
    id: "6",
    name: "Figma",
    slug: "figma",
    tagline: "Collaborative interface design tool for teams",
    logoUrl: null,
    featured: true,
    category: { name: "Design", slug: "design" },
  },
];

// Categories with icons
const categories = [
  { name: "AI & Machine Learning", slug: "ai-machine-learning", icon: Bot, count: 124 },
  { name: "Developer Tools", slug: "developer-tools", icon: Code, count: 89 },
  { name: "Productivity", slug: "productivity", icon: Zap, count: 76 },
  { name: "Design", slug: "design", icon: Palette, count: 65 },
  { name: "Marketing", slug: "marketing", icon: Megaphone, count: 54 },
  { name: "Analytics", slug: "analytics", icon: BarChart3, count: 43 },
  { name: "No-Code", slug: "no-code", icon: Layers, count: 38 },
  { name: "Open Source", slug: "open-source", icon: Package, count: 31 },
];

export default async function HomePage() {
  // Fetch featured products from DB (falls back to mock data)
  const dbFeaturedProducts = await getFeaturedProducts(6);

  const featuredProducts =
    dbFeaturedProducts && dbFeaturedProducts.length > 0
      ? dbFeaturedProducts
      : mockFeaturedProducts;

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-violet-600/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

        <div className="container relative mx-auto px-4 py-24 md:py-36">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm px-4 py-2 text-sm text-zinc-400 mb-8">
              <Sparkles className="h-4 w-4 text-violet-500" />
              <span>The launchpad for makers</span>
            </div>

            {/* Main heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
              Discover products worth{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-violet-400">
                building, using, and sharing.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Builddeck is the go-to platform for indie hackers, SaaS founders, and builders to showcase products and connect with early adopters.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/submit">
                <Button size="lg" className="gap-2 h-12 px-8 text-base">
                  <Rocket className="h-5 w-5" />
                  Submit Product
                </Button>
              </Link>
              <Link href="/products">
                <Button size="lg" variant="outline" className="gap-2 h-12 px-8 text-base">
                  Explore Products
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 md:gap-12 mt-16 pt-8 border-t border-zinc-800/50">
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-white">500+</p>
                <p className="text-sm text-zinc-500 mt-1">Products</p>
              </div>
              <div className="h-8 w-px bg-zinc-800" />
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-white">10k+</p>
                <p className="text-sm text-zinc-500 mt-1">Makers</p>
              </div>
              <div className="h-8 w-px bg-zinc-800" />
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-white">50k+</p>
                <p className="text-sm text-zinc-500 mt-1">Monthly Visitors</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="border-t border-zinc-800/50 py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-medium text-yellow-500 uppercase tracking-wider">Featured</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Handpicked products
              </h2>
              <p className="text-zinc-400 mt-2 max-w-lg">
                Curated selection of the best tools and products from our community
              </p>
            </div>
            <Link href="/products?featured=true">
              <Button variant="ghost" className="gap-2">
                View all featured
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product: { id: string; slug: string; logoUrl?: string | null; name: string; tagline: string; category?: { name: string } | null }, index: number) => (
              <Link key={product.id} href={`/products/${product.slug}`}>
                <Card className="group h-full hover:border-zinc-700 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/5 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Logo placeholder with gradient */}
                      <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-violet-600/20 to-purple-600/20 border border-zinc-800">
                        {product.logoUrl ? (
                          <Image
                            src={product.logoUrl}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xl font-bold text-violet-400">
                            {product.name[0]}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-white group-hover:text-violet-400 transition-colors">
                            {product.name}
                          </h3>
                          <ExternalLink className="h-3.5 w-3.5 text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="mt-1.5 text-sm text-zinc-400 line-clamp-2">
                          {product.tagline}
                        </p>
                        {product.category && (
                          <Badge variant="secondary" className="mt-3 text-xs">
                            {product.category.name}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="border-t border-zinc-800/50 py-20 md:py-28 bg-zinc-900/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Browse by category
            </h2>
            <p className="text-zinc-400 max-w-lg mx-auto">
              Find the perfect tool for your needs across our growing collection of categories
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link key={category.slug} href={`/products?category=${category.slug}`}>
                  <Card className="group h-full hover:border-zinc-700 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/5 hover:-translate-y-0.5">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-violet-600/10 text-violet-400 group-hover:bg-violet-600/20 transition-colors">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-white text-sm group-hover:text-violet-400 transition-colors truncate">
                            {category.name}
                          </h3>
                          <p className="text-xs text-zinc-500 mt-0.5">
                            {category.count} products
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <Link href="/categories">
              <Button variant="outline" className="gap-2">
                View all categories
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Builddeck Section */}
      <section className="border-t border-zinc-800/50 py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Builddeck?
            </h2>
            <p className="text-zinc-400 max-w-lg mx-auto">
              The platform built by makers, for makers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 transition-all duration-300">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600/20 to-purple-600/20 text-violet-400 mb-4 group-hover:scale-110 transition-transform">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Launch Fast
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Get your product in front of thousands of potential users within hours, not weeks.
              </p>
            </div>

            <div className="group p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 transition-all duration-300">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600/20 to-purple-600/20 text-violet-400 mb-4 group-hover:scale-110 transition-transform">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Quality Curation
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Every product is reviewed by our team to ensure quality and relevance.
              </p>
            </div>

            <div className="group p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 transition-all duration-300">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600/20 to-purple-600/20 text-violet-400 mb-4 group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Engaged Community
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Connect with a community of makers, founders, and early adopters.
              </p>
            </div>

            <div className="group p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 transition-all duration-300">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600/20 to-purple-600/20 text-violet-400 mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Grow Audience
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Build your email list and grow your following with organic discovery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="border-t border-zinc-800/50 py-20 md:py-28 bg-gradient-to-b from-zinc-900/50 to-transparent">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="p-8 md:p-12 border-zinc-800 bg-zinc-900/80 backdrop-blur-sm">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-violet-600/20 text-violet-400 mb-6">
                  <Sparkles className="h-7 w-7" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  Stay in the loop
                </h2>
                <p className="text-zinc-400 mb-8 max-w-md mx-auto">
                  Get the best new products, launches, and maker stories delivered to your inbox every week.
                </p>
                <NewsletterForm />
                <p className="text-xs text-zinc-500 mt-4">
                  Join 5,000+ makers. Unsubscribe anytime.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-zinc-800/50 py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to launch your product?
            </h2>
            <p className="text-zinc-400 mb-8 text-lg">
              Join hundreds of makers who have already launched on Builddeck
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/submit">
                <Button size="lg" className="gap-2 h-12 px-8">
                  <Rocket className="h-5 w-5" />
                  Submit Your Product
                </Button>
              </Link>
              <Link href="/products">
                <Button size="lg" variant="outline" className="gap-2 h-12 px-8">
                  Browse Products
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

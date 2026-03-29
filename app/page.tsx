import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Rocket,
  Zap,
  Users,
  Bot,
  Code,
  Palette,
  BarChart3,
  Megaphone,
  Layers,
  Cloud,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { getFeaturedProducts } from "@/lib/db/queries/products";

// Mock featured products data (fallback)
const mockFeaturedProducts = [
  {
    id: "1",
    name: "PromptLayer",
    slug: "promptlayer",
    tagline: "The CMS for prompt engineering. Visual and collaborative prompt management.",
    logoUrl: null,
    featured: true,
    category: { name: "AI Tools", slug: "ai-tools" },
  },
  {
    id: "2",
    name: "Linear",
    slug: "linear",
    tagline: "The better way to build products. Streamline software projects, sprints, and tasks.",
    logoUrl: null,
    featured: true,
    category: { name: "SaaS", slug: "saas" },
  },
  {
    id: "3",
    name: "Supabase",
    slug: "supabase",
    tagline: "The open source Firebase alternative. Build your backend in minutes.",
    logoUrl: null,
    featured: true,
    category: { name: "Dev Tools", slug: "dev-tools" },
  },
];

// Categories with icons
const categories = [
  { name: "AI Tools", slug: "ai-tools", icon: Bot },
  { name: "SaaS", slug: "saas", icon: Cloud },
  { name: "Productivity", slug: "productivity", icon: CheckCircle },
  { name: "Dev Tools", slug: "dev-tools", icon: Code },
  { name: "Creator Tools", slug: "creator-tools", icon: Palette },
];

export default async function HomePage() {
  // Fetch featured products from DB (falls back to mock data)
  const dbFeaturedProducts = await getFeaturedProducts(3);

  const featuredProducts =
    dbFeaturedProducts && dbFeaturedProducts.length > 0
      ? dbFeaturedProducts
      : mockFeaturedProducts;

  return (
    <div className="flex flex-col pt-20">
      {/* Hero Section */}
      <section className="relative min-h-[870px] flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Asymmetric Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#6807ba]/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#0070f3]/10 rounded-full blur-[100px]" />
        
        <div className="max-w-4xl w-full text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#31353b]/50 border border-[#414754]/20 mb-8">
            <span className="w-2 h-2 rounded-full bg-[#3ce36a]" />
            <span className="text-[0.7rem] uppercase tracking-widest font-bold text-[#c1c6d7]">
              Live: Winter Launch Event 2024
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-headline font-extrabold text-white tracking-tight leading-[1.1] mb-8">
            Discover products worth{" "}
            <span className="text-[#0070f3]">building</span>, using, and sharing.
          </h1>
          
          <p className="text-lg md:text-xl text-[#c1c6d7] max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
            A premium stage for makers to launch their next big idea and for the community to discover tomorrow&apos;s essential stack.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/submit">
              <Button className="w-full sm:w-auto px-8 py-4 h-auto bg-[#0070f3] text-white rounded-full font-bold text-lg hover:shadow-[0_0_30px_rgba(0,112,243,0.4)] transition-all active:scale-95">
                Submit Product
              </Button>
            </Link>
            <Link href="/products">
              <Button 
                variant="outline" 
                className="w-full sm:w-auto px-8 py-4 h-auto bg-transparent border border-[#414754]/30 text-white rounded-full font-bold text-lg hover:bg-[#262a30] transition-all"
              >
                Explore Products
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Discovery Deck (Asymmetrical Visual) */}
        <div className="mt-24 w-full max-w-6xl flex flex-col md:flex-row gap-6 px-4">
          <div className="w-full md:w-[60%] h-64 md:h-96 rounded-2xl overflow-hidden glass-panel border border-white/5 group relative">
            <div className="relative w-full h-full p-8 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent">
              <div className="absolute inset-0 bg-gradient-to-br from-[#6807ba]/30 to-[#0070f3]/20 -z-10" />
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-[#aec6ff]" />
                </div>
                <div>
                  <h3 className="font-headline font-bold text-xl text-white">Lumina Studio</h3>
                  <p className="text-sm text-[#c1c6d7]">AI-powered visual storytelling</p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-[40%] h-64 md:h-96 rounded-2xl overflow-hidden glass-panel border border-white/5 group relative">
            <div className="relative w-full h-full p-8 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0070f3]/20 to-[#3ce36a]/10 -z-10" />
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center">
                  <Code className="h-6 w-6 text-[#dbb8ff]" />
                </div>
                <div>
                  <h3 className="font-headline font-bold text-xl text-white">Forge CLI</h3>
                  <p className="text-sm text-[#c1c6d7]">Fast build tools for devs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="py-32 px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#0070f3] mb-3 block">
              Curated Selection
            </span>
            <h2 className="text-4xl font-headline font-extrabold text-white">Featured Products</h2>
          </div>
          <Link 
            href="/products?featured=true" 
            className="text-[#0070f3] font-bold flex items-center gap-2 hover:translate-x-1 transition-transform"
          >
            View all collection <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProducts.map((product: { id: string; slug: string; logoUrl?: string | null; name: string; tagline: string; category?: { name: string } | null }) => (
            <Link key={product.id} href={`/products/${product.slug}`}>
              <div className="group bg-[#1c2025] rounded-2xl p-6 border border-transparent hover:border-white/5 hover:bg-[#36393f] transition-all duration-300">
                <div className="flex justify-between items-start mb-8">
                  <div className="w-16 h-16 bg-[#181c21] rounded-2xl flex items-center justify-center border border-white/5">
                    {product.logoUrl ? (
                      <Image
                        src={product.logoUrl}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="rounded-lg"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-[#0070f3]">
                        {product.name[0]}
                      </span>
                    )}
                  </div>
                  {product.category && (
                    <span className="px-3 py-1 rounded-full bg-[#31353b] text-[10px] uppercase tracking-wider font-bold text-[#c1c6d7]">
                      {product.category.name}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-headline font-bold text-white mb-2">{product.name}</h3>
                <p className="text-[#c1c6d7] text-sm mb-8 leading-relaxed">{product.tagline}</p>
                <button className="w-full py-3 bg-[#31353b] text-white rounded-lg font-bold group-hover:bg-[#0070f3] transition-colors">
                  Visit Product
                </button>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-32 bg-[#181c21]">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-headline font-extrabold text-white mb-4">Browse by Category</h2>
            <p className="text-[#c1c6d7]">Find the specific tools you need for your next build.</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link 
                  key={category.slug} 
                  href={`/products?category=${category.slug}`}
                  className="px-8 py-6 rounded-2xl bg-[#262a30] border border-white/5 hover:border-[#0070f3]/50 hover:bg-[#36393f] transition-all group min-w-[160px] text-center"
                >
                  <Icon className="h-10 w-10 text-[#0070f3] mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <span className="font-headline font-bold text-white">{category.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Builddeck Section */}
      <section className="py-32 px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="relative">
            <div className="absolute -top-12 -left-12 w-64 h-64 bg-[#0070f3]/10 rounded-full blur-[80px]" />
            <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-white mb-8 leading-tight">
              Built for makers, <br/>by curators.
            </h2>
            <div className="space-y-12">
              <div className="flex gap-6">
                <div className="shrink-0 w-12 h-12 rounded-full bg-[#31353b] flex items-center justify-center">
                  <Rocket className="h-5 w-5 text-[#0070f3]" />
                </div>
                <div>
                  <h4 className="text-xl font-headline font-bold text-white mb-2">Get discovered</h4>
                  <p className="text-[#c1c6d7] leading-relaxed">
                    Reach thousands of early adopters and tech enthusiasts looking for the next innovative tool.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="shrink-0 w-12 h-12 rounded-full bg-[#31353b] flex items-center justify-center">
                  <Users className="h-5 w-5 text-[#dbb8ff]" />
                </div>
                <div>
                  <h4 className="text-xl font-headline font-bold text-white mb-2">Build audience</h4>
                  <p className="text-[#c1c6d7] leading-relaxed">
                    Connect directly with your users, gather feedback, and grow a loyal community around your vision.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="shrink-0 w-12 h-12 rounded-full bg-[#31353b] flex items-center justify-center">
                  <Zap className="h-5 w-5 text-[#3ce36a]" />
                </div>
                <div>
                  <h4 className="text-xl font-headline font-bold text-white mb-2">Launch faster</h4>
                  <p className="text-[#c1c6d7] leading-relaxed">
                    Skip the noise. Our curated environment ensures your product gets the high-quality attention it deserves.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative hidden lg:block">
            <div className="aspect-square bg-[#1c2025] rounded-3xl overflow-hidden border border-white/5 relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#0070f3]/20 to-transparent" />
              {/* Floating Data Points */}
              <div className="absolute top-12 left-12 p-4 glass-panel rounded-xl border border-white/10 shadow-xl">
                <span className="text-xs text-[#c1c6d7] uppercase tracking-widest font-bold">New Users</span>
                <div className="text-2xl font-headline font-extrabold text-white">+1,284</div>
              </div>
              <div className="absolute bottom-12 right-12 p-4 glass-panel rounded-xl border border-white/10 shadow-xl">
                <span className="text-xs text-[#c1c6d7] uppercase tracking-widest font-bold">Engagement</span>
                <div className="text-2xl font-headline font-extrabold text-[#3ce36a]">98.4%</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-32 px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-[#1c2025] to-[#181c21] rounded-3xl p-12 border border-white/5 text-center">
            <div className="w-16 h-16 bg-[#0070f3]/20 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <svg className="w-8 h-8 text-[#0070f3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-3xl font-headline font-extrabold text-white mb-4">
              Stay updated with new launches
            </h2>
            <p className="text-[#c1c6d7] mb-8 max-w-md mx-auto">
              Get a weekly digest of the best new products, curated specifically for makers and founders.
            </p>
            <NewsletterForm />
            <p className="text-xs text-[#8b90a0] mt-4">
              No spam. Only high-signal stories.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

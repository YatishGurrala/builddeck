import Link from "next/link";
import { ArrowRight, Clock, Search } from "lucide-react";

const blogPosts = [
  {
    slug: "how-to-launch-a-saas-in-30-days",
    title: "How to launch a SaaS in 30 days",
    excerpt:
      "The blueprint for speed: How we built, validated, and scaled Builddeck from zero to revenue-generating in just one month.",
    category: "Maker Stories",
    categoryColor: "text-purple-400",
    readTime: "12 min read",
    author: {
      name: "Sarah Chen",
      avatar: "/avatars/sarah.jpg",
    },
    date: "Oct 21, 2024",
    featured: true,
    image: "/blog/featured.jpg",
  },
  {
    slug: "mastering-the-viral-loop",
    title: "Mastering the Viral Loop: A Guide for Early Founders",
    excerpt:
      "Viral growth isn't just luck. It's engineering. We break down the mechanics of the Builddeck referral engine that drove 50k signups.",
    category: "Growth Tips",
    categoryColor: "text-emerald-400",
    readTime: "8 min read",
    author: {
      name: "Marcus Thorne",
      avatar: "/avatars/marcus.jpg",
    },
    date: "Oct 24, 2024",
    image: "/blog/viral-loop.jpg",
  },
  {
    slug: "introducing-digital-curator-engine",
    title: "Introducing: The Digital Curator Engine",
    excerpt:
      "Our most significant update yet. Discover how AI-driven editorial flows are changing the way you publish content.",
    category: "Product Updates",
    categoryColor: "text-[#0070f3]",
    readTime: "6 min read",
    author: {
      name: "Sarah Chen",
      avatar: "/avatars/sarah.jpg",
    },
    date: "Oct 21, 2024",
    image: "/blog/curator-engine.jpg",
  },
  {
    slug: "why-boring-ui-is-your-greatest-asset",
    title: "Why Boring UI is Actually Your Greatest Asset",
    excerpt:
      "Complexity is easy. Simplicity is hard. Exploring the psychology behind minimalist SaaS dashboards and high retention.",
    category: "Design",
    categoryColor: "text-purple-300",
    readTime: "10 min read",
    author: {
      name: "Leo Vargas",
      avatar: "/avatars/leo.jpg",
    },
    date: "Oct 18, 2024",
    image: "/blog/boring-ui.jpg",
  },
  {
    slug: "building-in-public-lessons-learned",
    title: "Building in Public: Lessons from 6 Months of Transparency",
    excerpt:
      "We shared everything—revenue, failures, and hard decisions. Here's what building in public taught us about community.",
    category: "Maker Stories",
    categoryColor: "text-purple-400",
    readTime: "15 min read",
    author: {
      name: "Marcus Thorne",
      avatar: "/avatars/marcus.jpg",
    },
    date: "Oct 15, 2024",
    image: "/blog/building-public.jpg",
  },
  {
    slug: "pricing-strategy-for-early-stage",
    title: "Stop Undercharging: Pricing Strategy for Early-Stage SaaS",
    excerpt:
      "Why most founders leave money on the table and the psychological frameworks to price with confidence.",
    category: "Growth Tips",
    categoryColor: "text-emerald-400",
    readTime: "9 min read",
    author: {
      name: "Sarah Chen",
      avatar: "/avatars/sarah.jpg",
    },
    date: "Oct 12, 2024",
    image: "/blog/pricing.jpg",
  },
];

const categories = [
  "All",
  "Product Updates",
  "Maker Stories",
  "Growth Tips",
  "Design",
];

export const metadata = {
  title: "Blog - Maker Stories | Builddeck",
  description:
    "Stories, insights, and guides from makers building the future. Learn how founders launch, scale, and succeed.",
};

export default function BlogPage() {
  const featuredPost = blogPosts.find((post) => post.featured);
  const otherPosts = blogPosts.filter((post) => !post.featured);

  return (
    <main className="pt-24 pb-20">
      {/* Hero: Featured Post */}
      {featuredPost && (
        <section className="max-w-7xl mx-auto px-6 mb-16">
          <Link href={`/blog/${featuredPost.slug}`}>
            <div className="relative group h-[400px] md:h-[500px] rounded-xl overflow-hidden cursor-pointer bg-[#1c2025]">
              <div className="absolute inset-0 bg-gradient-to-t from-[#101419] via-[#101419]/40 to-transparent z-10"></div>
              {/* Placeholder gradient for featured image */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#0070f3]/20 via-[#1c2025] to-purple-900/20 transition-transform duration-700 group-hover:scale-105"></div>

              <div className="absolute bottom-0 left-0 p-8 md:p-12 z-20 max-w-3xl">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {featuredPost.category}
                  </span>
                  <span className="flex items-center gap-1 text-slate-300 text-xs">
                    <Clock className="h-3 w-3" /> {featuredPost.readTime}
                  </span>
                </div>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-headline font-extrabold text-white mb-4 md:mb-6 leading-tight tracking-tight">
                  {featuredPost.title}
                </h1>
                <p className="text-base md:text-lg text-slate-300 mb-6 md:mb-8 max-w-xl line-clamp-2">
                  {featuredPost.excerpt}
                </p>
                <span className="inline-flex items-center gap-2 bg-[#0070f3] text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-bold transition-all hover:shadow-[0_0_20px_rgba(0,112,243,0.3)]">
                  Read More <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Categories Filter */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <div className="flex flex-wrap items-center gap-3">
          {categories.map((category, index) => (
            <button
              key={category}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                index === 0
                  ? "bg-[#0070f3] text-white"
                  : "bg-[#31353b] text-[#c1c6d7] hover:bg-[#36393f]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Blog Grid */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {otherPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <article className="group">
                <div className="aspect-[16/10] rounded-xl overflow-hidden mb-6 bg-[#1c2025] shadow-2xl relative">
                  {/* Placeholder gradient for image */}
                  <div className="w-full h-full bg-gradient-to-br from-[#262a30] via-[#1c2025] to-[#0070f3]/10 group-hover:scale-110 transition-transform duration-500"></div>
                </div>
                <div className="space-y-4">
                  <span
                    className={`${post.categoryColor} font-bold text-xs uppercase tracking-widest`}
                  >
                    {post.category}
                  </span>
                  <h3 className="text-xl md:text-2xl font-headline font-bold text-white leading-tight group-hover:text-[#0070f3] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-slate-400 text-sm line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-3 pt-4">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-[#1c2025]">
                      {/* Avatar placeholder */}
                      <div className="w-full h-full bg-gradient-to-br from-[#0070f3]/30 to-purple-500/30"></div>
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold leading-none">
                        {post.author.name}
                      </p>
                      <p className="text-slate-500 text-xs mt-1">{post.date}</p>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>

      {/* Load More */}
      <div className="max-w-7xl mx-auto px-6 text-center">
        <button className="bg-[#1c2025] text-[#c1c6d7] px-8 py-4 rounded-full font-bold hover:bg-[#262a30] transition-colors border border-[#414754]/30">
          Load More Stories
        </button>
      </div>

      {/* Newsletter CTA */}
      <section className="max-w-4xl mx-auto px-6 mt-20">
        <div className="glass-panel rounded-2xl p-8 md:p-12 text-center border border-[#414754]/30">
          <h2 className="text-2xl md:text-3xl font-headline font-bold text-white mb-4">
            Get the Maker Digest
          </h2>
          <p className="text-[#c1c6d7] mb-6 max-w-lg mx-auto">
            Weekly insights from the best makers and product teams. No spam,
            just actionable content.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="you@example.com"
              className="flex-1 px-4 py-3 rounded-full bg-[#1c2025] border border-[#414754]/30 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0070f3] focus:border-transparent"
            />
            <button className="bg-[#0070f3] text-white px-6 py-3 rounded-full font-bold hover:shadow-[0_0_15px_rgba(0,112,243,0.3)] transition-all">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

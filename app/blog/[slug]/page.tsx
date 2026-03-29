import Link from "next/link";
import { ArrowLeft, Share2, Bookmark, Heart, ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";

// Static blog data
const blogPosts: Record<
  string,
  {
    title: string;
    category: string;
    readTime: string;
    author: { name: string; bio: string };
    date: string;
    excerpt: string;
    content: string;
  }
> = {
  "how-to-launch-a-saas-in-30-days": {
    title: "How to launch a SaaS in 30 days",
    category: "Maker Stories",
    readTime: "12 min read",
    author: {
      name: "Sarah Chen",
      bio: "Founder & CEO at Builddeck. Previously built and sold two startups. Writing about the intersection of product strategy and rapid execution.",
    },
    date: "Oct 21, 2024",
    excerpt:
      "A clinical guide to moving from ideation to first-paying customer without the bloat of traditional development cycles.",
    content: `
      <p>Speed is the only moat for early-stage startups. In this editorial breakdown, we're stripping away the romanticism of the "long build" and looking at the pragmatic reality of the 30-day sprint.</p>
      
      <h2>Phase 1: The Ruthless Cull</h2>
      <p>Your first week isn't about building; it's about killing features. If your core value proposition requires more than two primary actions from the user, you've already failed the 30-day test. Identify the "Atomic Unit" of your SaaS.</p>
      
      <ul>
        <li><strong>One Problem:</strong> Solve one specific friction point deeply.</li>
        <li><strong>One Audience:</strong> Target a niche where you have direct access.</li>
        <li><strong>Zero Friction:</strong> Minimize the time to "Aha!" moment.</li>
      </ul>
      
      <blockquote>"If you aren't embarrassed by the first version of your product, you shipped too late. In a 30-day window, embarrassment is a milestone of success."<cite>— The Builddeck Manifesto</cite></blockquote>
      
      <h2>The Tech Stack of Least Resistance</h2>
      <p>This is not the time to learn a new framework. Use the tools you can type in your sleep. For most, this means a combination of reliable primitives:</p>
      
      <h3>The Engine</h3>
      <p>Next.js or Laravel. Choose the one where you know the deployment pipeline by heart.</p>
      
      <h3>The Persistence</h3>
      <p>Supabase or PlanetScale. Managed services save hours of dev-ops headache.</p>
      
      <p>By day 20, you should have a functional landing page with a waitlist. By day 25, the core loop must be testable. The final 5 days are reserved for one thing: <strong>Distribution Strategy.</strong></p>
      
      <h2>Phase 2: Building the Core Loop</h2>
      <p>Days 8-20 are where the magic happens. You're not building a product; you're building a hypothesis. Every line of code should answer one question: "Will this get me closer to my first paying customer?"</p>
      
      <p>Focus exclusively on the happy path. Error handling, edge cases, and polish come later—much later. Your goal is to create something that works for the ideal user in the ideal scenario.</p>
      
      <h2>Phase 3: Distribution Strategy</h2>
      <p>The last 5 days are crucial. You need to answer: "How will people find this?" Start with communities where your target users already gather. Product Hunt, relevant subreddits, Twitter/X communities, and niche Slack groups are your launch platforms.</p>
      
      <p>Remember: a product in the wild with 10 users provides more learning than a perfect product with zero users. Ship it.</p>
    `,
  },
  "mastering-the-viral-loop": {
    title: "Mastering the Viral Loop: A Guide for Early Founders",
    category: "Growth Tips",
    readTime: "8 min read",
    author: {
      name: "Marcus Thorne",
      bio: "Growth lead at Builddeck. Previously scaled products at three Y Combinator startups. Data-driven marketer with a passion for viral mechanics.",
    },
    date: "Oct 24, 2024",
    excerpt:
      "Viral growth isn't just luck. It's engineering. We break down the mechanics of the Builddeck referral engine that drove 50k signups.",
    content: `
      <p>Viral growth isn't magic—it's math. Understanding the viral coefficient (K-factor) is essential. If K > 1, you'll grow exponentially. If K < 1, growth will eventually plateau.</p>
      
      <h2>The Anatomy of a Viral Loop</h2>
      <p>Every viral loop has four components: the trigger, the action, the reward, and the investment. Miss one, and the loop breaks.</p>
      
      <h2>Engineering Your K-Factor</h2>
      <p>At Builddeck, we engineered our referral system to maximize the viral coefficient at every step...</p>
    `,
  },
  "introducing-digital-curator-engine": {
    title: "Introducing: The Digital Curator Engine",
    category: "Product Updates",
    readTime: "6 min read",
    author: {
      name: "Sarah Chen",
      bio: "Founder & CEO at Builddeck. Previously built and sold two startups. Writing about the intersection of product strategy and rapid execution.",
    },
    date: "Oct 21, 2024",
    excerpt:
      "Our most significant update yet. Discover how AI-driven editorial flows are changing the way you publish content.",
    content: `
      <p>Today we're launching the Digital Curator Engine—our most significant product update since Builddeck 1.0.</p>
      
      <h2>What is the Curator Engine?</h2>
      <p>The Curator Engine is an AI-powered editorial assistant that helps you organize, curate, and publish your content with unprecedented efficiency...</p>
    `,
  },
  "why-boring-ui-is-your-greatest-asset": {
    title: "Why Boring UI is Actually Your Greatest Asset",
    category: "Design",
    readTime: "10 min read",
    author: {
      name: "Leo Vargas",
      bio: "Design lead at Builddeck. Former design systems engineer at Stripe. Obsessed with the intersection of beauty and usability.",
    },
    date: "Oct 18, 2024",
    excerpt:
      "Complexity is easy. Simplicity is hard. Exploring the psychology behind minimalist SaaS dashboards and high retention.",
    content: `
      <p>The most successful SaaS products share one counterintuitive trait: they're boring. Linear, Notion, Stripe—these aren't flashy. They're reliable.</p>
      
      <h2>The Psychology of Boring</h2>
      <p>Users don't want excitement from their tools. They want predictability. Every unexpected animation, every novel interaction pattern introduces cognitive load...</p>
    `,
  },
  "building-in-public-lessons-learned": {
    title: "Building in Public: Lessons from 6 Months of Transparency",
    category: "Maker Stories",
    readTime: "15 min read",
    author: {
      name: "Marcus Thorne",
      bio: "Growth lead at Builddeck. Previously scaled products at three Y Combinator startups. Data-driven marketer with a passion for viral mechanics.",
    },
    date: "Oct 15, 2024",
    excerpt:
      "We shared everything—revenue, failures, and hard decisions. Here's what building in public taught us about community.",
    content: `
      <p>Six months ago, we made a decision that terrified us: share everything. Revenue numbers, failed experiments, difficult conversations—all of it, in public.</p>
      
      <h2>The Unexpected Benefits</h2>
      <p>Building in public created accountability, attracted talent, and built a community of supporters who felt invested in our success...</p>
    `,
  },
  "pricing-strategy-for-early-stage": {
    title: "Stop Undercharging: Pricing Strategy for Early-Stage SaaS",
    category: "Growth Tips",
    readTime: "9 min read",
    author: {
      name: "Sarah Chen",
      bio: "Founder & CEO at Builddeck. Previously built and sold two startups. Writing about the intersection of product strategy and rapid execution.",
    },
    date: "Oct 12, 2024",
    excerpt:
      "Why most founders leave money on the table and the psychological frameworks to price with confidence.",
    content: `
      <p>You're undercharging. I haven't seen your pricing page, but I know you're undercharging. Almost every early-stage founder does.</p>
      
      <h2>The Fear Factor</h2>
      <p>Underpricing stems from fear—fear of rejection, fear of seeming greedy, fear that you haven't "earned" higher prices yet. These fears are valid but ultimately self-sabotaging...</p>
    `,
  },
};

const relatedPosts = [
  {
    slug: "mastering-the-viral-loop",
    title: "Mastering the Viral Loop",
    category: "Growth Tips",
  },
  {
    slug: "why-boring-ui-is-your-greatest-asset",
    title: "Why Boring UI is Your Greatest Asset",
    category: "Design",
  },
  {
    slug: "building-in-public-lessons-learned",
    title: "Building in Public: Lessons Learned",
    category: "Maker Stories",
  },
];

export async function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts[slug];

  if (!post) {
    return { title: "Post Not Found | Builddeck Blog" };
  }

  return {
    title: `${post.title} | Builddeck Blog`,
    description: post.excerpt,
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts[slug];

  if (!post) {
    notFound();
  }

  return (
    <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Article Content */}
        <article className="lg:col-span-8 space-y-10">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-[#8b90a0]">
            <Link
              href="/blog"
              className="hover:text-[#0070f3] transition-colors"
            >
              Blog
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-[#c1c6d7]">{post.category}</span>
          </nav>

          {/* Header */}
          <header className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-extrabold tracking-tight text-white leading-[1.1]">
              {post.title}
            </h1>
            <p className="text-lg md:text-xl text-[#c1c6d7] leading-relaxed max-w-3xl">
              {post.excerpt}
            </p>

            <div className="flex items-center gap-4 py-4 border-y border-[#414754]/30">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0070f3]/30 to-purple-500/30"></div>
              <div className="flex flex-col">
                <span className="font-bold text-white">{post.author.name}</span>
                <div className="flex items-center gap-2 text-sm text-[#8b90a0]">
                  <span>{post.date}</span>
                  <span className="w-1 h-1 bg-[#414754] rounded-full"></span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl shadow-black/60 group">
            <div className="w-full h-full bg-gradient-to-br from-[#0070f3]/20 via-[#1c2025] to-purple-900/20 transition-transform duration-700 group-hover:scale-105"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#101419]/40 to-transparent"></div>
          </div>

          {/* Article Body */}
          <div
            className="prose-custom space-y-6 text-[#e0e2ea]/90 text-lg leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Share & Actions */}
          <div className="flex items-center justify-between py-6 border-t border-[#414754]/30">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-[#c1c6d7] hover:text-white transition-colors">
                <Heart className="h-5 w-5" />
                <span className="text-sm">124</span>
              </button>
              <button className="flex items-center gap-2 text-[#c1c6d7] hover:text-white transition-colors">
                <Bookmark className="h-5 w-5" />
                <span className="text-sm">Save</span>
              </button>
            </div>
            <button className="flex items-center gap-2 text-[#c1c6d7] hover:text-white transition-colors">
              <Share2 className="h-5 w-5" />
              <span className="text-sm">Share</span>
            </button>
          </div>

          {/* Author Bio */}
          <section className="mt-16 p-8 bg-[#181c21] rounded-2xl border border-[#414754]/30">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
              <div className="w-24 h-24 rounded-full border-4 border-[#31353b] bg-gradient-to-br from-[#0070f3]/30 to-purple-500/30"></div>
              <div className="space-y-4">
                <h3 className="text-2xl font-headline font-bold text-white">
                  {post.author.name}
                </h3>
                <p className="text-[#c1c6d7] leading-relaxed">
                  {post.author.bio}
                </p>
                <button className="text-[#0070f3] font-semibold text-sm hover:underline">
                  Follow →
                </button>
              </div>
            </div>
          </section>
        </article>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-8">
          {/* Sticky wrapper */}
          <div className="lg:sticky lg:top-24 space-y-8">
            {/* Quick Actions */}
            <div className="bg-[#181c21] rounded-xl p-6 border border-[#414754]/30">
              <h4 className="font-headline font-bold text-white mb-4">
                Quick Actions
              </h4>
              <div className="flex gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 bg-[#1c2025] text-[#c1c6d7] py-3 rounded-lg hover:bg-[#262a30] transition-colors">
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 bg-[#1c2025] text-[#c1c6d7] py-3 rounded-lg hover:bg-[#262a30] transition-colors">
                  <Bookmark className="h-4 w-4" />
                  Save
                </button>
              </div>
            </div>

            {/* Related Posts */}
            <div className="bg-[#181c21] rounded-xl p-6 border border-[#414754]/30">
              <h4 className="font-headline font-bold text-white mb-4">
                Related Reading
              </h4>
              <div className="space-y-4">
                {relatedPosts.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/blog/${related.slug}`}
                    className="block group"
                  >
                    <p className="text-[#0070f3] text-xs font-semibold uppercase tracking-wider mb-1">
                      {related.category}
                    </p>
                    <p className="text-white font-semibold group-hover:text-[#0070f3] transition-colors">
                      {related.title}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-gradient-to-br from-[#0070f3]/10 to-purple-600/10 rounded-xl p-6 border border-[#0070f3]/20">
              <h4 className="font-headline font-bold text-white mb-2">
                Join 10k+ Makers
              </h4>
              <p className="text-[#c1c6d7] text-sm mb-4">
                Get weekly insights delivered to your inbox.
              </p>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg bg-[#101419] border border-[#414754]/30 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0070f3] focus:border-transparent mb-3"
              />
              <button className="w-full bg-[#0070f3] text-white py-3 rounded-lg font-bold hover:shadow-[0_0_15px_rgba(0,112,243,0.3)] transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* Back link */}
      <div className="mt-16 pt-8 border-t border-[#414754]/30">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-[#0070f3] font-semibold hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all stories
        </Link>
      </div>
    </main>
  );
}

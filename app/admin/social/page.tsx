import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Share2,
  Twitter,
  Linkedin,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth/utils";
import { prisma } from "@/lib/db/prisma";
import { formatDate } from "@/lib/utils";
import { SocialPostCard } from "./social-post-card";

interface SocialPageProps {
  searchParams: Promise<{ status?: string; platform?: string }>;
}

export default async function SocialPage({ searchParams }: SocialPageProps) {
  const params = await searchParams;
  
  // Verify admin access
  await requireAdmin();

  // Build filter
  const where: { status?: string; platform?: string } = {};
  if (params.status) {
    where.status = params.status.toUpperCase();
  }
  if (params.platform) {
    where.platform = params.platform.toUpperCase();
  }

  // Fetch social posts with product info
  const posts = await prisma.socialPost.findMany({
    where,
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          tagline: true,
          logoUrl: true,
          websiteUrl: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Get stats
  const [draftCount, publishedCount, failedCount, totalCount] = await Promise.all([
    prisma.socialPost.count({ where: { status: "DRAFT" } }),
    prisma.socialPost.count({ where: { status: "PUBLISHED" } }),
    prisma.socialPost.count({ where: { status: "FAILED" } }),
    prisma.socialPost.count(),
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Social Posts</h1>
          <p className="text-zinc-400 mt-1">
            Manage and publish social media posts for approved products
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Link href="/admin/social">
          <Card className={`cursor-pointer transition-all hover:border-zinc-700 ${!params.status ? "border-violet-500/50 bg-violet-500/5" : ""}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400">Total</p>
                  <p className="text-2xl font-bold text-white">{totalCount}</p>
                </div>
                <Share2 className="h-5 w-5 text-zinc-600" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/social?status=draft">
          <Card className={`cursor-pointer transition-all hover:border-zinc-700 ${params.status === "draft" ? "border-yellow-500/50 bg-yellow-500/5" : ""}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400">Drafts</p>
                  <p className="text-2xl font-bold text-yellow-400">{draftCount}</p>
                </div>
                <Clock className="h-5 w-5 text-yellow-500/50" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/social?status=published">
          <Card className={`cursor-pointer transition-all hover:border-zinc-700 ${params.status === "published" ? "border-green-500/50 bg-green-500/5" : ""}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400">Published</p>
                  <p className="text-2xl font-bold text-green-400">{publishedCount}</p>
                </div>
                <CheckCircle className="h-5 w-5 text-green-500/50" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/social?status=failed">
          <Card className={`cursor-pointer transition-all hover:border-zinc-700 ${params.status === "failed" ? "border-red-500/50 bg-red-500/5" : ""}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400">Failed</p>
                  <p className="text-2xl font-bold text-red-400">{failedCount}</p>
                </div>
                <XCircle className="h-5 w-5 text-red-500/50" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Platform Filter */}
      <div className="flex gap-2 mb-6">
        <Link href={params.status ? `/admin/social?status=${params.status}` : "/admin/social"}>
          <Badge
            variant={!params.platform ? "default" : "outline"}
            className="cursor-pointer"
          >
            All Platforms
          </Badge>
        </Link>
        <Link href={params.status ? `/admin/social?status=${params.status}&platform=x` : "/admin/social?platform=x"}>
          <Badge
            variant={params.platform === "x" ? "default" : "outline"}
            className="cursor-pointer gap-1"
          >
            <Twitter className="h-3 w-3" />
            X (Twitter)
          </Badge>
        </Link>
        <Link href={params.status ? `/admin/social?status=${params.status}&platform=linkedin` : "/admin/social?platform=linkedin"}>
          <Badge
            variant={params.platform === "linkedin" ? "default" : "outline"}
            className="cursor-pointer gap-1"
          >
            <Linkedin className="h-3 w-3" />
            LinkedIn
          </Badge>
        </Link>
      </div>

      {/* Posts List */}
      {posts.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Share2 className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No social posts found</h3>
            <p className="text-zinc-400">
              {params.status || params.platform
                ? "Try adjusting your filters"
                : "Social posts will be generated when products are approved"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <SocialPostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

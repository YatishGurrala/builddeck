import Image from "next/image";
import Link from "next/link";
import {
  Clock,
  CheckCircle,
  XCircle,
  Mail,
  ExternalLink,
  LayoutGrid,
  Share2,
  Radio,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { AdminActions } from "./admin-actions";
import { requireAdmin } from "@/lib/buildstack/auth";
import { getAllProducts, getAdminStats } from "@/lib/buildstack/queries/products";
import { getCategories } from "@/lib/buildstack/queries/categories";
import { getSocialPosts } from "@/lib/buildstack/queries/social";
import type { Product, ProductStatus } from "@/types";

interface AdminPageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = await searchParams;

  // Verify admin access
  await requireAdmin();

  // Build filter condition
  const statusFilter = params.status?.toUpperCase() as ProductStatus | undefined;
  const validStatuses: ProductStatus[] = ["PENDING", "APPROVED", "REJECTED"];

  // Fetch all products and categories
  const [allProductRecords, categoryRecords, socialDrafts] = await Promise.all([
    getAllProducts(),
    getCategories(),
    getSocialPosts({ status: "DRAFT" }),
  ]);

  const categoryMap = new Map(categoryRecords.map((c) => [c.id, c.data.name]));

  const filteredRecords =
    statusFilter && validStatuses.includes(statusFilter)
      ? allProductRecords.filter((r) => r.data.status === statusFilter)
      : allProductRecords;

  const products = filteredRecords.map((r) => ({
      ...r.data,
      id: r.id,
      featuredAt: r.data.featuredAt ? new Date(r.data.featuredAt) : null,
      reviewedAt: r.data.reviewedAt ? new Date(r.data.reviewedAt) : null,
      submittedAt: new Date(r.data.submittedAt),
      approvedAt: r.data.approvedAt ? new Date(r.data.approvedAt) : null,
      createdAt: new Date(r.createdAt),
      updatedAt: new Date(r.updatedAt),
      category: r.data.categoryId ? { name: categoryMap.get(r.data.categoryId) ?? "Uncategorized" } : null,
      user: undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    })) as any as (Product & { category?: { name: string } | null; user?: { name: string | null; email: string } | null })[];

  const pendingCount = allProductRecords.filter((r) => r.data.status === "PENDING").length;
  const approvedCount = allProductRecords.filter((r) => r.data.status === "APPROVED").length;
  const rejectedCount = allProductRecords.filter((r) => r.data.status === "REJECTED").length;
  const totalCount = allProductRecords.length;
  const subscriberCount = 0;
  const socialPostCount = socialDrafts.length;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-zinc-400 mt-1">
          Manage product submissions and moderate content
        </p>
      </div>

      {/* Stats Cards - Clickable Filters */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <Link href="/admin">
          <Card className={`cursor-pointer transition-all hover:border-zinc-700 ${!params.status ? "border-violet-500/50 bg-violet-500/5" : ""}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400">Total</p>
                  <p className="text-2xl font-bold text-white">{totalCount}</p>
                </div>
                <LayoutGrid className="h-5 w-5 text-zinc-600" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin?status=pending">
          <Card className={`cursor-pointer transition-all hover:border-zinc-700 ${params.status === "pending" ? "border-yellow-500/50 bg-yellow-500/5" : ""}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400">Pending</p>
                  <p className="text-2xl font-bold text-yellow-400">{pendingCount}</p>
                </div>
                <Clock className="h-5 w-5 text-yellow-500/50" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin?status=approved">
          <Card className={`cursor-pointer transition-all hover:border-zinc-700 ${params.status === "approved" ? "border-green-500/50 bg-green-500/5" : ""}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400">Approved</p>
                  <p className="text-2xl font-bold text-green-400">{approvedCount}</p>
                </div>
                <CheckCircle className="h-5 w-5 text-green-500/50" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin?status=rejected">
          <Card className={`cursor-pointer transition-all hover:border-zinc-700 ${params.status === "rejected" ? "border-red-500/50 bg-red-500/5" : ""}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400">Rejected</p>
                  <p className="text-2xl font-bold text-red-400">{rejectedCount}</p>
                </div>
                <XCircle className="h-5 w-5 text-red-500/50" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400">Subscribers</p>
                <p className="text-2xl font-bold text-violet-400">{subscriberCount || 0}</p>
              </div>
              <Mail className="h-5 w-5 text-violet-500/50" />
            </div>
          </CardContent>
        </Card>

        <Link href="/admin/social">
          <Card className="cursor-pointer transition-all hover:border-zinc-700 hover:border-violet-500/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400">Social Drafts</p>
                  <p className="text-2xl font-bold text-blue-400">{socialPostCount}</p>
                </div>
                <Share2 className="h-5 w-5 text-blue-500/50" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/reach">
          <Card className="cursor-pointer transition-all hover:border-zinc-700 hover:border-emerald-500/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400">Reach Debug</p>
                  <p className="text-2xl font-bold text-emerald-400">Open</p>
                </div>
                <Radio className="h-5 w-5 text-emerald-500/50" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader className="border-b border-zinc-800">
          <div className="flex items-center justify-between">
            <CardTitle>
              {params.status
                ? `${params.status.charAt(0).toUpperCase() + params.status.slice(1)} Submissions`
                : "All Submissions"}
              <span className="ml-2 text-sm font-normal text-zinc-500">
                ({products?.length || 0})
              </span>
            </CardTitle>
            {params.status && (
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  Clear filter
                </Button>
              </Link>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {!products || products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-zinc-400">No submissions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800 text-left">
                    <th className="px-6 py-4 text-xs font-medium text-zinc-400 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-4 text-xs font-medium text-zinc-400 uppercase tracking-wider hidden md:table-cell">
                      Category
                    </th>
                    <th className="px-6 py-4 text-xs font-medium text-zinc-400 uppercase tracking-wider hidden lg:table-cell">
                      Submitted By
                    </th>
                    <th className="px-6 py-4 text-xs font-medium text-zinc-400 uppercase tracking-wider hidden sm:table-cell">
                      Date
                    </th>
                    <th className="px-6 py-4 text-xs font-medium text-zinc-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-xs font-medium text-zinc-400 uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {products.map((product) => (
                    <ProductTableRow key={product.id} product={product as Product & { category?: { name: string } | null; user?: { name: string | null; email: string } | null }} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ProductTableRow({ product }: { product: Product & { category?: { name: string } | null; user?: { name: string | null; email: string } | null } }) {
  const statusConfig = {
    PENDING: { color: "warning", label: "Pending" },
    APPROVED: { color: "success", label: "Approved" },
    REJECTED: { color: "destructive", label: "Rejected" },
  } as const;

  const status = statusConfig[product.status];

  return (
    <tr className="hover:bg-zinc-900/50 transition-colors">
      {/* Product Info */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-800">
            {product.logoUrl ? (
              <Image
                src={product.logoUrl}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm font-bold text-zinc-600">
                {product.name[0]}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium text-white truncate max-w-[180px]">
                {product.name}
              </p>
              {product.featured && (
                <Badge variant="default" className="text-[10px] px-1.5 py-0">
                  Featured
                </Badge>
              )}
            </div>
            <p className="text-sm text-zinc-500 truncate max-w-[180px]">
              {product.tagline}
            </p>
          </div>
        </div>
      </td>

      {/* Category */}
      <td className="px-6 py-4 hidden md:table-cell">
        <Badge variant="secondary" className="text-xs">
          {product.category?.name || "Uncategorized"}
        </Badge>
      </td>

      {/* Submitted By */}
      <td className="px-6 py-4 hidden lg:table-cell">
        <div className="text-sm">
          <p className="text-zinc-300">
            {product.user?.name || "Unknown"}
          </p>
          <p className="text-zinc-500 text-xs truncate max-w-[150px]">
            {product.user?.email}
          </p>
        </div>
      </td>

      {/* Date */}
      <td className="px-6 py-4 hidden sm:table-cell">
        <p className="text-sm text-zinc-400">
          {formatDate(product.createdAt)}
        </p>
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <Badge variant={status.color}>{status.label}</Badge>
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-1">
          <a
            href={product.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            title="Visit website"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
          <AdminActions product={product} />
        </div>
      </td>
    </tr>
  );
}

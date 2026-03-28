import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Clock,
  CheckCircle,
  XCircle,
  Mail,
  ExternalLink,
  LayoutGrid,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { AdminActions } from "./admin-actions";
import type { Product } from "@/types";

interface AdminPageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = await searchParams;
  const supabase = await createClient();

  // Verify admin access (double check - middleware should handle this)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  // Fetch all products (admin can see all)
  let query = supabase
    .from("products")
    .select("*, category:categories(*), profile:profiles(*)")
    .order("created_at", { ascending: false });

  // Filter by status if specified
  if (params.status && ["pending", "approved", "rejected"].includes(params.status)) {
    query = query.eq("status", params.status);
  }

  const { data: products } = await query;

  // Fetch stats for all products
  const { data: allProducts } = await supabase
    .from("products")
    .select("status");

  const pendingCount = allProducts?.filter((p) => p.status === "pending").length || 0;
  const approvedCount = allProducts?.filter((p) => p.status === "approved").length || 0;
  const rejectedCount = allProducts?.filter((p) => p.status === "rejected").length || 0;
  const totalCount = allProducts?.length || 0;

  // Fetch newsletter subscribers count
  const { count: subscriberCount } = await supabase
    .from("newsletter_subscribers")
    .select("*", { count: "exact", head: true });

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
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
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
                    <ProductTableRow key={product.id} product={product} />
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

function ProductTableRow({ product }: { product: Product }) {
  const statusConfig = {
    pending: { color: "warning", label: "Pending" },
    approved: { color: "success", label: "Approved" },
    rejected: { color: "destructive", label: "Rejected" },
  } as const;

  const status = statusConfig[product.status];

  return (
    <tr className="hover:bg-zinc-900/50 transition-colors">
      {/* Product Info */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-800">
            {product.logo_url ? (
              <Image
                src={product.logo_url}
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
            {product.profile?.name || "Unknown"}
          </p>
          <p className="text-zinc-500 text-xs truncate max-w-[150px]">
            {product.profile?.email}
          </p>
        </div>
      </td>

      {/* Date */}
      <td className="px-6 py-4 hidden sm:table-cell">
        <p className="text-sm text-zinc-400">
          {formatDate(product.created_at)}
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
            href={product.website_url}
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

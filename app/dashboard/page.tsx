import Link from "next/link";
import Image from "next/image";
import { Plus, Edit, Trash2, ExternalLink, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { DeleteProductButton } from "./delete-button";

interface DashboardPageProps {
  searchParams: Promise<{ submitted?: string }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: products } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  const statusColors = {
    pending: "warning",
    approved: "success",
    rejected: "destructive",
  } as const;

  return (
    <div className="container mx-auto px-4 py-12">
      {params.submitted && (
        <div className="mb-8 rounded-lg bg-green-500/10 border border-green-500/20 p-4 flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <p className="text-green-400">
            Your product has been submitted! It will be reviewed by our team shortly.
          </p>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-zinc-400 mt-1">
            Welcome back, {profile?.name || user?.email}
          </p>
        </div>
        <Link href="/submit">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Submit Product
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-white">{products?.length || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Approved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-400">
              {products?.filter((p) => p.status === "approved").length || 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Pending Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-400">
              {products?.filter((p) => p.status === "pending").length || 0}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Products</CardTitle>
        </CardHeader>
        <CardContent>
          {!products || products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-zinc-400 mb-4">
                You haven&apos;t submitted any products yet.
              </p>
              <Link href="/submit">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Submit Your First Product
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 p-4 rounded-lg border border-zinc-800 bg-zinc-900/50"
                >
                  <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-zinc-800">
                    {product.logo_url ? (
                      <Image
                        src={product.logo_url}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xl font-bold text-zinc-600">
                        {product.name[0]}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-white truncate">
                        {product.name}
                      </h3>
                      <Badge variant={statusColors[product.status]}>
                        {product.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-zinc-400 truncate mt-1">
                      {product.tagline}
                    </p>
                    <p className="text-xs text-zinc-500 mt-1">
                      Submitted {formatDate(product.created_at)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {product.status === "approved" && (
                      <Link href={`/products/${product.slug}`}>
                        <Button variant="ghost" size="icon">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                    <Link href={`/dashboard/edit/${product.id}`}>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <DeleteProductButton productId={product.id} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

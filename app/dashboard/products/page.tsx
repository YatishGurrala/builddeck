import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth/utils";
import { getDefaultMockFounderProfile } from "@/lib/founder-profile/mock-data";
import { FounderDashboardNav } from "../_components/founder-dashboard-nav";

export const metadata = { title: "Products · Dashboard · Builddeck" };

export default async function DashboardProductsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const profile = getDefaultMockFounderProfile();
  const products = [...profile.products].sort((a, b) => a.position - b.position);

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/dashboard" className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </Link>

      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Products</h1>
          <p className="mt-1 text-zinc-400">
            Projects featured in the &quot;Currently Building&quot; section of your profile.
          </p>
        </div>
        <Button disabled className="gap-2">
          <Plus className="h-4 w-4" /> Add product
        </Button>
      </div>

      <FounderDashboardNav active="products" />

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-base">{product.name}</CardTitle>
                <span
                  className={
                    "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide " +
                    (product.status === "launched"
                      ? "bg-cyan-400/15 text-cyan-300"
                      : product.status === "building"
                      ? "bg-violet-400/15 text-violet-300"
                      : "bg-white/10 text-zinc-400")
                  }
                >
                  {product.status}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-400">{product.description}</p>
              {product.url ? (
                <p className="mt-2 truncate text-xs text-cyan-300">{product.url}</p>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

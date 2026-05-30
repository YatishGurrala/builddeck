import { getCurrentUser } from "@/lib/auth/utils";
import { redirect } from "next/navigation";
import { getWorkspaceProducts } from "@/lib/db/queries/workspace/products";
import { ProductList } from "@/components/workspace/product-list";
import Link from "next/link";
import { Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function WorkspaceProductsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const products = await getWorkspaceProducts(user.id);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--on-surface)]">Products</h1>
          <p className="text-sm text-[var(--on-surface-variant)] mt-1">
            Manage your products, roadmaps, tasks, and docs.
          </p>
        </div>
        <Link href="/dashboard/workspace/products/new" className={cn(buttonVariants())}>
          <Plus className="h-4 w-4 mr-2" />
          New Product
        </Link>
      </div>
      <ProductList products={products} />
    </div>
  );
}

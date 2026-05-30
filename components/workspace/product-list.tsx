import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/workspace/status-badge";

interface WorkspaceProduct {
  id: string;
  name: string;
  tagline?: string | null;
  status: string;
  roadmapPhase: string;
  _count: { tasks: number; docs: number; roadmapItems: number };
}

interface ProductCardProps {
  product: WorkspaceProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/dashboard/workspace/products/${product.id}`}>
      <div className="group rounded-xl border border-[var(--surface-container-high)] bg-[var(--surface)] p-5 hover:border-[var(--primary)] hover:shadow-sm transition-all cursor-pointer">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-semibold text-[var(--on-surface)] group-hover:text-[var(--primary)] transition-colors line-clamp-1">
            {product.name}
          </h3>
          <StatusBadge status={product.status} />
        </div>

        {product.tagline && (
          <p className="text-sm text-[var(--on-surface-variant)] line-clamp-2 mb-4">
            {product.tagline}
          </p>
        )}

        <div className="flex items-center gap-4 text-xs text-[var(--on-surface-variant)]">
          <span>{product._count.tasks} tasks</span>
          <span>{product._count.docs} docs</span>
          <span>{product._count.roadmapItems} roadmap items</span>
        </div>

        <div className="mt-3">
          <StatusBadge status={product.roadmapPhase} />
        </div>
      </div>
    </Link>
  );
}

interface ProductListProps {
  products: WorkspaceProduct[];
}

export function ProductList({ products }: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-14 h-14 rounded-2xl bg-[var(--surface-container)] flex items-center justify-center mb-4">
          <Plus className="h-6 w-6 text-[var(--on-surface-variant)]" />
        </div>
        <h3 className="font-semibold text-[var(--on-surface)] mb-1">No products yet</h3>
        <p className="text-sm text-[var(--on-surface-variant)] mb-5">
          Start by adding your first product to track its progress.
        </p>
        <Link href="/dashboard/workspace/products/new">
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Product
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

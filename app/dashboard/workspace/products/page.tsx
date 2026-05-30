import { getCurrentUser } from "@/lib/auth/utils";
import { redirect } from "next/navigation";
import { getWorkspaceProducts } from "@/lib/db/queries/workspace/products";
import { StatusBadge } from "@/components/workspace/status-badge";
import Link from "next/link";
import { Plus, Package } from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_FILTERS = ["All", "IDEA", "BUILDING", "LAUNCHED", "PAUSED"] as const;

interface WorkspaceProductsPageProps {
  searchParams?: Promise<{ status?: string }>;
}

export default async function WorkspaceProductsPage({ searchParams }: WorkspaceProductsPageProps) {
  const user = (await getCurrentUser()) ?? { id: "preview", name: "Preview User", email: "preview@local" };

  const params = await searchParams;
  const activeStatus = params?.status ?? "All";

  const products = await getWorkspaceProducts(user.id).catch(() => []);
  const filtered = activeStatus === "All" ? products : products.filter((p) => p.status === activeStatus);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-[#a1a1aa] text-sm mt-1 ws-label">Manage your products, roadmaps, tasks, and docs.</p>
        </div>
        <Link href="/dashboard/workspace/products/new" className="flex items-center gap-2 bg-white text-[#131315] px-4 py-2 rounded text-sm font-mono tracking-wider hover:bg-[#e2e2e2] transition-colors">
          <Plus className="h-4 w-4" /> New Product
        </Link>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_FILTERS.map((status) => (
          <Link
            key={status}
            href={status === "All" ? "/dashboard/workspace/products" : `/dashboard/workspace/products?status=${status}`}
            className={cn(
              "px-3 py-1 rounded text-xs font-mono tracking-wider transition-colors border",
              activeStatus === status
                ? "bg-[#2a2a2c] border-[#444748] text-white"
                : "bg-transparent border-[#27272a] text-[#a1a1aa] hover:text-[#e5e1e4] hover:border-[#444748]"
            )}
          >
            {status}
          </Link>
        ))}
      </div>

      {/* Products grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-lg bg-[#1c1b1d] border border-[#27272a] flex items-center justify-center mb-4">
            <Package className="h-6 w-6 text-[#a1a1aa]" />
          </div>
          <h3 className="text-white font-semibold mb-1">No products yet</h3>
          <p className="text-[#a1a1aa] text-sm mb-5 ws-label">Start by adding your first product to track its progress.</p>
          <Link href="/dashboard/workspace/products/new" className="flex items-center gap-2 bg-white text-[#131315] px-4 py-2 rounded text-sm font-mono tracking-wider hover:bg-[#e2e2e2] transition-colors">
            <Plus className="h-4 w-4" /> New Product
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((product) => (
            <Link key={product.id} href={`/dashboard/workspace/products/${product.id}`}>
              <div className="group bg-[#1c1b1d] border border-[#27272a] rounded-lg p-5 hover:border-[#444748] transition-colors cursor-pointer h-full flex flex-col">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-semibold text-white group-hover:text-[#6366f1] transition-colors line-clamp-1">{product.name}</h3>
                  <StatusBadge status={product.status} />
                </div>
                {(product as any).tagline && (
                  <p className="text-sm text-[#a1a1aa] line-clamp-2 mb-4 flex-1">{(product as any).tagline}</p>
                )}
                <div className="mt-auto pt-3 border-t border-[#27272a] flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-[#a1a1aa] ws-label">
                    <span>{product._count?.tasks ?? 0} tasks</span>
                    <span>{product._count?.roadmapItems ?? 0} roadmap</span>
                  </div>
                  <StatusBadge status={(product as any).roadmapPhase ?? "DISCOVERY"} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

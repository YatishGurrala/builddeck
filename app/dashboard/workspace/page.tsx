import { getCurrentUser } from "@/lib/auth/utils";
import { redirect } from "next/navigation";
import { getWorkspaceProducts } from "@/lib/db/queries/workspace/products";
import Link from "next/link";
import { Package, CheckSquare, Map, Plus, ArrowRight } from "lucide-react";
import { StatusBadge } from "@/components/workspace/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function WorkspaceDashboardPage() {
  const user = (await getCurrentUser()) ?? { id: "preview", name: "Preview User", email: "preview@local" };

  const products = await getWorkspaceProducts(user.id).catch(() => []);

  const totalProducts = products.length;
  const totalTasks = products.reduce((s, p) => s + (p._count?.tasks ?? 0), 0);
  const totalRoadmapItems = products.reduce((s, p) => s + (p._count?.roadmapItems ?? 0), 0);
  const recentProducts = products.slice(0, 3);

  const stats = [
    { label: "Total Products", value: totalProducts, icon: Package, color: "#6366f1" },
    { label: "Active Tasks", value: totalTasks, icon: CheckSquare, color: "#22c55e" },
    { label: "Roadmap Items", value: totalRoadmapItems, icon: Map, color: "#f59e0b" },
    { label: "Docs", value: products.reduce((s, p) => s + (p._count?.docs ?? 0), 0), icon: Package, color: "#a1a1aa" },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Command Center</h1>
        <p className="text-[#a1a1aa] text-sm mt-1 ws-label">Overview of your products, tasks, and roadmap.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-[#1c1b1d] border border-[#27272a] rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <Icon className="h-4 w-4" style={{ color }} />
              <span className="text-[#a1a1aa] text-xs ws-label uppercase tracking-wider">{label}</span>
            </div>
            <p className="text-3xl font-bold text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* Recent Products */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold text-sm ws-label uppercase tracking-wider">Recent Products</h2>
          <Link href="/dashboard/workspace/products" className="flex items-center gap-1 text-[#6366f1] text-xs ws-label hover:text-[#818cf8] transition-colors">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        {recentProducts.length === 0 ? (
          <div className="bg-[#1c1b1d] border border-[#27272a] rounded-lg p-8 text-center">
            <Package className="h-8 w-8 text-[#a1a1aa] mx-auto mb-3 opacity-50" />
            <p className="text-[#a1a1aa] text-sm">No products yet.</p>
            <Link href="/dashboard/workspace/products/new" className={cn(buttonVariants(), "mt-4 inline-flex bg-white text-[#131315] hover:bg-[#e2e2e2] text-sm font-mono")}>
              <Plus className="h-4 w-4 mr-2" /> New Product
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {recentProducts.map((product) => (
              <Link
                key={product.id}
                href={`/dashboard/workspace/products/${product.id}`}
                className="flex items-center justify-between bg-[#1c1b1d] border border-[#27272a] rounded-lg px-5 py-4 hover:border-[#444748] transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded bg-[#2a2a2c] flex items-center justify-center text-[#6366f1] font-bold text-sm">
                    {product.name[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-medium group-hover:text-[#6366f1] transition-colors">{product.name}</p>
                    <p className="text-[#a1a1aa] text-xs ws-label mt-0.5">{product._count?.tasks ?? 0} tasks · {product._count?.roadmapItems ?? 0} roadmap items</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={product.status} />
                  <ArrowRight className="h-4 w-4 text-[#444748] group-hover:text-[#a1a1aa] transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-white font-semibold text-sm ws-label uppercase tracking-wider mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard/workspace/products/new" className="flex items-center gap-2 bg-white text-[#131315] px-4 py-2 rounded text-sm font-mono tracking-wider hover:bg-[#e2e2e2] transition-colors">
            <Plus className="h-4 w-4" /> New Product
          </Link>
          <Link href="/dashboard/workspace/tasks" className="flex items-center gap-2 bg-[#1c1b1d] border border-[#27272a] text-[#e5e1e4] px-4 py-2 rounded text-sm font-mono tracking-wider hover:bg-[#2a2a2c] hover:border-[#444748] transition-colors">
            <CheckSquare className="h-4 w-4" /> View Tasks
          </Link>
          <Link href="/dashboard/workspace/roadmap" className="flex items-center gap-2 bg-[#1c1b1d] border border-[#27272a] text-[#e5e1e4] px-4 py-2 rounded text-sm font-mono tracking-wider hover:bg-[#2a2a2c] hover:border-[#444748] transition-colors">
            <Map className="h-4 w-4" /> View Roadmap
          </Link>
        </div>
      </div>
    </div>
  );
}

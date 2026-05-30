import { getCurrentUser } from "@/lib/auth/utils";
import { redirect } from "next/navigation";
import { getWorkspaceProducts } from "@/lib/db/queries/workspace/products";
import { getRoadmapItems } from "@/lib/db/queries/workspace/roadmap";
import { Map, Plus } from "lucide-react";
import Link from "next/link";

type RoadmapStatus = "PLANNED" | "IN_PROGRESS" | "COMPLETED";

const COLUMNS: { status: RoadmapStatus; label: string; color: string }[] = [
  { status: "PLANNED", label: "Planned", color: "#a1a1aa" },
  { status: "IN_PROGRESS", label: "In Progress", color: "#6366f1" },
  { status: "COMPLETED", label: "Completed", color: "#22c55e" },
];

export default async function RoadmapPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const products = await getWorkspaceProducts(user.id).catch(() => []);

  const allItems: Array<{
    id: string;
    title: string;
    description?: string | null;
    status: string;
    order: number;
    productId: string;
    productName: string;
  }> = [];

  for (const product of products) {
    const items = await getRoadmapItems(product.id).catch(() => []);
    for (const item of items) {
      allItems.push({ ...item, productName: product.name });
    }
  }

  const byStatus = (status: RoadmapStatus) => allItems.filter((i) => i.status === status);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Strategic Roadmap</h1>
          <p className="text-[#a1a1aa] text-sm mt-1 ws-label">{allItems.length} items across {products.length} products</p>
        </div>
        <Link href="/dashboard/workspace/products/new" className="flex items-center gap-2 bg-[#1c1b1d] border border-[#27272a] text-[#e5e1e4] px-4 py-2 rounded text-sm font-mono tracking-wider hover:bg-[#2a2a2c] hover:border-[#444748] transition-colors">
          <Plus className="h-4 w-4" /> Add Milestone
        </Link>
      </div>

      {allItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Map className="h-8 w-8 text-[#a1a1aa] mb-3 opacity-50" />
          <p className="text-[#a1a1aa] text-sm">No roadmap items yet.</p>
          <p className="text-[#444748] text-xs ws-label mt-1">Open a product and add roadmap items from the product page.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COLUMNS.map(({ status, label, color }) => {
            const items = byStatus(status);
            return (
              <div key={status} className="flex flex-col gap-3 min-w-[280px]">
                {/* Column header */}
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-[#e5e1e4] text-sm ws-label font-semibold">{label}</span>
                  <span className="text-[#a1a1aa] text-xs ws-label ml-1">({items.length})</span>
                </div>

                {/* Cards */}
                {items.length === 0 ? (
                  <div className="bg-[#1c1b1d] border border-dashed border-[#27272a] rounded-lg p-6 text-center">
                    <p className="text-[#444748] text-xs ws-label">No items</p>
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-[#1c1b1d] border border-[#27272a] rounded-lg p-4 hover:border-[#444748] transition-colors cursor-pointer"
                    >
                      <p className="text-[#e5e1e4] text-sm font-medium mb-1">{item.title}</p>
                      {item.description && (
                        <p className="text-[#a1a1aa] text-xs line-clamp-2 mb-3">{item.description}</p>
                      )}
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                        <span className="text-[#a1a1aa] text-xs ws-label">{item.productName}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

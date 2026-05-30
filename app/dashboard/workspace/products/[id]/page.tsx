import { getCurrentUser } from "@/lib/auth/utils";
import { redirect, notFound } from "next/navigation";
import { getWorkspaceProductById } from "@/lib/db/queries/workspace/products";
import { StatusBadge } from "@/components/workspace/status-badge";
import { RoadmapBoard } from "@/components/workspace/roadmap-board";
import { TaskList } from "@/components/workspace/task-list";
import { DocEditor } from "@/components/workspace/doc-editor";
import { ProductTabs } from "@/components/workspace/product-tabs";
import Link from "next/link";
import { Pencil, Globe, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const product = await getWorkspaceProductById(id, user.id);
  if (!product) notFound();

  const overview = (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Left: Roadmap board */}
      <div className="lg:col-span-3">
        <RoadmapBoard productId={id} items={product.roadmapItems ?? []} />
      </div>

      {/* Right: Properties */}
      <div className="space-y-4">
        <div className="bg-[#1c1b1d] border border-[#27272a] rounded-lg p-4 space-y-4">
          <h3 className="text-[#a1a1aa] text-xs ws-label uppercase tracking-wider">Properties</h3>
          <div className="space-y-3">
            <div>
              <p className="text-[#a1a1aa] text-xs ws-label mb-1">Status</p>
              <StatusBadge status={product.status} />
            </div>
            <div>
              <p className="text-[#a1a1aa] text-xs ws-label mb-1">Phase</p>
              <StatusBadge status={(product as any).roadmapPhase ?? "DISCOVERY"} />
            </div>
            {(product as any).websiteUrl && (
              <div>
                <p className="text-[#a1a1aa] text-xs ws-label mb-1">Website</p>
                <a href={(product as any).websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-[#6366f1] hover:text-[#818cf8] transition-colors">
                  <Globe className="h-3.5 w-3.5" />
                  <span className="truncate text-xs">Visit</span>
                </a>
              </div>
            )}
            <div>
              <p className="text-[#a1a1aa] text-xs ws-label mb-1">Stats</p>
              <div className="space-y-1 text-xs text-[#a1a1aa] ws-label">
                <p>{(product as any)._count?.tasks ?? 0} tasks</p>
                <p>{(product as any)._count?.docs ?? 0} docs</p>
                <p>{(product as any)._count?.roadmapItems ?? 0} roadmap items</p>
              </div>
            </div>
          </div>
        </div>

        {product.description && (
          <div className="bg-[#1c1b1d] border border-[#27272a] rounded-lg p-4">
            <h3 className="text-[#a1a1aa] text-xs ws-label uppercase tracking-wider mb-2">Description</h3>
            <p className="text-sm text-[#e5e1e4] leading-relaxed">{product.description}</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-4">
          <Link href="/dashboard/workspace/products" className="mt-1 text-[#a1a1aa] hover:text-[#e5e1e4] transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-white">{product.name}</h1>
              <StatusBadge status={product.status} />
            </div>
            {(product as any).tagline && (
              <p className="text-sm text-[#a1a1aa] ws-label">{(product as any).tagline}</p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/workspace/products/${id}/edit`} className={cn(buttonVariants({ variant: "outline", size: "sm" }), "border-[#27272a] text-[#a1a1aa] hover:text-[#e5e1e4] hover:border-[#444748] bg-transparent")}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Link>
        </div>
      </div>

      <ProductTabs
        overview={overview}
        roadmap={<RoadmapBoard productId={id} items={product.roadmapItems ?? []} />}
        tasks={<TaskList productId={id} tasks={product.tasks ?? []} />}
        docs={<DocEditor productId={id} docs={product.docs ?? []} />}
      />
    </div>
  );
}

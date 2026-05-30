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
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-xs font-medium text-[var(--on-surface-variant)] uppercase tracking-wider mb-1">Status</h3>
          <StatusBadge status={product.status} />
        </div>
        <div>
          <h3 className="text-xs font-medium text-[var(--on-surface-variant)] uppercase tracking-wider mb-1">Phase</h3>
          <StatusBadge status={product.roadmapPhase ?? "DISCOVERY"} />
        </div>
        {product.websiteUrl && (
          <div>
            <h3 className="text-xs font-medium text-[var(--on-surface-variant)] uppercase tracking-wider mb-1">Website</h3>
            <a
              href={product.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-[var(--primary)] hover:underline"
            >
              <Globe className="h-3.5 w-3.5" />
              {product.websiteUrl}
            </a>
          </div>
        )}
        <div>
          <h3 className="text-xs font-medium text-[var(--on-surface-variant)] uppercase tracking-wider mb-1">Stats</h3>
          <div className="flex gap-4 text-sm text-[var(--on-surface-variant)]">
            <span>{(product as any)._count?.tasks ?? 0} tasks</span>
            <span>{(product as any)._count?.docs ?? 0} docs</span>
            <span>{(product as any)._count?.roadmapItems ?? 0} roadmap items</span>
          </div>
        </div>
      </div>
      {product.description && (
        <div>
          <h3 className="text-xs font-medium text-[var(--on-surface-variant)] uppercase tracking-wider mb-2">Description</h3>
          <p className="text-sm text-[var(--on-surface)] leading-relaxed">{product.description}</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-start gap-4">
          <Link
            href="/dashboard/workspace/products"
            className="mt-1 text-[var(--on-surface-variant)] hover:text-[var(--on-surface)] transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-[var(--on-surface)]">{product.name}</h1>
              <StatusBadge status={product.status} />
            </div>
            {product.tagline && (
              <p className="text-sm text-[var(--on-surface-variant)]">{product.tagline}</p>
            )}
          </div>
        </div>
        <Link href={`/dashboard/workspace/products/${id}/edit`} className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </Link>
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

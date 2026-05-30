import { getCurrentUser } from "@/lib/auth/utils";
import { redirect, notFound } from "next/navigation";
import { getWorkspaceProductById } from "@/lib/db/queries/workspace/products";
import { ProductForm } from "@/components/workspace/product-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const product = await getWorkspaceProductById(id, user.id);
  if (!product) notFound();

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href={`/dashboard/workspace/products/${id}`}
          className="text-[var(--on-surface-variant)] hover:text-[var(--on-surface)] transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-[var(--on-surface)]">Edit Product</h1>
      </div>
      <ProductForm
        mode="edit"
        productId={id}
        defaultValues={{
          name: product.name,
          tagline: product.tagline ?? undefined,
          description: product.description ?? undefined,
          websiteUrl: product.websiteUrl ?? undefined,
          status: product.status,
          roadmapPhase: product.roadmapPhase ?? undefined,
        }}
      />
    </div>
  );
}

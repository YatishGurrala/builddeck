import { getCurrentUser } from "@/lib/auth/utils";
import { redirect } from "next/navigation";
import { ProductForm } from "@/components/workspace/product-form";

export default async function NewProductPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-[var(--on-surface)] mb-6">New Product</h1>
      <ProductForm mode="create" />
    </div>
  );
}

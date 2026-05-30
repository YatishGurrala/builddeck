import { getCurrentUser } from "@/lib/auth/utils";
import { redirect } from "next/navigation";
import { ProductForm } from "@/components/workspace/product-form";

export default async function NewProductPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-2">New Product</h1>
      <p className="text-[#a1a1aa] text-sm mb-6 ws-label">Add a new product to track its progress.</p>
      <div className="bg-[#1c1b1d] border border-[#27272a] rounded-lg p-6">
        <ProductForm mode="create" />
      </div>
    </div>
  );
}

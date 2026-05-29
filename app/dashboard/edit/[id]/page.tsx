import { notFound, redirect } from "next/navigation";
import { ProductForm } from "@/components/forms/product-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth/utils";
import { getProductById, toProduct } from "@/lib/buildstack/queries/products";
import { getAllCategories, toCategory } from "@/lib/buildstack/queries/categories";
import type { Product } from "@/types";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/login");
  }

  const productRecord = await getProductById(id);

  if (!productRecord || productRecord.data.userId !== user.id) {
    notFound();
  }

  const product = toProduct(productRecord);
  const categoryRecords = await getAllCategories();
  const categories = categoryRecords.map(toCategory);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Edit Product</CardTitle>
            <CardDescription>
              Update your product details. Changes will reset your submission to
              pending review.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProductForm categories={categories || []} product={product} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

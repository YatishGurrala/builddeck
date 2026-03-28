import { notFound, redirect } from "next/navigation";
import { ProductForm } from "@/components/forms/product-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth/utils";
import { getProductById } from "@/lib/db/queries/products";
import { getAllCategories } from "@/lib/db/queries/categories";
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

  const product = await getProductById(id);

  if (!product || product.userId !== user.id) {
    notFound();
  }

  const categories = await getAllCategories();

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
            <ProductForm categories={categories || []} product={product as unknown as Product} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

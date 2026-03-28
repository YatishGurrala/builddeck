import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/forms/product-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("user_id", user!.id)
    .single();

  if (!product) {
    notFound();
  }

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

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

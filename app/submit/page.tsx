import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/forms/product-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function SubmitPage() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Submit Your Product</CardTitle>
            <CardDescription>
              Share your product with thousands of makers and early adopters.
              Your submission will be reviewed before publishing.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProductForm categories={categories || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

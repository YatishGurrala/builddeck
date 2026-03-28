import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ProductGrid } from "@/components/product/product-grid";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProductsPageProps {
  searchParams: Promise<{ category?: string; featured?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const supabase = await createClient();

  // Fetch categories for filters
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  // Build products query
  let query = supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (params.category) {
    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", params.category)
      .single();

    if (category) {
      query = query.eq("category_id", category.id);
    }
  }

  if (params.featured === "true") {
    query = query.eq("featured", true);
  }

  const { data: products } = await query;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">All Products</h1>
        <p className="text-zinc-400">
          Discover the latest products from indie makers and startups.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          <Link href="/products">
            <Badge
              variant={!params.category && !params.featured ? "default" : "outline"}
              className="cursor-pointer hover:bg-violet-600/30"
            >
              All
            </Badge>
          </Link>
          <Link href="/products?featured=true">
            <Badge
              variant={params.featured === "true" ? "default" : "outline"}
              className="cursor-pointer hover:bg-violet-600/30"
            >
              Featured
            </Badge>
          </Link>
          {categories?.map((category) => (
            <Link key={category.id} href={`/products?category=${category.slug}`}>
              <Badge
                variant={params.category === category.slug ? "default" : "outline"}
                className="cursor-pointer hover:bg-violet-600/30"
              >
                {category.name}
              </Badge>
            </Link>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <ProductGrid
        products={products || []}
        emptyMessage="No products found in this category."
      />
    </div>
  );
}

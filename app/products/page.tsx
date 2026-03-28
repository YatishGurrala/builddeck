import Link from "next/link";
import { ProductGrid } from "@/components/product/product-grid";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAllCategories, getCategoryBySlug } from "@/lib/db/queries/categories";
import { getProducts, getFeaturedProducts } from "@/lib/db/queries/products";
import { Category, Product } from "@/types";

interface ProductsPageProps {
  searchParams: Promise<{ category?: string; featured?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;

  // Fetch categories for filters
  const categories = await getAllCategories();

  // Fetch products with filters
  let products;
  
  if (params.featured === "true") {
    products = await getFeaturedProducts();
  } else if (params.category) {
    const category = await getCategoryBySlug(params.category);
    if (category) {
      const result = await getProducts({ filters: { categoryId: category.id, status: "APPROVED" } });
      products = result.data;
    } else {
      const result = await getProducts({ filters: { status: "APPROVED" } });
      products = result.data;
    }
  } else {
    const result = await getProducts({ filters: { status: "APPROVED" } });
    products = result.data;
  }

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
          {categories?.map((category: Category) => (
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
        products={(products || []) as Product[]}
        emptyMessage="No products found in this category."
      />
    </div>
  );
}

import Link from "next/link";
import { getCategoriesWithProductCount } from "@/lib/buildstack/queries/categories";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export default async function CategoriesPage() {
  // Fetch categories with product counts
  const categoriesWithCounts = await getCategoriesWithProductCount();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">Categories</h1>
        <p className="text-zinc-400">
          Browse products by category to find what you&apos;re looking for.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoriesWithCounts.map((category: { id: string; slug: string; name: string; productCount: number }) => (
          <Link key={category.id} href={`/products?category=${category.slug}`}>
            <Card className="group h-full hover:border-zinc-700 transition-all hover:shadow-lg hover:shadow-violet-500/5">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-violet-400 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-zinc-500 mt-1">
                      {category.productCount} product
                      {category.productCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-zinc-600 group-hover:text-violet-400 transition-colors" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

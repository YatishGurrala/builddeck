import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";
import { ProductGrid } from "@/components/product/product-grid";
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
    <div className="pt-32 pb-24 px-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <section className="mb-16">
        <h1 className="text-5xl md:text-6xl font-headline font-extrabold tracking-tighter mb-4 text-white">
          Discover the <span className="text-[#0070f3]">Modern Stack.</span>
        </h1>
        <p className="text-[#c1c6d7] text-lg max-w-2xl">
          Curated directory of high-performance tools and frameworks for the next generation of digital builders.
        </p>
      </section>

      {/* Search & Filter Controls */}
      <section className="mb-12 sticky top-24 z-40">
        <div className="glass-effect p-2 rounded-2xl flex flex-col md:flex-row gap-4 items-center shadow-xl border border-[#414754]/10">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b90a0] h-5 w-5" />
            <input 
              type="text"
              placeholder="Search frameworks, UI kits, APIs..."
              className="w-full bg-[#181c21] border-none rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-[#0070f3] transition-all text-[#e0e2ea] placeholder-[#8b90a0]"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto w-full md:w-2/3 pb-2 md:pb-0 scrollbar-hide">
            <Link href="/products">
              <button className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                !params.category && !params.featured 
                  ? "bg-[#0070f3] text-white" 
                  : "bg-[#1c2025] hover:bg-[#31353b] text-[#c1c6d7] border border-[#414754]/10"
              }`}>
                All Items
              </button>
            </Link>
            <Link href="/products?featured=true">
              <button className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                params.featured === "true" 
                  ? "bg-[#0070f3] text-white" 
                  : "bg-[#1c2025] hover:bg-[#31353b] text-[#c1c6d7] border border-[#414754]/10"
              }`}>
                Featured
              </button>
            </Link>
            {categories?.slice(0, 5).map((category: Category) => (
              <Link key={category.id} href={`/products?category=${category.slug}`}>
                <button className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  params.category === category.slug 
                    ? "bg-[#0070f3] text-white" 
                    : "bg-[#1c2025] hover:bg-[#31353b] text-[#c1c6d7] border border-[#414754]/10"
                }`}>
                  {category.name}
                </button>
              </Link>
            ))}
            <div className="h-10 w-px bg-[#414754]/20 mx-2 self-center" />
            <button className="bg-[#181c21] text-[#e0e2ea] px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 border border-[#414754]/20 hover:bg-[#262a30] transition-all">
              <SlidersHorizontal className="h-4 w-4" />
              More Filters
            </button>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <ProductGrid
        products={(products || []) as Product[]}
        emptyMessage="No products found in this category."
      />

      {/* Pagination */}
      <section className="mt-24 flex flex-col items-center gap-8">
        <button className="px-12 py-4 bg-[#1c2025] hover:bg-[#31353b] border border-[#414754]/20 rounded-full text-[#e0e2ea] font-bold transition-all flex items-center gap-3">
          Load more products
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div className="flex gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#0070f3] text-white font-bold">1</button>
          <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#1c2025] text-[#c1c6d7] font-bold transition-colors">2</button>
          <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#1c2025] text-[#c1c6d7] font-bold transition-colors">3</button>
          <span className="w-10 h-10 flex items-center justify-center text-[#8b90a0]">...</span>
          <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#1c2025] text-[#c1c6d7] font-bold transition-colors">12</button>
        </div>
      </section>
    </div>
  );
}

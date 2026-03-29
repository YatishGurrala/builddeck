import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.slug}`}>
      <div className="group bg-[#1c2025] rounded-2xl p-6 border border-transparent hover:border-white/5 hover:bg-[#36393f] transition-all duration-300 hover:-translate-y-2 h-full flex flex-col">
        <div className="flex justify-between items-start mb-6">
          <div className="w-16 h-16 bg-[#31353b] rounded-2xl flex items-center justify-center border border-white/5 overflow-hidden shadow-inner">
            {product.logoUrl ? (
              <Image
                src={product.logoUrl}
                alt={product.name}
                width={40}
                height={40}
                className="object-contain"
              />
            ) : (
              <span className="text-2xl font-bold text-[#0070f3]">
                {product.name[0]}
              </span>
            )}
          </div>
          {product.category && (
            <span className="px-3 py-1 rounded-full bg-[#31353b] text-[10px] uppercase tracking-wider font-bold text-[#c1c6d7]">
              {product.category.name}
            </span>
          )}
        </div>
        
        <h3 className="text-xl font-headline font-bold text-white mb-2 group-hover:text-[#aec6ff] transition-colors">
          {product.name}
        </h3>
        <p className="text-[#c1c6d7] text-sm mb-6 leading-relaxed flex-grow line-clamp-2">
          {product.tagline}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
          {product.featured && (
            <span className="text-[10px] uppercase tracking-wider font-bold text-[#3ce36a]">
              Featured
            </span>
          )}
          <span className="flex items-center gap-1 text-[#0070f3] font-bold text-sm group-hover:gap-2 transition-all ml-auto">
            Visit Site <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

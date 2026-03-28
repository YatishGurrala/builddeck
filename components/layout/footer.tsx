import Link from "next/link";
import { Rocket } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Rocket className="h-6 w-6 text-violet-500" />
              <span className="text-xl font-bold text-white">Builddeck</span>
            </Link>
            <p className="text-sm text-zinc-400">
              Discover the best new products from indie makers.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Explore</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/products"
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Categories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">For Makers</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/submit"
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Submit Product
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-800">
          <p className="text-center text-sm text-zinc-500">
            &copy; {new Date().getFullYear()} Builddeck. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

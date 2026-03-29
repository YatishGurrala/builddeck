import Link from "next/link";
import { Rocket } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full py-12 bg-[#0a0e13] border-t border-white/5">
      <div className="flex flex-col md:flex-row justify-between items-center px-8 md:px-12 max-w-7xl mx-auto gap-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-[#0070f3]" />
            <span className="text-white font-bold tracking-normal text-lg font-headline">
              Builddeck
            </span>
          </Link>
          <div className="flex gap-6 text-xs uppercase tracking-widest text-gray-500">
            <Link
              href="/about"
              className="hover:text-[#0070F3] transition-colors"
            >
              About
            </Link>
            <Link
              href="/submit"
              className="hover:text-[#0070F3] transition-colors"
            >
              Submit
            </Link>
            <Link
              href="/privacy"
              className="hover:text-[#0070F3] transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/contact"
              className="hover:text-[#0070F3] transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
        <div className="text-gray-600 text-sm">
          &copy; {new Date().getFullYear()} Builddeck
        </div>
      </div>
    </footer>
  );
}

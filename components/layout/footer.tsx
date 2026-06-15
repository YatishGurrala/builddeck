import Link from "next/link";
import { Rocket } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-[var(--surface-container-lowest)] py-12 transition-colors duration-300">
      <div className="flex flex-col md:flex-row justify-between items-center px-8 md:px-12 max-w-7xl mx-auto gap-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-[#0070f3]" />
            <span className="font-headline text-lg font-bold tracking-normal text-[var(--foreground)]">
              Builddeck
            </span>
          </Link>
          <div className="flex gap-6 text-xs uppercase tracking-widest text-[var(--on-surface-variant)]">
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
        <div className="text-sm text-[var(--on-surface-variant)]">
          &copy; {new Date().getFullYear()} Builddeck
        </div>
      </div>
    </footer>
  );
}

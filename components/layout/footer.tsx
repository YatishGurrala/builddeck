import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="w-full py-12 bg-[var(--surface-container-lowest)] border-t border-[var(--outline-variant)]">
      <div className="flex flex-col md:flex-row justify-between items-center px-8 md:px-12 max-w-7xl mx-auto gap-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/brand/builddeck-system-mark.svg"
              alt="Builddeck"
              width={20}
              height={20}
              className="h-5 w-5"
            />
            <span className="text-[var(--on-surface)] font-bold tracking-normal text-lg font-headline">
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
            <Link href="/#waitlist-email" className="hover:text-[#0070F3] transition-colors">
              Waitlist
            </Link>
            <Link
              href="https://x.com/builddeckio"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#0070F3] transition-colors"
            >
              X
            </Link>
          </div>
        </div>
        <div className="text-[var(--on-surface-variant)] text-sm">
          &copy; {new Date().getFullYear()} Builddeck
        </div>
      </div>
    </footer>
  );
}

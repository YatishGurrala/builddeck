import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/auth/config";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "./logout-button";
import { ThemeToggle } from "./theme-toggle";

export async function Header() {
  const session = await auth();
  const user = session?.user;
  const isAdmin = user?.role === "ADMIN";

  return (
    <header className="fixed top-0 w-full z-50 bg-[color:color-mix(in_srgb,var(--surface-container-lowest)_85%,transparent)] backdrop-blur-xl shadow-2xl shadow-black/20">
      <div className="flex justify-between items-center px-8 h-20 w-full max-w-full">
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/brand/builddeck-system-mark.svg"
              alt="Builddeck"
              width={24}
              height={24}
              className="h-6 w-6"
            />
            <span className="text-2xl font-black text-[var(--on-surface)] tracking-tighter font-headline">
              Builddeck
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/about"
            className="hidden md:inline text-[var(--on-surface-variant)] hover:text-[var(--on-surface)] transition-colors hover:border-b-2 hover:border-[#0070F3] pb-1 font-headline font-bold tracking-tight"
          >
            About
          </Link>
          <ThemeToggle />
          <Link href="/#waitlist-email">
            <Button className="bg-[#0070f3] text-white px-6 py-2.5 rounded-full font-bold hover:shadow-[0_0_20px_rgba(0,112,243,0.3)] transition-all active:scale-95 duration-200">
              Join Waitlist
            </Button>
          </Link>
          {user ? (
            <>
              {isAdmin && (
                <Link href="/dashboard/waitlist">
                  <Button variant="outline" size="sm" className="border-[var(--outline)] text-[var(--on-surface-variant)] hover:text-[var(--on-surface)] hover:border-[#0070f3]">
                    Admin Leads
                  </Button>
                </Link>
              )}
              <LogoutButton />
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}

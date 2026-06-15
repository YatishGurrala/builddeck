import Link from "next/link";
import { auth } from "@/lib/auth/config";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "./logout-button";
import { Rocket } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export async function Header() {
  const session = await auth();
  const user = session?.user;
  const isAdmin = user?.role === "ADMIN";

  return (
    <header className="fixed top-0 w-full z-50 bg-[color:var(--surface)]/85 backdrop-blur-xl shadow-2xl shadow-black/20 transition-colors duration-300">
      <div className="flex justify-between items-center px-8 h-20 w-full max-w-full">
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <Rocket className="h-6 w-6 text-[#0070f3]" />
            <span className="text-2xl font-black text-[var(--foreground)] tracking-tighter font-headline">
              Builddeck
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          {user ? (
            <>
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-medium text-[color:var(--on-surface-variant)] hover:text-[color:var(--on-surface)]"
                >
                  Dashboard
                </Button>
              </Link>
              {isAdmin && (
                <Link href="/admin">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[color:var(--outline-variant)] text-[color:var(--on-surface-variant)] hover:border-[#0070f3] hover:text-[color:var(--on-surface)]"
                  >
                    Admin
                  </Button>
                </Link>
              )}
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-medium text-[color:var(--on-surface-variant)] hover:text-[color:var(--on-surface)]"
                >
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-[#0070f3] text-white px-6 py-2.5 rounded-full font-bold hover:shadow-[0_0_20px_rgba(0,112,243,0.3)] transition-all active:scale-95 duration-200">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

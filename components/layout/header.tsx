import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "./logout-button";
import { Rocket } from "lucide-react";

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    isAdmin = profile?.role === "admin";
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Rocket className="h-6 w-6 text-violet-500" />
            <span className="text-xl font-bold text-white">Builddeck</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/products"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Products
            </Link>
            <Link
              href="/categories"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Categories
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link href="/submit">
                <Button size="sm">Submit Product</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
              {isAdmin && (
                <Link href="/admin">
                  <Button variant="outline" size="sm">
                    Admin
                  </Button>
                </Link>
              )}
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

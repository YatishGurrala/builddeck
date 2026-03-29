import Link from "next/link";
import { auth } from "@/lib/auth/config";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "./logout-button";
import { Rocket } from "lucide-react";

export async function Header() {
  const session = await auth();
  const user = session?.user;
  const isAdmin = user?.role === "ADMIN";

  return (
    <header className="fixed top-0 w-full z-50 bg-[#101419]/80 backdrop-blur-xl shadow-2xl shadow-black/40">
      <div className="flex justify-between items-center px-8 h-20 w-full max-w-full">
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-2">
            <Rocket className="h-6 w-6 text-[#0070f3]" />
            <span className="text-2xl font-black text-white tracking-tighter font-headline">
              Builddeck
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 font-headline font-bold tracking-tight">
            <Link
              href="/products"
              className="text-gray-400 hover:text-white transition-colors hover:border-b-2 hover:border-[#0070F3] pb-1"
            >
              Explore
            </Link>
            <Link
              href="/submit"
              className="text-gray-400 hover:text-white transition-colors hover:border-b-2 hover:border-[#0070F3] pb-1"
            >
              Submit
            </Link>
            <Link
              href="/categories"
              className="text-gray-400 hover:text-white transition-colors hover:border-b-2 hover:border-[#0070F3] pb-1"
            >
              Categories
            </Link>
            <Link
              href="/blog"
              className="text-gray-400 hover:text-white transition-colors hover:border-b-2 hover:border-[#0070F3] pb-1"
            >
              Blog
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link href="/submit">
                <Button className="bg-[#0070f3] text-white px-6 py-2.5 rounded-full font-bold hover:shadow-[0_0_20px_rgba(0,112,243,0.3)] transition-all active:scale-95 duration-200">
                  Submit Product
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white font-medium">
                  Dashboard
                </Button>
              </Link>
              {isAdmin && (
                <Link href="/admin">
                  <Button variant="outline" size="sm" className="border-[#414754] text-gray-400 hover:text-white hover:border-[#0070f3]">
                    Admin
                  </Button>
                </Link>
              )}
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white font-medium">
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

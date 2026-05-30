import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

// Routes that require authentication (workspace bypassed for local preview)
const protectedRoutes = ["/dashboard", "/submit"];
const previewBypassRoutes = ["/dashboard/workspace"];
// Routes that require admin role
const adminRoutes = ["/admin"];
// Routes only for unauthenticated users
const authRoutes = ["/login", "/signup"];
// Routes intentionally hidden for the first MVP release
const mvpLockedRoutes = [
  "/blog",
  "/products",
  "/categories",
  "/submit",
  "/contact",
  "/privacy",
  "/newsletter",
];

export default async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isLoggedIn = !!token;
  const isAdmin = token?.role === "ADMIN";

  // Hide non-MVP routes from all users during first release
  if (mvpLockedRoutes.some((route) => nextUrl.pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  // Redirect logged-in users away from auth pages
  if (isLoggedIn && authRoutes.includes(nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  // Allow workspace preview without login
  if (previewBypassRoutes.some((route) => nextUrl.pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Protect dashboard and submit routes
  if (!isLoggedIn && protectedRoutes.some((route) => nextUrl.pathname.startsWith(route))) {
    const loginUrl = new URL("/login", nextUrl);
    loginUrl.searchParams.set("redirect", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Protect admin routes
  if (adminRoutes.some((route) => nextUrl.pathname.startsWith(route))) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { RESERVED_FOUNDER_USERNAMES } from "@/lib/founder-profile/reserved-usernames";

// Routes that require authentication
const protectedRoutes = ["/dashboard", "/submit"];
// Routes that require admin role
const adminRoutes = ["/admin"];
// Routes only for unauthenticated users
const authRoutes = ["/login", "/signup"];
const AUTH_TEMP_DISABLED = process.env.NODE_ENV !== "production";
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

const APP_TOP_LEVEL_ROUTES = new Set([
  "",
  "about",
  "admin",
  "api",
  "auth",
  "blog",
  "categories",
  "contact",
  "dashboard",
  "login",
  "privacy",
  "products",
  "signup",
  "submit",
]);

function isPotentialFounderPublicPath(pathname: string) {
  const normalized = pathname.toLowerCase();
  if (normalized === "/") return false;

  const segments = normalized.replace(/^\/+/, "").split("/").filter(Boolean);
  if (segments.length !== 1) return false;

  const slug = segments[0];
  if (slug.includes(".")) return false;
  if (APP_TOP_LEVEL_ROUTES.has(slug)) return false;
  if (RESERVED_FOUNDER_USERNAMES.has(slug)) return false;

  return true;
}

function getHostname(req: NextRequest) {
  return (req.headers.get("host") || "").toLowerCase().split(":")[0];
}

export default async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const hostname = getHostname(req);
  const founderHost = (process.env.FOUNDER_PAGES_HOST || "pages.builddeck.io").toLowerCase();
  const appBase = process.env.NEXT_PUBLIC_APP_URL || "https://builddeck.io";
  const isFounderHost = hostname === founderHost;

  if (isFounderHost) {
    const trimmedPath = nextUrl.pathname.replace(/^\/+/, "");
    const segments = trimmedPath ? trimmedPath.split("/") : [];

    // On pages subdomain, allow only `/username` founder profiles.
    if (segments.length !== 1) {
      return NextResponse.redirect(new URL(nextUrl.pathname + nextUrl.search, appBase));
    }

    const username = segments[0].toLowerCase();
    if (RESERVED_FOUNDER_USERNAMES.has(username)) {
      return NextResponse.redirect(new URL(nextUrl.pathname + nextUrl.search, appBase));
    }

    return NextResponse.next();
  }

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

  // Protect dashboard and submit routes
  if (!isLoggedIn && !AUTH_TEMP_DISABLED && protectedRoutes.some((route) => nextUrl.pathname.startsWith(route))) {
    const loginUrl = new URL("/login", nextUrl);
    loginUrl.searchParams.set("redirect", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Protect admin routes
  if (adminRoutes.some((route) => nextUrl.pathname.startsWith(route))) {
    if (AUTH_TEMP_DISABLED) {
      return NextResponse.next();
    }
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
  }

  const requestHeaders = new Headers(req.headers);
  if (isPotentialFounderPublicPath(nextUrl.pathname)) {
    requestHeaders.set("x-builddeck-public-profile", "1");
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

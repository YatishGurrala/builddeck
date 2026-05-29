import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "bs_session";

// Routes that require authentication
const protectedRoutes = ["/dashboard", "/submit"];
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

function decodeSessionToken(token: string) {
  try {
    const [, payload] = token.split(".");
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export default async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const rawToken = req.cookies.get(SESSION_COOKIE)?.value;
  const payload = rawToken ? decodeSessionToken(rawToken) : null;
  const isLoggedIn = !!(payload && (payload.exp as number) > Date.now() / 1000);
  const isAdmin = (payload?.metadata as Record<string, unknown>)?.role === "ADMIN";

  // Hide non-MVP routes from all users during first release
  if (mvpLockedRoutes.some((route) => nextUrl.pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  // Redirect logged-in users away from auth pages
  if (isLoggedIn && authRoutes.includes(nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
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

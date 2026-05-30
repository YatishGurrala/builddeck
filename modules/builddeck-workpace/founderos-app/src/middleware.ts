import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);
  const { pathname } = request.nextUrl;

  const isProtectedRoute = pathname.startsWith('/dashboard') ||
    pathname.startsWith('/products') ||
    pathname.startsWith('/roadmap') ||
    pathname.startsWith('/tasks') ||
    pathname.startsWith('/docs') ||
    pathname.startsWith('/team') ||
    pathname.startsWith('/settings');

  if (!isProtectedRoute) {
    return response;
  }

  const hasSession = request.cookies.getAll().some((cookie) => cookie.name.includes('sb-'));

  if (!hasSession) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('stayzo_token')?.value;

  const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard');

  // If trying to access dashboard without a token, redirect to login
  if (isDashboardRoute && !token) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    // Set headers to prevent caching of the redirect response
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  }

  const response = NextResponse.next();

  // Set headers to prevent caching for dashboard routes
  // This ensures the back/forward buttons will re-evaluate authentication
  if (isDashboardRoute) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }

  return response;
}

export const config = {
  matcher: ['/dashboard/:path*'],
};

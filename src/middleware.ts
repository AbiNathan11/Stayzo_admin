import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('stayzo_token')?.value;
  const { pathname } = request.nextUrl;

  // Protect all routes under /dashboard/admin
  if (pathname.startsWith('/dashboard/admin')) {
    if (!token) {
      // Redirect unauthenticated requests to the login page immediately
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

// Only match routes under the admin dashboard
export const config = {
  matcher: ['/dashboard/admin/:path*'],
};

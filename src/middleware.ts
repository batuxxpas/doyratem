import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Protect /admin routes
  if (path.startsWith('/admin')) {
    // Allow access to login page
    if (path === '/admin-login') {
      return NextResponse.next();
    }

    // Check for auth cookie
    const authCookie = request.cookies.get('admin_auth');
    if (!authCookie || authCookie.value !== 'authenticated') {
      // Redirect to login if not authenticated
      const url = new URL('/admin-login', request.url);
      return NextResponse.redirect(url);
    }
  }

  // Protect API mutation routes (POST, PUT, DELETE) except /api/contact and /api/auth
  if (path.startsWith('/api/') && !path.startsWith('/api/contact') && !path.startsWith('/api/auth')) {
    if (request.method !== 'GET') {
      const authCookie = request.cookies.get('admin_auth');
      if (!authCookie || authCookie.value !== 'authenticated') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
};

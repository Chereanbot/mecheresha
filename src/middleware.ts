import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAuth } from '@/lib/jwt';

export async function middleware(request: NextRequest) {
  console.log('Middleware executing for path:', request.nextUrl.pathname);

  const token = request.cookies.get('token')?.value;
  console.log('Token exists:', !!token);

  // Handle admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!token) {
      console.log('No token found, redirecting to login');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const decoded = await verifyAuth(token);
      console.log('Token decoded:', decoded);

      // Check for admin access
      if (decoded.role === 'SUPER_ADMIN' || decoded.isAdmin === true) {
        console.log('Admin access granted');
        return NextResponse.next();
      }

      console.log('Not authorized for admin access');
      return NextResponse.redirect(new URL('/login', request.url));
    } catch (error) {
      console.error('Token verification failed:', error);
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('token');
      return response;
    }
  }

  // Handle client routes
  if (request.nextUrl.pathname.startsWith('/client')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const decoded = await verifyAuth(token);
      
      // Allow only client access
      if (decoded.role === 'CLIENT' || decoded.specialAccess === true) {
        return NextResponse.next();
      }

      return NextResponse.redirect(new URL('/login', request.url));
    } catch (error) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/client/:path*']
}; 
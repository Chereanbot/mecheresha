import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAuth } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  // Check if it's a coordinator route
  if (request.nextUrl.pathname.startsWith('/coordinator')) {
    try {
      const token = request.cookies.get('auth-token')?.value;
      
      if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      const authResult = await verifyAuth({ 
        headers: { authorization: `Bearer ${token}` } 
      } as Request);

      if (!authResult.isAuthenticated || authResult.user?.role !== 'COORDINATOR') {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      return NextResponse.next();
    } catch (error) {
      console.error('Middleware error:', error);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/coordinator/:path*']
}; 
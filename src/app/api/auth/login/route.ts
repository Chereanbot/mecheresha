import { NextResponse } from 'next/server';
import { signToken } from '@/lib/jwt';

export async function POST(request: Request) {
  try {
    if (!request.body) {
      return NextResponse.json(
        { success: false, message: 'No request body' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { identifier, password } = body;

    console.log('Login attempt:', { identifier, password });

    // Admin credentials check
    if (identifier === 'cherean' && password === 'cherean') {
      console.log('Admin login detected');
      
      const token = await signToken({ 
        username: identifier,
        role: 'SUPER_ADMIN',
        isAdmin: true,
        specialAccess: true,
        timestamp: Date.now()
      });

      const response = NextResponse.json({
        success: true,
        message: 'Welcome back, Administrator!',
        token,
        redirectUrl: '/admin/dashboard'
      });

      // Set cookie
      response.cookies.set({
        name: 'token',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 86400
      });

      return response;
    }

    // If not admin, return error
    return NextResponse.json(
      { success: false, message: 'Invalid credentials' },
      { status: 401 }
    );

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred during login' },
      { status: 500 }
    );
  }
} 
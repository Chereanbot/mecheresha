import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { sign } from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    // Log the incoming request
    console.log('Login attempt received');
    
    const body = await request.json();
    console.log('Request body:', { email: body.email, hasPassword: !!body.password });

    const { email, password } = body;

    if (!email || !password) {
      console.log('Missing email or password');
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Special case for admin login
    if (email === 'cherean' && password === 'cherean') {
      console.log('Admin login attempt');
      const adminPayload = { 
        userId: 'admin',
        role: 'ADMIN' 
      };

      const token = sign(
        adminPayload,
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '7d' }
      );

      console.log('Admin token generated');

      const response = NextResponse.json({
        success: true,
        message: 'Login successful',
        user: {
          id: 'admin',
          email: 'cherean',
          fullName: 'Admin User',
          role: 'ADMIN'
        },
        token,
        redirectUrl: '/admin/dashboard'
      });

      response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60,
        path: '/'
      });

      return response;
    }

    // Regular user login flow
    console.log('Looking up user in database');
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        coordinatorProfile: {
          include: {
            office: {
              select: {
                id: true,
                name: true,
                location: true
              }
            }
          }
        }
      }
    });

    if (!user) {
      console.log('User not found');
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    console.log('Verifying password');
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      console.log('Invalid password');
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    console.log('Creating token payload');
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      officeId: user.coordinatorProfile?.officeId || null
    };

    console.log('Token payload:', payload);

    const token = sign(
      payload,
      process.env.NEXTAUTH_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    const redirectUrl = user.role === 'ADMIN' 
      ? '/admin/dashboard'
      : user.role === 'COORDINATOR'
        ? '/coordinator/dashboard'
        : '/client/dashboard';

    console.log('Creating response');
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        officeId: user.coordinatorProfile?.officeId || null,
        officeName: user.coordinatorProfile?.office?.name || null,
        officeLocation: user.coordinatorProfile?.office?.location || null
      },
      token,
      redirectUrl
    });

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60
    });

    response.cookies.set('next-auth.session-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60
    });

    console.log('Login successful');
    return response;

  } catch (error) {
    // Detailed error logging
    console.error('Login error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });

    return NextResponse.json(
      { 
        error: 'Login failed',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
} 
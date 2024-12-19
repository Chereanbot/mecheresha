import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';
import { verify } from 'jsonwebtoken';

export async function GET(request: Request) {
  try {
    // Get auth token from header
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No auth token' },
        { status: 401 }
      );
    }

    // Verify token
    try {
      verify(token, process.env.JWT_SECRET!);
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const roleParam = searchParams.get('role');
    
    // Parse role parameter
    let where = {};
    if (roleParam && roleParam !== 'all') {
      where = { role: roleParam };
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        status: true,
        emailVerified: true,
        phoneVerified: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      data: users
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// Create new user
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const user = await prisma.user.create({
      data: {
        email: body.email,
        phone: body.phone,
        password: body.password, // Should be hashed before saving
        fullName: body.fullName,
        username: body.username,
        role: body.role,
        emailVerified: false,
        phoneVerified: false,
        isAdmin: body.role === 'SUPER_ADMIN' || body.role === 'ADMIN'
      },
      select: {
        id: true,
        email: true,
        phone: true,
        fullName: true,
        username: true,
        role: true,
        emailVerified: true,
        phoneVerified: true,
        isAdmin: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json({
      success: true,
      user,
      message: 'User created successfully'
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create user',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
} 
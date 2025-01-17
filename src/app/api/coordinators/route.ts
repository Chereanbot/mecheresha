import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CoordinatorStatus, CoordinatorType } from '@prisma/client';
import { verifyAuth } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import { signJWT } from '@/lib/jwt';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as CoordinatorStatus;
    const type = searchParams.get('type') as CoordinatorType;
    const officeId = searchParams.get('officeId');
    const searchTerm = searchParams.get('searchTerm');

    // Build where clause
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (type) {
      where.type = type;
    }

    if (officeId) {
      where.officeId = officeId;
    }

    if (searchTerm) {
      where.OR = [
        {
          user: {
            OR: [
              { fullName: { contains: searchTerm, mode: 'insensitive' } },
              { email: { contains: searchTerm, mode: 'insensitive' } },
              { phone: { contains: searchTerm, mode: 'insensitive' } }
            ]
          }
        }
      ];
    }

    const coordinators = await prisma.coordinator.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            phone: true,
            fullName: true,
            status: true,
            emailVerified: true,
            phoneVerified: true,
            createdAt: true,
            updatedAt: true
          }
        },
        office: {
          select: {
            id: true,
            name: true,
            location: true,
            type: true,
            status: true
          }
        },
        qualifications: {
          select: {
            id: true,
            type: true,
            title: true,
            institution: true,
            dateObtained: true,
            expiryDate: true,
            score: true
          }
        },
        projects: {
          select: {
            id: true,
            name: true,
            status: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      data: coordinators
    });

  } catch (error) {
    console.error('Error fetching coordinators:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch coordinators',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Verify admin authorization
    const authResult = await verifyAuth(request);
    if (!authResult.isAuthenticated || !authResult.user?.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Validate required fields
    if (!body || !body.email || !body.password || !body.fullName || !body.officeId) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Missing required fields' 
        },
        { status: 400 }
      );
    }

    const { 
      email, 
      password, 
      fullName, 
      officeId,
      phone,
      address,
      status = 'ACTIVE'
    } = body;

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Email already exists' 
        },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user and coordinator in a transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          fullName,
          userRole: 'COORDINATOR',
          status,
          phone,
          address
        }
      });

      // Create coordinator profile
      const coordinator = await prisma.coordinator.create({
        data: {
          userId: user.id,
          officeId,
          status
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              fullName: true,
              userRole: true,
              status: true
            }
          },
          office: {
            select: {
              id: true,
              name: true,
              location: true
            }
          }
        }
      });

      return coordinator;
    });

    // Generate JWT token
    const tokenPayload = {
      userId: result.user.id,
      email: result.user.email,
      role: result.user.userRole,
      coordinatorId: result.id,
      officeId: result.officeId
    };

    const token = await signJWT(tokenPayload);

    return NextResponse.json({
      success: true,
      message: 'Coordinator created successfully',
      data: {
        coordinator: result,
        token
      }
    });

  } catch (error) {
    console.error('Error creating coordinator:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create coordinator'
      },
      { status: 500 }
    );
  }
} 
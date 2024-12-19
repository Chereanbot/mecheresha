import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CoordinatorStatus, CoordinatorType } from '@prisma/client';

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
    const body = await request.json();

    // Create coordinator with associated user
    const coordinator = await prisma.coordinator.create({
      data: {
        type: body.type,
        officeId: body.officeId,
        startDate: new Date(body.startDate),
        endDate: body.endDate ? new Date(body.endDate) : null,
        specialties: body.specialties || [],
        status: CoordinatorStatus.PENDING,
        user: {
          create: {
            email: body.email,
            phone: body.phone,
            password: body.password, // Should be hashed before saving
            fullName: body.fullName,
            role: 'COORDINATOR',
            emailVerified: false,
            phoneVerified: false
          }
        },
        qualifications: {
          create: body.qualifications?.map((q: any) => ({
            type: q.type,
            title: q.title,
            institution: q.institution,
            dateObtained: new Date(q.dateObtained),
            expiryDate: q.expiryDate ? new Date(q.expiryDate) : null,
            score: q.score
          }))
        }
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            phone: true,
            role: true,
            status: true
          }
        },
        office: true,
        qualifications: true
      }
    });

    return NextResponse.json({
      success: true,
      data: coordinator,
      message: 'Coordinator created successfully'
    });

  } catch (error) {
    console.error('Error creating coordinator:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create coordinator',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
} 
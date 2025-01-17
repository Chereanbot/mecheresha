import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';
import { OfficeType, OfficeStatus } from '@prisma/client';

// GET - List all offices with filtering and pagination
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    const authResult = await verifyAuth(token || '');
    if (!authResult.isAuthenticated || !authResult.user) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') as OfficeType | null;
    const status = searchParams.get('status') as OfficeStatus | null;
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build where clause
    let where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
        { contactEmail: { contains: search, mode: 'insensitive' } },
        { contactPhone: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (type) {
      where.type = type;
    }

    if (status) {
      where.status = status;
    }

    // Get total count
    const total = await prisma.office.count({ where });

    // Get offices with relations
    const offices = await prisma.office.findMany({
      where,
      include: {
        lawyers: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                phone: true
              }
            }
          }
        },
        coordinators: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                phone: true
              }
            }
          }
        }
      },
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder
      }
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return NextResponse.json({
      success: true,
      data: {
        offices,
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage,
          hasPreviousPage
        }
      }
    });

  } catch (error) {
    console.error('Error fetching offices:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch offices',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}

// POST - Create a new office
export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    const authResult = await verifyAuth(token || '');
    if (!authResult.isAuthenticated || !authResult.user) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    // Only admins can create offices
    if (!authResult.user.isAdmin) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      name,
      location,
      type,
      status = OfficeStatus.ACTIVE,
      contactEmail,
      contactPhone,
      address,
      capacity
    } = body;

    // Validate required fields
    if (!name || !location || !type || !contactEmail || !contactPhone) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing required fields'
        },
        { status: 400 }
      );
    }

    // Check if office with same name exists
    const existingOffice = await prisma.office.findUnique({
      where: { name }
    });

    if (existingOffice) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Office with this name already exists'
        },
        { status: 400 }
      );
    }

    // Create new office
    const office = await prisma.office.create({
      data: {
        name,
        location,
        type,
        status,
        contactEmail,
        contactPhone,
        address,
        capacity
      },
      include: {
        lawyers: true,
        coordinators: true
      }
    });

    // Log activity
    await prisma.activity.create({
      data: {
        userId: authResult.user.id,
        action: 'CREATE_OFFICE',
        details: {
          officeId: office.id,
          officeName: office.name
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: office
    });

  } catch (error) {
    console.error('Error creating office:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create office',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}

// PATCH - Update an existing office
export async function PATCH(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    const authResult = await verifyAuth(token || '');
    if (!authResult.isAuthenticated || !authResult.user) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    // Only admins can update offices
    if (!authResult.user.isAdmin) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      id,
      name,
      location,
      type,
      status,
      contactEmail,
      contactPhone,
      address,
      capacity
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Office ID is required' },
        { status: 400 }
      );
    }

    // Check if office exists
    const existingOffice = await prisma.office.findUnique({
      where: { id }
    });

    if (!existingOffice) {
      return NextResponse.json(
        { error: 'Office not found' },
        { status: 404 }
      );
    }

    // If name is being changed, check for duplicates
    if (name && name !== existingOffice.name) {
      const duplicateOffice = await prisma.office.findUnique({
        where: { name }
      });

      if (duplicateOffice) {
        return NextResponse.json(
          { error: 'Office with this name already exists' },
          { status: 400 }
        );
      }
    }

    // Update office
    const updatedOffice = await prisma.office.update({
      where: { id },
      data: {
        name,
        location,
        type,
        status,
        contactEmail,
        contactPhone,
        address,
        capacity
      },
      include: {
        lawyers: true,
        coordinators: true
      }
    });

    // Log activity
    await prisma.activity.create({
      data: {
        userId: authResult.user.id,
        action: 'UPDATE_OFFICE',
        details: {
          officeId: updatedOffice.id,
          officeName: updatedOffice.name,
          changes: body
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedOffice
    });

  } catch (error) {
    console.error('Error updating office:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to update office',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
} 
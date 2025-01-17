import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { KebeleType, KebeleStatus } from '@prisma/client';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const data = await req.json();
    const {
      kebeleNumber,
      kebeleName,
      type,
      status,
      region,
      zone,
      woreda,
      contactPhone,
      contactEmail,
    } = data;

    // Validate required fields
    if (!kebeleNumber || !kebeleName || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate kebele type
    if (!Object.values(KebeleType).includes(type as KebeleType)) {
      return NextResponse.json(
        { error: 'Invalid kebele type' },
        { status: 400 }
      );
    }

    // Validate kebele status if provided
    if (status && !Object.values(KebeleStatus).includes(status as KebeleStatus)) {
      return NextResponse.json(
        { error: 'Invalid kebele status' },
        { status: 400 }
      );
    }

    // Check if kebele exists
    const existingKebele = await prisma.kebele.findUnique({
      where: {
        id,
      },
    });

    if (!existingKebele) {
      return NextResponse.json(
        { error: 'Kebele not found' },
        { status: 404 }
      );
    }

    // Check if new kebele number already exists (excluding current kebele)
    if (kebeleNumber !== existingKebele.kebeleNumber) {
      const duplicateKebele = await prisma.kebele.findFirst({
        where: {
          kebeleNumber,
          NOT: {
            id,
          },
        },
      });

      if (duplicateKebele) {
        return NextResponse.json(
          { error: 'Kebele number already exists' },
          { status: 400 }
        );
      }
    }

    // Update kebele
    const updatedKebele = await prisma.kebele.update({
      where: {
        id,
      },
      data: {
        kebeleNumber,
        kebeleName,
        type: type as KebeleType,
        status: status as KebeleStatus,
        region,
        zone,
        woreda,
        contactPhone,
        contactEmail,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedKebele,
    });
  } catch (error) {
    console.error('Error updating kebele:', error);
    return NextResponse.json(
      { error: 'Failed to update kebele' },
      { status: 500 }
    );
  }
} 
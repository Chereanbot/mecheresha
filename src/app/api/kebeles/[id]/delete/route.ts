import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    // Check if kebele exists
    const existingKebele = await prisma.kebele.findUnique({
      where: {
        id,
      },
      include: {
        cases: true,
        staffProfiles: true,
      },
    });

    if (!existingKebele) {
      return NextResponse.json(
        { error: 'Kebele not found' },
        { status: 404 }
      );
    }

    // Check if kebele has any active cases or staff
    if (existingKebele.cases.length > 0 || existingKebele.staffProfiles.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete kebele with active cases or staff' },
        { status: 400 }
      );
    }

    // Delete kebele manager if exists
    if (existingKebele.manager) {
      await prisma.kebeleManager.delete({
        where: {
          kebeleId: id,
        },
      });
    }

    // Delete kebele
    await prisma.kebele.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Kebele deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting kebele:', error);
    return NextResponse.json(
      { error: 'Failed to delete kebele' },
      { status: 500 }
    );
  }
} 
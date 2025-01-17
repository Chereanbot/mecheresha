import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    // Get query parameters
    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get('search');
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { kebeleName: { contains: search, mode: 'insensitive' } },
        { kebeleNumber: { contains: search, mode: 'insensitive' } },
        { region: { contains: search, mode: 'insensitive' } },
        { zone: { contains: search, mode: 'insensitive' } },
        { woreda: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (type) {
      where.type = type;
    }

    if (status) {
      where.status = status;
    }

    // Fetch kebeles with related data
    const kebeles = await prisma.kebele.findMany({
      where,
      include: {
        manager: true,
        staffProfiles: true,
        cases: true,
        _count: {
          select: {
            cases: true,
            staffProfiles: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        kebeles,
      },
    });
  } catch (error) {
    console.error('Error fetching kebeles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch kebeles' },
      { status: 500 }
    );
  }
} 
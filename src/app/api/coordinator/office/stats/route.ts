import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

export async function GET(request: Request) {
  try {
    const headersList = await headers();
    const userId = headersList.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get coordinator's office
    const coordinator = await prisma.coordinator.findFirst({
      where: {
        userId: userId
      },
      select: {
        officeId: true
      }
    });

    if (!coordinator) {
      return NextResponse.json(
        { success: false, message: 'No data found' },
        { status: 404 }
      );
    }

    const officeId = coordinator.officeId;

    // Get office data
    const office = await prisma.office.findUnique({
      where: { id: officeId }
    });

    if (!office) {
      return NextResponse.json(
        { success: false, message: 'No office data found' },
        { status: 404 }
      );
    }

    // Get real-time office statistics
    const [coordinatorCount, activeCoordinators, totalCases, activeCases] = await Promise.all([
      // Total coordinators in office
      prisma.coordinator.count({
        where: { officeId }
      }),

      // Active coordinators
      prisma.coordinator.count({
        where: {
          officeId,
          status: 'ACTIVE'
        }
      }),

      // Total cases in office
      prisma.case.count({
        where: { officeId }
      }),

      // Active cases
      prisma.case.count({
        where: {
          officeId,
          status: 'ACTIVE'
        }
      })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        office: {
          id: office.id,
          name: office.name,
          location: office.location
        },
        stats: {
          coordinatorCount: coordinatorCount || 0,
          activeCoordinators: activeCoordinators || 0,
          totalCases: totalCases || 0,
          activeCases: activeCases || 0
        }
      }
    });

  } catch (error) {
    console.error('Error fetching office stats:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch office statistics' },
      { status: 500 }
    );
  }
}
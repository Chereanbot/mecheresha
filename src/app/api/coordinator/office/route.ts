import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

export async function GET(request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const coordinator = await prisma.coordinator.findFirst({
      where: {
        userId: session.user.id
      },
      include: {
        office: {
          include: {
            resources: {
              where: {
                status: 'AVAILABLE'
              }
            },
            coordinators: {
              where: {
                status: 'ACTIVE'
              },
              include: {
                user: {
                  select: {
                    id: true,
                    fullName: true,
                    email: true
                  }
                }
              }
            },
            _count: {
              select: {
                cases: true
              }
            }
          }
        }
      }
    });

    if (!coordinator) {
      return NextResponse.json(
        { error: 'Coordinator not found' },
        { status: 404 }
      );
    }

    // Get office performance metrics
    const performance = await prisma.officePerformance.findMany({
      where: {
        officeId: coordinator.officeId,
        date: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      },
      orderBy: {
        date: 'asc'
      }
    });

    return NextResponse.json({
      office: coordinator.office,
      performance,
      resources: {
        available: coordinator.office.resources.length,
        total: await prisma.resource.count({
          where: { officeId: coordinator.officeId }
        })
      },
      staff: {
        coordinators: coordinator.office.coordinators.length,
        totalCases: coordinator.office._count.cases
      }
    });

  } catch (error) {
    console.error('Error fetching office details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch office details' },
      { status: 500 }
    );
  }
} 
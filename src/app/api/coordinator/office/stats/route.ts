import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const officeId = searchParams.get('officeId');

    if (!officeId) {
      return NextResponse.json(
        { error: 'Office ID is required' },
        { status: 400 }
      );
    }

    // Get real-time office statistics
    const [
      coordinatorCount,
      activeCoordinators,
      totalCases,
      activeCases,
      pendingRequests,
      officePerformance,
      resourceUtilization,
      coordinatorWorkload
    ] = await Promise.all([
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
      }),

      // Pending service requests
      prisma.serviceRequest.count({
        where: {
          status: 'PENDING',
          assignedLawyer: {
            coordinatorProfile: {
              officeId
            }
          }
        }
      }),

      // Office performance metrics
      prisma.officePerformance.findMany({
        where: {
          officeId,
          date: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
          }
        },
        orderBy: {
          date: 'asc'
        }
      }),

      // Resource utilization
      prisma.resource.findMany({
        where: {
          officeId,
          status: 'IN_USE'
        },
        include: {
          office: true
        }
      }),

      // Coordinator workload distribution
      prisma.coordinator.findMany({
        where: {
          officeId,
          status: 'ACTIVE'
        },
        include: {
          _count: {
            select: {
              assignments: true
            }
          }
        }
      })
    ]);

    // Calculate additional metrics
    const caseResolutionRate = officePerformance.reduce((acc, curr) => {
      if (curr.category === 'CASE_RESOLUTION') {
        return acc + curr.value;
      }
      return acc;
    }, 0) / officePerformance.length;

    const resourceUtilizationRate = (resourceUtilization.length / totalCases) * 100;

    const averageWorkload = coordinatorWorkload.reduce((acc, curr) => {
      return acc + curr._count.assignments;
    }, 0) / coordinatorWorkload.length;

    return NextResponse.json({
      overview: {
        coordinatorCount,
        activeCoordinators,
        totalCases,
        activeCases,
        pendingRequests
      },
      metrics: {
        caseResolutionRate,
        resourceUtilizationRate,
        averageWorkload
      },
      performance: officePerformance,
      resourceUtilization,
      coordinatorWorkload: coordinatorWorkload.map(c => ({
        id: c.id,
        assignments: c._count.assignments
      }))
    });

  } catch (error) {
    console.error('Error fetching office stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch office statistics' },
      { status: 500 }
    );
  }
} 
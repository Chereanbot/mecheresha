import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const coordinator = await prisma.coordinator.findFirst({
      where: {
        user: {
          email: session.user.email
        }
      },
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
            phone: true,
            avatar: true
          }
        },
        office: true,
        qualifications: true
      }
    });

    if (!coordinator) {
      return NextResponse.json(
        { success: false, error: 'Coordinator not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      profile: coordinator
    });

  } catch (error) {
    console.error('Error fetching coordinator profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const data = await request.json();

    const coordinator = await prisma.coordinator.findFirst({
      where: {
        user: {
          email: session.user.email
        }
      },
      include: {
        user: true
      }
    });

    if (!coordinator) {
      return NextResponse.json(
        { success: false, error: 'Coordinator not found' },
        { status: 404 }
      );
    }

    // Update user information
    await prisma.user.update({
      where: { id: coordinator.user.id },
      data: {
        fullName: data.fullName,
        phone: data.phone
      }
    });

    // Update coordinator information
    const updatedCoordinator = await prisma.coordinator.update({
      where: { id: coordinator.id },
      data: {
        specialties: data.specialties
      },
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
            phone: true,
            avatar: true
          }
        },
        office: true,
        qualifications: true
      }
    });

    return NextResponse.json({
      success: true,
      profile: updatedCoordinator
    });

  } catch (error) {
    console.error('Error updating coordinator profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    );
  }
} 
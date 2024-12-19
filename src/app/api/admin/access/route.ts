import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user has admin access
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        role: true
      }
    });

    if (!user?.isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Get all roles with their permissions
    const roles = await prisma.role.findMany({
      include: {
        permissions: {
          include: {
            permission: true
          }
        },
        users: {
          select: {
            id: true,
            email: true,
            fullName: true,
            userRole: true
          }
        }
      }
    });

    // Get all permissions
    const permissions = await prisma.permission.findMany();

    // Group permissions by module
    const permissionsByModule = permissions.reduce((acc, permission) => {
      if (!acc[permission.module]) {
        acc[permission.module] = [];
      }
      acc[permission.module].push(permission);
      return acc;
    }, {} as Record<string, typeof permissions>);

    return NextResponse.json({
      roles,
      permissions: permissionsByModule,
      userRole: user.role
    });
  } catch (error) {
    console.error('Error fetching access control data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch access control data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user?.isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const data = await request.json();
    
    if (data.type === 'ASSIGN_PERMISSION') {
      const { roleId, permissionId } = data;
      
      await prisma.rolePermission.create({
        data: {
          roleId,
          permissionId
        }
      });
    } else if (data.type === 'REMOVE_PERMISSION') {
      const { roleId, permissionId } = data;
      
      await prisma.rolePermission.delete({
        where: {
          roleId_permissionId: {
            roleId,
            permissionId
          }
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating access control:', error);
    return NextResponse.json(
      { error: 'Failed to update access control' },
      { status: 500 }
    );
  }
} 
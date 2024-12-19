import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      email, 
      password, 
      fullName, 
      role, 
      phone,
      specializations = [],
      experience = 0,
      company = '',
      address = '' 
    } = body;

    // Validate required fields
    if (!email || !password || !fullName || !role) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create user with transaction to handle related profiles
    const user = await prisma.$transaction(async (prisma) => {
      // Create base user
      const user = await prisma.user.create({
        data: {
          email,
          phone: phone || undefined,
          password: hashedPassword,
          fullName,
          role,
          status: 'ACTIVE',
          isAdmin: role === 'SUPER_ADMIN' || role === 'ADMIN'
        }
      });

      // Create role-specific profile
      if (role === 'LAWYER') {
        await prisma.lawyerProfile.create({
          data: {
            userId: user.id,
            specializations,
            experience,
            rating: 0,
            caseLoad: 0,
            availability: true,
            officeId: await getDefaultOfficeId(prisma) // Helper function to get/create default office
          }
        });
      }

      return user;
    });

    return NextResponse.json({
      success: true,
      data: user
    });

  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to create user',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}

async function getDefaultOfficeId(prisma: any) {
  // Get or create default office
  let defaultOffice = await prisma.office.findFirst({
    where: { name: 'Main Office' }
  });

  if (!defaultOffice) {
    defaultOffice = await prisma.office.create({
      data: {
        name: 'Main Office',
        location: 'Default Location',
        capacity: 50
      }
    });
  }

  return defaultOffice.id;
} 
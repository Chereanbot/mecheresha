import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const offices = await prisma.office.findMany({
      select: {
        id: true,
        name: true,
        location: true
      }
    });
    
    return NextResponse.json(offices);
  } catch (error) {
    console.error('Failed to fetch offices:', error);
    return NextResponse.json(
      { message: 'Failed to fetch offices' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    const office = await prisma.office.create({
      data: {
        name: data.name,
        location: data.location
      }
    });

    return NextResponse.json({ success: true, office });
  } catch (error) {
    console.error('Create office error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create office' },
      { status: 500 }
    );
  }
} 
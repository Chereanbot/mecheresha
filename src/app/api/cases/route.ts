import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const cases = await prisma.case.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        assignedLawyer: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json(cases);
  } catch (error) {
    console.error('Error fetching cases:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cases' },
      { status: 500 }
    );
  }
} 
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { KebeleType, KebeleStatus, KebeleDepartment } from '@prisma/client';
import { z } from 'zod';

// Define validation schema
const kebeleSchema = z.object({
  kebeleNumber: z.string()
    .min(1, 'Kebele number is required')
    .regex(/^[A-Za-z0-9-]+$/, 'Kebele number must contain only letters, numbers, and hyphens'),
  kebeleName: z.string()
    .min(2, 'Kebele name must be at least 2 characters')
    .max(100, 'Kebele name must not exceed 100 characters'),
  type: z.enum(['URBAN', 'RURAL', 'SEMI_URBAN', 'SPECIAL'] as const),
  status: z.enum(['ACTIVE', 'INACTIVE', 'RESTRUCTURING', 'MERGED', 'DISSOLVED'] as const)
    .default('ACTIVE'),
  region: z.string().optional(),
  zone: z.string().optional(),
  woreda: z.string().optional(),
  subCity: z.string().optional(),
  district: z.string().optional(),
  mainOffice: z.string().optional(),
  contactPhone: z.string()
    .regex(/^\+?[0-9\s-()]+$/, 'Invalid phone number format')
    .optional(),
  contactEmail: z.string()
    .email('Invalid email format')
    .optional(),
  workingHours: z.string().optional(),
  population: z.number().int().positive().optional(),
  departments: z.array(z.enum(Object.values(KebeleDepartment) as [string, ...string[]])).default([]),
  services: z.array(z.string()).default([]),
  facilities: z.array(z.string()).default([]),
  coordinates: z.object({
    latitude: z.number(),
    longitude: z.number()
  }).optional(),
  establishedDate: z.string().datetime().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Validate input data
    const validationResult = kebeleSchema.safeParse(data);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationResult.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;

    // Check if kebele number already exists
    const existingKebele = await prisma.kebele.findFirst({
      where: {
        OR: [
          { kebeleNumber: validatedData.kebeleNumber },
          { 
            AND: [
              { kebeleName: validatedData.kebeleName },
              { region: validatedData.region },
              { zone: validatedData.zone },
              { woreda: validatedData.woreda }
            ]
          }
        ]
      },
    });

    if (existingKebele) {
      return NextResponse.json(
        { 
          error: 'Kebele already exists',
          details: 'A kebele with this number or same name and location already exists'
        },
        { status: 400 }
      );
    }

    // Format data for creation
    const kebeleData = {
      ...validatedData,
      totalStaff: 0,
      coordinates: validatedData.coordinates ? JSON.stringify(validatedData.coordinates) : null,
      establishedDate: validatedData.establishedDate ? new Date(validatedData.establishedDate) : null,
    };

    // Create new kebele with transaction to ensure data consistency
    const kebele = await prisma.$transaction(async (tx) => {
      // Create the kebele
      const newKebele = await tx.kebele.create({
        data: kebeleData,
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
      });

      // Create default departments if specified
      if (validatedData.departments.length > 0) {
        // Here you could set up default department structures
        // This would depend on your specific requirements
      }

      return newKebele;
    });

    return NextResponse.json({
      success: true,
      message: 'Kebele created successfully',
      data: kebele,
    });

  } catch (error) {
    console.error('Error creating kebele:', error);
    
    // Handle specific database errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { 
          error: 'Unique constraint violation',
          details: 'A kebele with this identifier already exists'
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to create kebele',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
} 
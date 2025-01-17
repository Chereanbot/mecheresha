import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';
import { CaseStatus, CaseType, Priority } from '@prisma/client';

export async function POST(request: Request) {
  try {
    // Verify coordinator authentication
    const authResult = await verifyAuth(request);
    if (!authResult.isAuthenticated || authResult.user?.userRole !== 'COORDINATOR') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    
    // Extract basic case information
    const caseData = {
      title: formData.get('caseDescription') as string,
      description: formData.get('caseDescription') as string,
      status: 'ACTIVE' as CaseStatus,
      priority: (formData.get('priority') || 'MEDIUM') as Priority,
      caseType: formData.get('caseType') as CaseType,

      // Client Information
      clientName: formData.get('clientName') as string,
      clientPhone: formData.get('clientPhone') as string,
      clientAddress: formData.get('clientAddress') as string || '',

      // Location Details
      region: formData.get('region') as string || '',
      zone: formData.get('zone') as string || '',
      wereda: formData.get('wereda') as string,
      kebele: formData.get('kebele') as string,
      houseNumber: formData.get('houseNumber') as string || '',

      // Request & Response
      clientRequest: formData.get('clientRequest') as string,
      requestDetails: JSON.parse(formData.get('requestDetails') as string || '{}'),
      
      // Tags
      tags: JSON.parse(formData.get('tags') as string || '[]'),

      // Relations
      clientId: authResult.user.id,
      officeId: authResult.user.officeId,

      // Expected resolution
      expectedResolutionDate: formData.get('expectedResolutionDate') 
        ? new Date(formData.get('expectedResolutionDate') as string)
        : null
    };

    // Validate required fields
    if (!caseData.clientName || !caseData.clientPhone || !caseData.wereda || !caseData.kebele) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create case in transaction
    const newCase = await prisma.$transaction(async (tx) => {
      try {
        // Create the case
        const case_ = await tx.case.create({
          data: caseData,
          include: {
            documents: true,
            activities: true,
            client: {
              select: {
                id: true,
                fullName: true,
                email: true
              }
            },
            office: {
              select: {
                id: true,
                name: true
              }
            }
          }
        });

        // Handle document uploads if any
        const documents = formData.getAll('documents');
        if (documents.length > 0) {
          for (const doc of documents) {
            if (doc instanceof File) {
              await tx.caseDocument.create({
                data: {
                  caseId: case_.id,
                  title: doc.name,
                  path: '/temp/path',
                  size: doc.size,
                  mimeType: doc.type,
                  uploadedBy: authResult.user.id
                }
              });
            }
          }
        }

        // Create initial case activity
        await tx.caseActivity.create({
          data: {
            caseId: case_.id,
            userId: authResult.user.id,
            title: 'Case Created',
            description: 'New case has been created',
            type: 'CREATION'
          }
        });

        return case_;
      } catch (txError) {
        console.error('Transaction error:', txError);
        throw new Error('Failed to create case');
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Case created successfully',
      data: newCase
    });

  } catch (error) {
    console.error('Error creating case:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create case'
    }, {
      status: 500
    });
  }
} 
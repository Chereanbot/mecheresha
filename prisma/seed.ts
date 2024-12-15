import { PrismaClient, Role, CaseStatus, Priority, CaseType } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.caseDocument.deleteMany();
  await prisma.caseActivity.deleteMany();
  await prisma.appealDocument.deleteMany();
  await prisma.appeal.deleteMany();
  await prisma.caseNote.deleteMany();
  await prisma.caseAssignment.deleteMany();
  await prisma.case.deleteMany();
  await prisma.performance.deleteMany();
  await prisma.officePerformance.deleteMany();
  await prisma.serviceRequest.deleteMany();
  await prisma.servicePackage.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.coordinatorAssignment.deleteMany();
  await prisma.project.deleteMany();
  await prisma.lawyerProfile.deleteMany();
  await prisma.coordinator.deleteMany();
  await prisma.office.deleteMany();
  await prisma.oTPVerification.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.document.deleteMany();
  await prisma.user.deleteMany();
  await prisma.permission.deleteMany();
  await prisma.adminRole.deleteMany();

  // Create Permissions
  const permissions = [
    { name: 'user.view', description: 'View user details', module: 'User Management' },
    { name: 'user.create', description: 'Create users', module: 'User Management' },
    { name: 'user.edit', description: 'Edit user details', module: 'User Management' },
    { name: 'case.manage', description: 'Manage cases', module: 'Case Management' },
    { name: 'lawyer.assign', description: 'Assign lawyers', module: 'Lawyer Management' },
    { name: 'report.view', description: 'View reports', module: 'Reporting' }
  ];

  const createdPermissions = await Promise.all(
    permissions.map(permission =>
      prisma.permission.create({ data: permission })
    )
  );

  // Create Admin Role
  const adminRole = await prisma.adminRole.create({
    data: {
      name: 'Super Admin',
      description: 'Full system access',
      permissionIds: createdPermissions.map(p => p.id)
    }
  });

  // Create Users
  const hashedPassword = await hash('password123', 10);
  
  // 1. Admin User
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      phone: '+1234567890',
      password: hashedPassword,
      fullName: 'Admin User',
      username: 'admin',
      role: Role.SUPER_ADMIN,
      emailVerified: true,
      phoneVerified: true,
      isAdmin: true,
      adminRoleId: adminRole.id,
      permissionIds: createdPermissions.map(p => p.id)
    }
  });

  // 2. Lawyer Users
  const lawyer1 = await prisma.user.create({
    data: {
      email: 'lawyer1@example.com',
      phone: '+1234567891',
      password: hashedPassword,
      fullName: 'John Lawyer',
      username: 'lawyer1',
      role: Role.LAWYER,
      emailVerified: true,
      phoneVerified: true
    }
  });

  const lawyer2 = await prisma.user.create({
    data: {
      email: 'lawyer2@example.com',
      phone: '+1234567892',
      password: hashedPassword,
      fullName: 'Jane Lawyer',
      username: 'lawyer2',
      role: Role.LAWYER,
      emailVerified: true,
      phoneVerified: true
    }
  });

  // 3. Client Users
  const client1 = await prisma.user.create({
    data: {
      email: 'client1@example.com',
      phone: '+1234567893',
      password: hashedPassword,
      fullName: 'Alice Client',
      username: 'client1',
      role: Role.CLIENT,
      emailVerified: true,
      phoneVerified: true
    }
  });

  const client2 = await prisma.user.create({
    data: {
      email: 'client2@example.com',
      phone: '+1234567894',
      password: hashedPassword,
      fullName: 'Bob Client',
      username: 'client2',
      role: Role.CLIENT,
      emailVerified: true,
      phoneVerified: true
    }
  });

  // Create Offices
  const office1 = await prisma.office.create({
    data: {
      name: 'Main Office',
      location: 'New York',
      capacity: 50
    }
  });

  const office2 = await prisma.office.create({
    data: {
      name: 'Branch Office',
      location: 'Los Angeles',
      capacity: 30
    }
  });

  // Create Lawyer Profiles
  const lawyerProfile1 = await prisma.lawyerProfile.create({
    data: {
      userId: lawyer1.id,
      specializations: ['Criminal Law', 'Family Law'],
      experience: 5,
      rating: 4.5,
      caseLoad: 3,
      availability: true,
      officeId: office1.id
    }
  });

  const lawyerProfile2 = await prisma.lawyerProfile.create({
    data: {
      userId: lawyer2.id,
      specializations: ['Corporate Law', 'Civil Law'],
      experience: 8,
      rating: 4.8,
      caseLoad: 4,
      availability: true,
      officeId: office2.id
    }
  });

  // Create Cases
  const case1 = await prisma.case.create({
    data: {
      caseNumber: 'CASE-2024-001',
      title: 'Smith vs. Johnson',
      description: 'Family dispute case',
      status: 'ACTIVE',
      priority: 'HIGH',
      type: 'FAMILY',
      startDate: new Date(),
      clientId: client1.id,
      lawyerId: lawyer1.id,
      officeId: office1.id
    }
  });

  const case2 = await prisma.case.create({
    data: {
      caseNumber: 'CASE-2024-002',
      title: 'Corporate Merger Case',
      description: 'Corporate merger legal consultation',
      status: 'PENDING',
      priority: 'MEDIUM',
      type: 'CORPORATE',
      startDate: new Date(),
      clientId: client2.id,
      lawyerId: lawyer2.id,
      officeId: office2.id
    }
  });

  // Create Service Packages
  const package1 = await prisma.servicePackage.create({
    data: {
      name: 'Basic Legal Package',
      description: 'Basic legal consultation services',
      price: 500.00,
      features: ['Initial Consultation', 'Document Review', 'Legal Advice'],
      active: true
    }
  });

  const package2 = await prisma.servicePackage.create({
    data: {
      name: 'Premium Legal Package',
      description: 'Comprehensive legal services',
      price: 1500.00,
      features: ['24/7 Support', 'Court Representation', 'Document Preparation', 'Legal Research'],
      active: true
    }
  });

  // Create Service Requests
  await prisma.serviceRequest.create({
    data: {
      clientId: client1.id,
      packageId: package1.id,
      status: 'PENDING',
      paymentStatus: 'PENDING'
    }
  });

  await prisma.serviceRequest.create({
    data: {
      clientId: client2.id,
      packageId: package2.id,
      status: 'APPROVED',
      paymentStatus: 'PAID'
    }
  });

  // Create Case Activities
  await prisma.caseActivity.create({
    data: {
      caseId: case1.id,
      action: 'Case Review',
      description: 'Initial case review completed',
      performedBy: lawyer1.id
    }
  });

  await prisma.caseActivity.create({
    data: {
      caseId: case2.id,
      action: 'Document Filing',
      description: 'Filed initial documents',
      performedBy: lawyer2.id
    }
  });

  // Create Case Notes
  await prisma.caseNote.create({
    data: {
      caseId: case1.id,
      content: 'Client meeting scheduled for next week',
      createdBy: lawyer1.id,
      isPrivate: false
    }
  });

  await prisma.caseNote.create({
    data: {
      caseId: case2.id,
      content: 'Reviewed merger documents',
      createdBy: lawyer2.id,
      isPrivate: true
    }
  });

  // Create Coordinators
  const coordinator1 = await prisma.coordinator.create({
    data: {
      userId: adminUser.id,
      type: 'PROJECT_BASED',
      officeId: office1.id
    }
  });

  const coordinator2 = await prisma.coordinator.create({
    data: {
      userId: lawyer2.id,
      type: 'PERMANENT',
      officeId: office2.id
    }
  });

  // Create Projects
  const project1 = await prisma.project.create({
    data: {
      name: 'Legal Aid Initiative',
      description: 'Pro bono legal services for underprivileged communities',
      startDate: new Date(),
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
      status: 'IN_PROGRESS',
      coordinatorId: coordinator1.id
    }
  });

  const project2 = await prisma.project.create({
    data: {
      name: 'Corporate Compliance Program',
      description: 'Implementing compliance protocols for corporate clients',
      startDate: new Date(),
      status: 'PLANNED',
      coordinatorId: coordinator2.id
    }
  });

  // Create Coordinator Assignments
  await prisma.coordinatorAssignment.create({
    data: {
      coordinatorId: coordinator1.id,
      projectId: project1.id,
      startDate: new Date(),
      status: 'ACCEPTED',
      notes: 'Leading the legal aid initiative'
    }
  });

  await prisma.coordinatorAssignment.create({
    data: {
      coordinatorId: coordinator2.id,
      projectId: project2.id,
      startDate: new Date(),
      status: 'PENDING',
      notes: 'Assigned to compliance program'
    }
  });

  // Create Resources
  await prisma.resource.create({
    data: {
      name: 'Conference Room A',
      type: 'FACILITY',
      status: 'AVAILABLE',
      officeId: office1.id
    }
  });

  await prisma.resource.create({
    data: {
      name: 'Company Vehicle 1',
      type: 'VEHICLE',
      status: 'IN_USE',
      officeId: office1.id
    }
  });

  // Create Performance Records
  await prisma.performance.create({
    data: {
      lawyerId: lawyerProfile1.id,
      metric: 'Cases Won',
      value: 85.5,
      period: '2024-Q1'
    }
  });

  await prisma.performance.create({
    data: {
      lawyerId: lawyerProfile2.id,
      metric: 'Client Satisfaction',
      value: 92.0,
      period: '2024-Q1'
    }
  });

  // Create Office Performance Records
  await prisma.officePerformance.create({
    data: {
      officeId: office1.id,
      metric: 'Case Resolution Rate',
      value: 78.5,
      period: '2024-Q1'
    }
  });

  await prisma.officePerformance.create({
    data: {
      officeId: office2.id,
      metric: 'Revenue Growth',
      value: 15.2,
      period: '2024-Q1'
    }
  });

  // Create Case Assignments
  await prisma.caseAssignment.create({
    data: {
      caseId: case1.id,
      assignedById: adminUser.id,
      assignedToId: lawyer1.id,
      status: 'ACCEPTED',
      notes: 'Primary case handler'
    }
  });

  await prisma.caseAssignment.create({
    data: {
      caseId: case2.id,
      assignedById: adminUser.id,
      assignedToId: lawyer2.id,
      status: 'ACCEPTED',
      notes: 'Lead corporate counsel'
    }
  });

  // Create Appeals
  const appeal1 = await prisma.appeal.create({
    data: {
      caseId: case1.id,
      title: 'Custody Decision Appeal',
      description: 'Appeal against primary custody decision',
      status: 'PENDING',
      filedBy: lawyer1.id,
      hearingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    }
  });

  // Create Appeal Documents
  await prisma.appealDocument.create({
    data: {
      appealId: appeal1.id,
      title: 'Appeal Brief',
      path: '/documents/appeals/brief-001.pdf',
      uploadedAt: new Date()
    }
  });

  // Create Case Documents
  await prisma.caseDocument.create({
    data: {
      caseId: case1.id,
      title: 'Initial Complaint',
      type: 'LEGAL_DOCUMENT',
      path: '/documents/cases/complaint-001.pdf',
      size: 1024576, // 1MB
      mimeType: 'application/pdf',
      uploadedBy: lawyer1.id
    }
  });

  // Create Activities
  await prisma.activity.create({
    data: {
      userId: adminUser.id,
      action: 'CASE_ASSIGNMENT',
      details: { caseId: case1.id, assignedTo: lawyer1.id },
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0'
    }
  });

  // Create Notifications
  await prisma.notification.create({
    data: {
      userId: lawyer1.id,
      title: 'New Case Assigned',
      message: 'You have been assigned to case CASE-2024-001',
      type: 'INFO',
      read: false
    }
  });

  // Create Documents
  await prisma.document.create({
    data: {
      userId: lawyer1.id,
      title: 'Case Strategy Document',
      type: 'INTERNAL',
      path: '/documents/strategy/doc-001.pdf',
      size: 512000,
      mimeType: 'application/pdf'
    }
  });

  // Create OTP Verification
  await prisma.oTPVerification.create({
    data: {
      userId: client1.id,
      otp: '123456',
      type: 'EMAIL',
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
      verified: false
    }
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
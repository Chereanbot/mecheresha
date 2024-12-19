import { PrismaClient, ServiceType, ServiceCategory, CoordinatorType, OfficeType, OfficeStatus, Role, UserStatus, NotificationType, UserRoleEnum } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedOffices(coordinator: any) {
  const offices = [
    {
      name: 'YIRGA_CHAFE',
      location: 'Yirga Chafe',
      type: OfficeType.BRANCH,
      status: OfficeStatus.ACTIVE,
      contactEmail: 'yirga@example.com',
      contactPhone: '+251123456789',
      address: 'Main Street, Yirga Chafe',
      coordinators: {
        create: [
          {
            type: CoordinatorType.PERMANENT,
            status: UserStatus.ACTIVE,
            specialties: ['Case Management', 'Client Relations'],
            user: {
              connect: { id: coordinator.id }
            }
          }
        ]
      }
    }
  ];

  for (const office of offices) {
    await prisma.office.upsert({
      where: { name: office.name },
      update: {},
      create: office
    });
  }

  console.log('Seeded offices with coordinators');
}

async function cleanDatabase() {
  try {
    // First level - most dependent
    await prisma.reminder.deleteMany({});
    await prisma.communication.deleteMany({});
    await prisma.appointment.deleteMany({});
    await prisma.verificationRecord.deleteMany({});
    await prisma.serviceDocument.deleteMany({});
    await prisma.serviceActivity.deleteMany({});
    await prisma.serviceNote.deleteMany({});
    await prisma.payment.deleteMany({});
    await prisma.reminderPreference.deleteMany({});
    await prisma.serviceRequest.deleteMany({});

    // Second level
    await prisma.servicePackage.deleteMany({});
    await prisma.qualificationDocument.deleteMany({});
    await prisma.qualification.deleteMany({});
    await prisma.coordinatorDocument.deleteMany({});
    await prisma.coordinatorAssignment.deleteMany({});
    await prisma.project.deleteMany({});
    await prisma.coordinator.deleteMany({});

    // Case related
    await prisma.appealHearing.deleteMany({});
    await prisma.appealDocument.deleteMany({});
    await prisma.appeal.deleteMany({});
    await prisma.caseActivity.deleteMany({});
    await prisma.caseDocument.deleteMany({});
    await prisma.caseNote.deleteMany({});
    await prisma.caseAssignment.deleteMany({});
    await prisma.case.deleteMany({});

    // User related - delete dependent records first
    await prisma.performance.deleteMany({});
    await prisma.lawyerProfile.deleteMany({});
    await prisma.notificationPreference.deleteMany({});
    await prisma.notification.deleteMany({});
    await prisma.activity.deleteMany({});
    await prisma.document.deleteMany({});
    await prisma.oTPVerification.deleteMany({});
    await prisma.rolePermission.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.role.deleteMany({});
    await prisma.permission.deleteMany({});

    // Office related
    await prisma.officePerformance.deleteMany({});
    await prisma.resource.deleteMany({});
    await prisma.office.deleteMany({});

    console.log('Database cleaned successfully');
  } catch (error) {
    console.error('Error cleaning database:', error);
    throw error;
  }
}

async function seedInitialData() {
  // Create default permissions
  const defaultPermissions = [
    // System & Auth
    { name: 'AUTH_LOGIN', module: 'AUTH', description: 'Can login to system' },
    { name: 'AUTH_VERIFY', module: 'AUTH', description: 'Can verify account' },
    
    // Users
    { name: 'MANAGE_USERS', module: 'USERS', description: 'Can manage users' },
    { name: 'VIEW_USERS', module: 'USERS', description: 'Can view users' },
    { name: 'MANAGE_ROLES', module: 'USERS', description: 'Can manage roles' },
    { name: 'MANAGE_PERMISSIONS', module: 'USERS', description: 'Can manage permissions' },
    
    // Cases
    { name: 'MANAGE_CASES', module: 'CASES', description: 'Can manage cases' },
    { name: 'VIEW_CASES', module: 'CASES', description: 'Can view cases' },
    { name: 'ASSIGN_CASES', module: 'CASES', description: 'Can assign cases' },
    
    // Services
    { name: 'MANAGE_SERVICES', module: 'SERVICES', description: 'Can manage services' },
    { name: 'VIEW_SERVICES', module: 'SERVICES', description: 'Can view services' },
    
    // Payments
    { name: 'MANAGE_PAYMENTS', module: 'PAYMENTS', description: 'Can manage payments' },
    { name: 'VIEW_PAYMENTS', module: 'PAYMENTS', description: 'Can view payments' },
    
    // Reports & Settings
    { name: 'VIEW_REPORTS', module: 'REPORTS', description: 'Can view reports' },
    { name: 'MANAGE_SETTINGS', module: 'SETTINGS', description: 'Can manage settings' },
  ];

  const permissions = await Promise.all(
    defaultPermissions.map(permission =>
      prisma.permission.create({
        data: permission
      })
    )
  );

  // Create roles with their base permissions
  const [superAdminRole, coordinatorRole] = await Promise.all([
    prisma.role.create({
      data: {
        name: 'Super Admin',
        description: 'Full system access'
      }
    }),
    prisma.role.create({
      data: {
        name: 'Coordinator',
        description: 'Case coordination and management'
      }
    })
  ]);

  // Assign all permissions to super admin
  await Promise.all(
    permissions.map(permission =>
      prisma.rolePermission.create({
        data: {
          roleId: superAdminRole.id,
          permissionId: permission.id
        }
      })
    )
  );

  // Assign limited permissions to coordinator
  const coordinatorPermissions = permissions.filter(p => [
    'AUTH_LOGIN',
    'AUTH_VERIFY',
    'VIEW_CASES',
    'VIEW_SERVICES',
    'VIEW_USERS'
  ].includes(p.name));

  await Promise.all(
    coordinatorPermissions.map(permission =>
      prisma.rolePermission.create({
        data: {
          roleId: coordinatorRole.id,
          permissionId: permission.id
        }
      })
    )
  );

  // Create users with proper roles
  const hashedPassword = await bcrypt.hash('cherean', 10);
  
  const [superAdmin, coordinator] = await Promise.all([
    prisma.user.create({
      data: {
        email: 'cherinetadmin@gmail.com',
        password: hashedPassword,
        fullName: 'Super Admin',
        userRole: UserRoleEnum.SUPER_ADMIN,
        isAdmin: true,
        phone: '+251911111111',
        emailVerified: true,
        phoneVerified: true,
        status: UserStatus.ACTIVE,
        roleId: superAdminRole.id,
        notificationPrefs: {
          create: {
            email: true,
            push: true,
            sms: true,
            type: NotificationType.SYSTEM_UPDATE
          }
        }
      }
    }),
    prisma.user.create({
      data: {
        email: 'cherinetcoordinator@gmail.com',
        password: hashedPassword,
        fullName: 'John Coordinator',
        userRole: UserRoleEnum.COORDINATOR,
        phone: '+251987654321',
        status: UserStatus.ACTIVE,
        roleId: coordinatorRole.id,
        notificationPrefs: {
          create: {
            email: true,
            push: true,
            sms: true,
            type: NotificationType.SYSTEM_UPDATE
          }
        }
      }
    })
  ]);

  // Create activity log
  await prisma.activity.create({
    data: {
      action: 'SYSTEM_INIT',
      details: {
        event: 'System initialization',
        description: 'System initialized with super admin account'
      },
      userId: superAdmin.id
    }
  });

  // Create service packages
  const consultationPackage = await prisma.servicePackage.create({
    data: {
      name: 'Legal Consultation',
      description: 'Initial legal consultation service',
      serviceType: ServiceType.CONSULTATION,
      category: ServiceCategory.CIVIL_LAW,
      price: 150.00,
      features: ['60-minute consultation', 'Written summary', 'Follow-up email'],
      eligibilityCriteria: ['Must be 18 or older'],
      estimatedDuration: '1-2 hours',
      active: true,
      user: {
        connect: { id: superAdmin.id }
      },
      createdBy: {
        connect: { id: superAdmin.id }
      }
    }
  });

  // Seed offices with the created coordinator
  await seedOffices(coordinator);

  return { 
    superAdmin,
    coordinator,
    consultationPackage 
  };
}

async function main() {
  try {
    console.log('Starting database cleanup...');
    await cleanDatabase();
    console.log('Database cleanup completed');

    console.log('Starting to seed database...');
    const seededData = await seedInitialData();
    console.log('Database seeding completed');
    console.log(seededData);
  } catch (error) {
    console.error('Error during database operations:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
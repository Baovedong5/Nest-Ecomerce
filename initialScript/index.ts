import envConfig from 'src/shared/config';
import { RoleName } from 'src/shared/constants/role.constant';
import { HasingService } from 'src/shared/services/hasing.service';
import { PrismaService } from 'src/shared/services/prisma.service';

const prisma = new PrismaService();

const hasingService = new HasingService();

const main = async () => {
  const roleCount = await prisma.role.count();

  if (roleCount > 0) {
    throw new Error('Roles already exist');
  }

  const roles = await prisma.role.createMany({
    data: [
      {
        name: RoleName.Admin,
        description: 'Admin role',
      },
      {
        name: RoleName.Client,
        description: 'Client role',
      },
      {
        name: RoleName.Seller,
        description: 'Seller role',
      },
    ],
  });

  const admimRole = await prisma.role.findFirstOrThrow({
    where: {
      name: RoleName.Admin,
    },
  });

  const hasedPassword = await hasingService.hash(envConfig.ADMIN_PASSWORD);

  const adminUser = await prisma.user.create({
    data: {
      email: envConfig.ADMIN_EMAIL,
      password: hasedPassword,
      name: envConfig.ADMIN_NAME,
      phoneNumber: envConfig.ADMIN_PHONENUMBER,
      roleId: admimRole.id,
    },
  });

  return {
    createdRoleCount: roles.count,
    adminUser,
  };
};

main()
  .then(({ adminUser, createdRoleCount }) => {
    console.log(`Created ${createdRoleCount} roles`);
    console.log(`Created admin user: ${adminUser.email}`);
  })
  .catch(console.error);

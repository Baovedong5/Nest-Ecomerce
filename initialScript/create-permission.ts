import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { HTTPMethod } from 'src/shared/constants/permission.constant';
import { RoleName } from 'src/shared/constants/role.constant';
import { PrismaService } from 'src/shared/services/prisma.service';

const prisma = new PrismaService();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  const server = app.getHttpAdapter().getInstance();
  const router = server.router;

  const permissionInDb = await prisma.permission.findMany({
    where: {
      deletedAt: null,
    },
  });

  const availableRoutes: { path: string; method: keyof typeof HTTPMethod; name: string }[] = router.stack
    .map((layer) => {
      if (layer.route) {
        const path = layer.route?.path;
        const method = String(layer.route?.stack[0].method).toUpperCase() as keyof typeof HTTPMethod;

        return {
          path,
          method,
          name: method + ' ' + path,
        };
      }
    })
    .filter((item) => item !== undefined);

  //Tạo object permission inDbMap với key là [method-path]
  const permissionInDbMap: Record<string, (typeof permissionInDb)[0]> = permissionInDb.reduce((acc, item) => {
    acc[`${item.method}-${item.path}`] = item;
    return acc;
  }, {});

  //Tạo object availableRoutesMap với key là [method-path]
  const availableRoutesMap: Record<string, (typeof availableRoutes)[0]> = availableRoutes.reduce((acc, item) => {
    acc[`${item.method}-${item.path}`] = item;
    return acc;
  }, {});

  //Tìm permission trong database mà không có trong availableRoutes
  const permissionsToDelete = permissionInDb.filter((item) => {
    return !availableRoutesMap[`${item.method}-${item.path}`];
  });

  //Xóa permission không còn trong availableRoutes
  if (permissionsToDelete.length > 0) {
    const deleteResult = await prisma.permission.deleteMany({
      where: {
        id: {
          in: permissionsToDelete.map((item) => item.id),
        },
      },
    });

    console.log('Deleted permission', deleteResult.count);
  } else {
    console.log('No permission to delete');
  }

  //Tìm routes mà không tồn tại trong permissionInDb
  const routesToAdd = availableRoutes.filter((item) => {
    return !permissionInDbMap[`${item.method}-${item.path}`];
  });

  //Thêm các routes này dưới dạng permission database
  if (routesToAdd.length > 0) {
    const permissionToAdd = await prisma.permission.createMany({
      data: routesToAdd,
      skipDuplicates: true,
    });

    console.log('Added permission', permissionToAdd.count);
  } else {
    console.log('No permission to add');
  }

  // Lấy lại permissions trong database sau khi thêm mới hoặc bị xóa
  const updatedPermissionInDb = await prisma.permission.findMany({
    where: {
      deletedAt: null,
    },
  });

  // Cập nhật lại các permissions trong Admin Role
  const adminRole = await prisma.role.findFirstOrThrow({
    where: {
      name: RoleName.Admin,
      deletedAt: null,
    },
  });

  await prisma.role.update({
    where: {
      id: adminRole.id,
    },
    data: {
      permissions: {
        set: updatedPermissionInDb.map((item) => ({ id: item.id })),
      },
    },
  });

  process.exit(0);
}
bootstrap();

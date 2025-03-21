import { PermissionSchema } from 'src/shared/models/shared-permission.model';
import { z } from 'zod';

export const GetPermissionResSchema = z.object({
  data: z.array(PermissionSchema),
  totalItems: z.number(), // tong so item
  page: z.number(), // trang hien tai
  limit: z.number(), // so item tren 1 trang
  totalPages: z.number(), // tong so trang
});

export const GetPermissionQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(10),
  })
  .strict();

export const GetPermissionParamsSchema = z
  .object({
    permissionId: z.coerce.number(),
  })
  .strict();

export const GetPermissionDetailResSchema = PermissionSchema;

export const CreatePermissionBodySchema = PermissionSchema.pick({
  name: true,
  method: true,
  path: true,
  module: true,
}).strict();

export const UpdatePermissionBodySchema = CreatePermissionBodySchema;

export type GetPermissionResType = z.infer<typeof GetPermissionResSchema>;
export type GetPermissionQueryType = z.infer<typeof GetPermissionQuerySchema>;
export type GetPermissionParamsType = z.infer<typeof GetPermissionParamsSchema>;
export type GetPermissionDetailResType = z.infer<typeof GetPermissionDetailResSchema>;
export type CreatePermissionBodyType = z.infer<typeof CreatePermissionBodySchema>;
export type UpdatePermissionBodyType = z.infer<typeof UpdatePermissionBodySchema>;

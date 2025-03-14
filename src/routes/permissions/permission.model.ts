import { HTTPMethod } from 'src/shared/constants/permission.constant';
import { z } from 'zod';

export const PermissionSchema = z.object({
  id: z.number(),
  name: z.string().max(500),
  description: z.string(),
  path: z.string().max(1000),
  method: z.enum([
    HTTPMethod.GET,
    HTTPMethod.POST,
    HTTPMethod.PUT,
    HTTPMethod.DELETE,
    HTTPMethod.PATCH,
    HTTPMethod.OPTIONS,
    HTTPMethod.HEAD,
  ]),
  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

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
}).strict();

export const UpdatePermissionBodySchema = CreatePermissionBodySchema;

export type PermissionType = z.infer<typeof PermissionSchema>;
export type GetPermissionResType = z.infer<typeof GetPermissionResSchema>;
export type GetPermissionQueryType = z.infer<typeof GetPermissionQuerySchema>;
export type GetPermissionParamsType = z.infer<typeof GetPermissionParamsSchema>;
export type GetPermissionDetailResType = z.infer<typeof GetPermissionDetailResSchema>;
export type CreatePermissionBodyType = z.infer<typeof CreatePermissionBodySchema>;
export type UpdatePermissionBodyType = z.infer<typeof UpdatePermissionBodySchema>;

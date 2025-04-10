import { z } from 'zod';
import { RoleSchema } from 'src/shared/models/shared-role.model';
import { PermissionSchema } from 'src/shared/models/shared-permission.model';

export const RoleWithPermissionsSchema = RoleSchema.extend({
  permissions: z.array(PermissionSchema),
});

export const GetRolesResSchema = z.object({
  data: z.array(RoleSchema),
  totalItems: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

export const GetRoleParamsSchema = z
  .object({
    roleId: z.coerce.number(),
  })
  .strict();

export const GetRoleDetailResSchema = RoleWithPermissionsSchema;

export const CreateRoleBodyShema = RoleSchema.pick({
  name: true,
  description: true,
  isActive: true,
}).strict();

export const CreateRoleResSchema = RoleSchema;

export const UpdateRoleBodySchema = RoleSchema.pick({
  name: true,
  isActive: true,
  description: true,
})
  .extend({
    permissionIds: z.array(z.number()),
  })
  .strict();

export type RoleWithPermissionsType = z.infer<typeof RoleWithPermissionsSchema>;
export type GetRolesResType = z.infer<typeof GetRolesResSchema>;
export type GetRoleParamsType = z.infer<typeof GetRoleParamsSchema>;
export type GetRoleDetailResType = z.infer<typeof GetRoleDetailResSchema>;
export type CreateRoleBodyType = z.infer<typeof CreateRoleBodyShema>;
export type CreateRoleResType = z.infer<typeof CreateRoleResSchema>;
export type UpdateRoleBodyType = z.infer<typeof UpdateRoleBodySchema>;

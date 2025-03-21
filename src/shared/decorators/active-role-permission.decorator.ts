import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RolePermissionsType } from 'src/shared/models/shared-role.model';
import { REQUEST_ROLE_PERMISSIONS } from '../constants/auth.constant';

export const ActiveRolePermission = createParamDecorator(
  (field: keyof RolePermissionsType | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const rolePermissions: RolePermissionsType | undefined = request[REQUEST_ROLE_PERMISSIONS];
    return field ? rolePermissions?.[field] : rolePermissions;
  },
);

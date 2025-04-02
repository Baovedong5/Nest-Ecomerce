import { createZodDto } from 'nestjs-zod';
import {
  CreateRoleBodyShema,
  CreateRoleResSchema,
  GetRoleDetailResSchema,
  GetRoleParamsSchema,
  GetRolesResSchema,
  UpdateRoleBodySchema,
} from './role.model';

export class GetRolesResDTO extends createZodDto(GetRolesResSchema) {}

export class GetRoleParamsDTO extends createZodDto(GetRoleParamsSchema) {}

export class GetRoleDetailResDTO extends createZodDto(GetRoleDetailResSchema) {}

export class CreateRoleBodyDTO extends createZodDto(CreateRoleBodyShema) {}

export class CreateRoleResDTO extends createZodDto(CreateRoleResSchema) {}

export class UpdatRoleBodyDTO extends createZodDto(UpdateRoleBodySchema) {}

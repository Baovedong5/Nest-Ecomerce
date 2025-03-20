import { createZodDto } from 'nestjs-zod';
import { GetUserProfileResSchema, UpdateProfileResSchema } from '../models/shared-user.model';

export class GetUserProfileResDTO extends createZodDto(GetUserProfileResSchema) {}

export class UpdateProfileResDTO extends createZodDto(UpdateProfileResSchema) {}

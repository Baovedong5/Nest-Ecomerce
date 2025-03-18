import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import { RoleService } from './role.service';
import {
  CreateRoleBodyDTO,
  CreateRoleResDTO,
  GetRoleDetailResDTO,
  GetRoleParamsDTO,
  GetRolesQueryDTO,
  GetRolesResDTO,
  UpdatRoleBodyDTO,
} from './role.dto';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';
import { MessageResDTO } from 'src/shared/dtos/response.dto';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @ZodSerializerDto(GetRolesResDTO)
  list(@Query() query: GetRolesQueryDTO) {
    return this.roleService.list({
      page: query.page,
      limit: query.limit,
    });
  }

  @Get(':roleId')
  @ZodSerializerDto(GetRoleDetailResDTO)
  findById(@Param() params: GetRoleParamsDTO) {
    return this.roleService.findById(params.roleId);
  }

  @Post()
  @ZodSerializerDto(CreateRoleResDTO)
  create(@Body() body: CreateRoleBodyDTO, @ActiveUser('userId') userId: number) {
    return this.roleService.create({
      createdById: userId,
      data: body,
    });
  }

  @Put(':roleId')
  @ZodSerializerDto(GetRoleDetailResDTO)
  update(@Param() params: GetRoleParamsDTO, @Body() body: UpdatRoleBodyDTO, @ActiveUser('userId') userId: number) {
    return this.roleService.update({
      id: params.roleId,
      data: body,
      updatedById: userId,
    });
  }

  @Delete(':roleId')
  @ZodSerializerDto(MessageResDTO)
  delete(@Param() params: GetRoleParamsDTO, @ActiveUser('userId') userId: number) {
    return this.roleService.delete({
      deletedById: userId,
      id: params.roleId,
    });
  }
}

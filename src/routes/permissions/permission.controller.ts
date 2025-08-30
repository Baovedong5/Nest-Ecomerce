import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ZodResponse, ZodSerializerDto } from 'nestjs-zod';
import {
  CreatePermissionBodyDTO,
  GetPermissionDetailResDTO,
  GetPermissionParamsDTO,
  GetPermissionsResDTO,
  UpdatePermissionBodyDTO,
} from './permission.dto';
import { PermissionService } from './permission.service';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';
import { MessageResDTO } from 'src/shared/dtos/response.dto';
import { PaginationQueryDTO } from 'src/shared/dtos/request.dto';

@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  @ZodResponse({ type: GetPermissionsResDTO })
  list(@Query() query: PaginationQueryDTO) {
    return this.permissionService.list({
      page: query.page,
      limit: query.limit,
    });
  }

  @Get(':permissionId')
  @ZodResponse({ type: GetPermissionDetailResDTO })
  findById(@Param() params: GetPermissionParamsDTO) {
    return this.permissionService.findById(params.permissionId);
  }

  @Post()
  @ZodResponse({ type: GetPermissionDetailResDTO })
  create(@Body() body: CreatePermissionBodyDTO, @ActiveUser('userId') userId: number) {
    return this.permissionService.create({
      data: body,
      createdById: userId,
    });
  }

  @Put(':permissionId')
  @ZodResponse({ type: GetPermissionDetailResDTO })
  update(
    @Param() params: GetPermissionParamsDTO,
    @Body() body: UpdatePermissionBodyDTO,
    @ActiveUser('userId') userId: number,
  ) {
    return this.permissionService.update({
      data: body,
      permissionId: params.permissionId,
      updatedById: userId,
    });
  }

  @Delete(':permissionId')
  @ZodResponse({ type: MessageResDTO })
  delete(@Param() params: GetPermissionParamsDTO, @ActiveUser('userId') userId: number) {
    return this.permissionService.delete({
      permissionId: params.permissionId,
      deletedById: userId,
    });
  }
}

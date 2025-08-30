import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { ZodResponse, ZodSerializerDto } from 'nestjs-zod';
import {
  CreateUserBodyDTO,
  CreateUserResDTO,
  GetUserParamsDTO,
  GetUserQueryDTO,
  GetUsersResDTO,
  UpdateUserBodyDTO,
} from './user.dto';
import { GetUserProfileResDTO, UpdateProfileResDTO } from 'src/shared/dtos/shared-user.dto';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';
import { ActiveRolePermission } from 'src/shared/decorators/active-role-permission.decorator';
import { MessageResDTO } from 'src/shared/dtos/response.dto';
import { ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';

@Controller('users')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiQuery({ name: 'page', type: Number })
  @ApiQuery({ name: 'limit', type: Number })
  @ZodResponse({ type: GetUsersResDTO })
  list(@Query() query: GetUserQueryDTO) {
    return this.userService.list({
      page: query.page,
      limit: query.limit,
    });
  }

  @Get(':userId')
  @ApiParam({ name: 'userId', type: String })
  @ZodResponse({ type: GetUserProfileResDTO })
  findById(@Param() params: GetUserParamsDTO) {
    return this.userService.findById(params.userId);
  }

  @Post()
  @ZodResponse({ type: CreateUserResDTO })
  create(
    @Body() body: CreateUserBodyDTO,
    @ActiveUser('userId') userId: number,
    @ActiveRolePermission('name') roleName: string,
  ) {
    return this.userService.create({
      data: body,
      createdById: userId,
      createdByRoleName: roleName,
    });
  }

  @Put(':userId')
  @ApiParam({ name: 'userId', type: String })
  @ZodResponse({ type: UpdateProfileResDTO })
  update(
    @Body() body: UpdateUserBodyDTO,
    @Param() params: GetUserParamsDTO,
    @ActiveUser('userId') userId: number,
    @ActiveRolePermission('name') roleName: string,
  ) {
    return this.userService.update({
      data: body,
      id: params.userId,
      updatedById: userId,
      updatedByRoleName: roleName,
    });
  }

  @Delete(':userId')
  @ApiParam({ name: 'userId', type: String })
  @ZodResponse({ type: MessageResDTO })
  delete(
    @Param() params: GetUserParamsDTO,
    @ActiveUser('userId') userId: number,
    @ActiveRolePermission('name') roleName: string,
  ) {
    return this.userService.delete({
      id: params.userId,
      deletedById: userId,
      deletedByRoleName: roleName,
    });
  }
}

import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { ZodResponse, ZodSerializerDto } from 'nestjs-zod';
import {
  CancelOrderResDTO,
  CreateOrderBodyDTO,
  CreateOrderResDTO,
  GetOrderDetailResDTO,
  GetOrderListQueryDTO,
  GetOrderListResDTO,
  GetOrderParamsDTO,
} from './order.dto';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @ZodResponse({ type: GetOrderListResDTO })
  list(@ActiveUser('userId') userId: number, @Query() query: GetOrderListQueryDTO) {
    return this.orderService.list(userId, query);
  }

  @Post()
  @ZodResponse({ type: CreateOrderResDTO })
  create(@ActiveUser('userId') userId: number, @Body() body: CreateOrderBodyDTO) {
    return this.orderService.create(userId, body);
  }

  @Get(':orderId')
  @ZodResponse({ type: GetOrderDetailResDTO })
  detail(@ActiveUser('userId') userId: number, @Param() params: GetOrderParamsDTO) {
    return this.orderService.detail(userId, params.orderId);
  }

  @Put(':orderId')
  @ZodResponse({ type: CancelOrderResDTO })
  cancel(@ActiveUser('userId') userId: number, @Param() params: GetOrderParamsDTO) {
    return this.orderService.cancel(userId, params.orderId);
  }
}

import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderRepository } from './order.repo';
import { OrderService } from './order.service';

@Module({
  controllers: [OrderController],
  providers: [OrderRepository, OrderService],
})
export class OrderModule {}

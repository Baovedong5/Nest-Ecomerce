import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderRepository } from './order.repo';
import { OrderService } from './order.service';
import { BullModule } from '@nestjs/bullmq';
import { PAYMENT_QUEUE_NAME } from 'src/shared/constants/queue.constatnt';
import { OrderProducer } from './order.producer';

@Module({
  imports: [
    BullModule.registerQueue({
      name: PAYMENT_QUEUE_NAME,
    }),
  ],
  controllers: [OrderController],
  providers: [OrderRepository, OrderService, OrderProducer],
})
export class OrderModule {}

import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PaymentRepo } from './payment.repo';
import { PaymentProducer } from './paymeny.producer';
import { BullModule } from '@nestjs/bullmq';
import { PAYMENT_QUEUE_NAME } from 'src/shared/constants/queue.constatnt';

@Module({
  imports: [
    BullModule.registerQueue({
      name: PAYMENT_QUEUE_NAME,
    }),
  ],
  controllers: [PaymentController],
  providers: [PaymentService, PaymentRepo, PaymentProducer],
})
export class PaymentModule {}

import { Body, Controller, Post } from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import { IsPublic } from 'src/shared/decorators/auth.decorator';
import { MessageResDTO } from 'src/shared/dtos/response.dto';
import { WebhookPaymentBodyDTO } from './payment.dto';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('receiver')
  @ZodSerializerDto(MessageResDTO)
  @IsPublic()
  receiver(@Body() body: WebhookPaymentBodyDTO) {
    return this.paymentService.receiver(body);
  }
}

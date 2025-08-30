import { Body, Controller, Post } from '@nestjs/common';
import { ZodResponse, ZodSerializerDto } from 'nestjs-zod';
import { Auth, IsPublic } from 'src/shared/decorators/auth.decorator';
import { MessageResDTO } from 'src/shared/dtos/response.dto';
import { WebhookPaymentBodyDTO } from './payment.dto';
import { PaymentService } from './payment.service';
import { ApiSecurity } from '@nestjs/swagger';

@Controller('payment')
@ApiSecurity('payment-key')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('receiver')
  @ZodResponse({ type: MessageResDTO })
  @Auth(['PaymentAPIKey'])
  receiver(@Body() body: WebhookPaymentBodyDTO) {
    return this.paymentService.receiver(body);
  }
}

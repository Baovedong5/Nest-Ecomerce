import { Injectable } from '@nestjs/common';
import { PaymentRepo } from './payment.repo';
import { WebhookPaymentBodyType } from './payment.model';
import { SharedWebsocketRepo } from 'src/shared/repositories/shared-websocket.repo';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { generateRoomUserId } from 'src/shared/helper';

@Injectable()
@WebSocketGateway({ namespace: 'payment' })
export class PaymentService {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly paymentRepo: PaymentRepo,
    private readonly sharedWebsocketRepo: SharedWebsocketRepo,
  ) {}

  async receiver(body: WebhookPaymentBodyType) {
    const userId = await this.paymentRepo.receiver(body);

    this.server.to(generateRoomUserId(userId)).emit('payment', {
      status: 'success',
    });

    // try {
    //   const websocket = await this.sharedWebsocketRepo.findMany(userId);

    //   websocket.forEach((ws) => {
    //     this.server.to(ws.id).emit('payment', {
    //       status: 'success',
    //     });
    //   });
    // } catch (error) {
    //   console.log(error);
    // }

    return {
      message: 'Payment received successfully',
    };
  }
}
